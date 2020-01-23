/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.reimport;

import de.unisaarland.swan.Utility;
import de.unisaarland.swan.business.Service;
import de.unisaarland.swan.dao.*;

import javax.ejb.CreateException;
import java.io.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.ParserConfigurationException;

import de.unisaarland.swan.entities.*;
import de.unisaarland.swan.entities.Annotation;
import de.unisaarland.swan.entities.Document;
import de.unisaarland.swan.entities.Label;
import de.unisaarland.swan.entities.LabelSet;
import de.unisaarland.swan.entities.Link;
import de.unisaarland.swan.entities.LinkType;
import de.unisaarland.swan.entities.Users;
import de.unisaarland.swan.export.model.xml.*;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import javax.ws.rs.core.Response;

public class ImportUtil {

	final AnnotationDAO annotationDAO;
	final LinkDAO linkDAO;
	final UsersDAO usersDAO;
	final SchemeDAO schemeDAO;
	final ProjectDAO projectDAO;
	final Service service;

	private static MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();
	private static MapperFacade mapperFacade = mapperFactory.getMapperFacade();

	private Map<String, Users> emailUserMap = new HashMap<>();
	private Map<String, de.unisaarland.swan.entities.Document> documentMap = new HashMap<>();
	private Map<String, SpanType> spanTypeMap = new HashMap<>();
	private Map<String, LabelSet> labelSetMap = new HashMap<>();
	private Map<String, LinkType> linkTypeMap = new HashMap<>();

	// To give objects temporary IDs, so the equals method works properly
	private long id = 0;

	public ImportUtil(AnnotationDAO annotationDAO, LinkDAO linkDAO, UsersDAO usersDAO, SchemeDAO schemeDAO,
					   ProjectDAO projectDAO, Service service) {
		this.annotationDAO = annotationDAO;
		this.linkDAO = linkDAO;
		this.usersDAO = usersDAO;
		this.schemeDAO = schemeDAO;
		this.projectDAO = projectDAO;
		this.service = service;
	}

	private long getNewId() {
		id += 1;
		return id;
	}

	/**
	 * Import project from zipped project file. If the scheme or the users do not exist in the database they will be created.
	 *
	 * @param is
	 * @throws CreateException
	 * @throws IOException
	 */
	public Response importProjectXML(InputStream is, long userId, String projectName, Project.TokenizationLang tokenizationLang) throws CreateException, IOException,
		ParserConfigurationException, SAXException, JAXBException {

		Project project = new Project();
		project.setName(projectName);
		project.setTokenizationLang(tokenizationLang);

		Set<Annotation> annotations = new HashSet<>();
		Set<Link> links = new HashSet<>();
		List<de.unisaarland.swan.export.model.xml.Document> xmlDocs = new LinkedList<>();

		// Read InputStream
		BufferedInputStream bis = new BufferedInputStream(is);
		ZipInputStream zis = new ZipInputStream(bis);
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ZipEntry entry;

		while ((entry = zis.getNextEntry()) != null) {
			String fileName = entry.getName();

			byte[] buffer = new byte[2048];
			int len;

			while ((len = zis.read(buffer)) > 0) {
				baos.write(buffer, 0, len);
			}

			byte[] content = baos.toByteArray();
			baos.reset();

			// See if file is a text document
			if (fileName.endsWith(".txt")) {
				String docName = fileName.substring(0, fileName.length()-4);

				// Create new document and add to project
				de.unisaarland.swan.entities.Document document = createDocument(docName, project, content);
				project.addDocument(document);
				documentMap.put(docName, document);
				continue;
			}

			if (fileName.endsWith(".xml")) {
				org.w3c.dom.Document doc = parseXML(content);

				String type = doc.getDocumentElement().getTagName();

				switch (type) {
					case "document":
						xmlDocs.add(unmarshalXmlAnnotations(doc));
						break;
					case "scheme":
						if (project.getScheme() != null) {
							throw new CreateException("More than one scheme file given");
						}

						Scheme scheme = parseScheme(doc, project, userId);

						// Add scheme to project
						project.setScheme(scheme);
						fillSchemeMaps(scheme);
						break;
					default:
						throw new CreateException("Invalid XML file");
				}
			}
		}

		// Check if Scheme file was parsed
		if (project.getScheme() == null) {
			throw new CreateException("Scheme file is missing");
		}

		// Parse Annotations
		for (de.unisaarland.swan.export.model.xml.Document xmlDoc : xmlDocs) {
			parseAnnotations(xmlDoc, project, annotations, links);
		}

		// Add States
		for (de.unisaarland.swan.entities.Document document : project.getDocuments()) {
			for (Users user : project.getUsers()) {
				addState(user, document);
			}
		}

		// If no Exception was thrown in previous steps, the project is consistent and can be created in the database
		processProject(project, annotations, links);
		return projectDAO.create(project);
	}

	/**
	 * Created new document entity from content of .txt file.
	 *
	 * @param name
	 * @param project
	 * @param content
	 * @return
	 * @throws CreateException
	 */
	private de.unisaarland.swan.entities.Document createDocument(String name, Project project, byte[] content) throws CreateException {
		if (content.length > 1000000) {
			throw new CreateException("Text file too large");
		}

		String text = new String(content);
		de.unisaarland.swan.entities.Document document = new de.unisaarland.swan.entities.Document();
		document.setId(getNewId());
		document.setName(name);
		document.setProject(project);
		document.setText(text);
		return document;
	}

	private org.w3c.dom.Document parseXML(byte[] content) throws ParserConfigurationException, IOException, SAXException, CreateException, JAXBException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		org.w3c.dom.Document doc = builder.parse(new ByteArrayInputStream(content));
		return doc;
	}


	/**
	 * Reads xml Document containing the Annotations and Links and creates them.
	 *
	 * @param xmlDoc
	 * @param project
	 * @param annotations
	 * @param links
	 * @throws JAXBException
	 * @throws CreateException
	 */
	private void parseAnnotations(de.unisaarland.swan.export.model.xml.Document xmlDoc, Project project,
								  Set<Annotation> annotations, Set<Link> links)
		throws JAXBException, CreateException {

		// Get the user
		de.unisaarland.swan.export.model.xml.Users xmlUser = xmlDoc.getUser();
		Users user = getUser(xmlUser, emailUserMap, project);

		// Get Document
		String docName = xmlDoc.getName();
		de.unisaarland.swan.entities.Document document;
		if (documentMap.containsKey(docName)) {
			document = documentMap.get(docName);
		} else {
			throw new CreateException("Missing .txt file for Document '" + docName + "'" );
		}

		// Create annotations
		Map<Long, Annotation> annotationMap = new HashMap<>();
		AnnotationSet annoSet = xmlDoc.getAnnotations();
		for (de.unisaarland.swan.export.model.xml.Annotation xmlAnno : annoSet.getAnnotations()) {
			annotations.add(createAnnotation(xmlAnno, user, document, annotationMap));
		}

		// Create links
		de.unisaarland.swan.export.model.xml.LinkType linkSet = xmlDoc.getLinks();
		for (de.unisaarland.swan.export.model.xml.Link xmlLink : linkSet.getLinks()) {
			links.add(createLink(xmlLink, user, document, annotationMap));
		}
	}

	/**
	 * Creates a new Annotation entity.
	 *
	 * @param xmlAnno
	 * @param user
	 * @param document
	 * @param annotationMap
	 * @return
	 * @throws CreateException
	 */
	private Annotation createAnnotation(de.unisaarland.swan.export.model.xml.Annotation xmlAnno, Users user,
										de.unisaarland.swan.entities.Document document,
										Map<Long, Annotation> annotationMap) throws CreateException {
		Annotation anno = new Annotation();
		anno.setId(xmlAnno.getId());
		anno.setUser(user);
		anno.setDocument(document);
		anno.setStart(xmlAnno.getStart());
		anno.setEnd(xmlAnno.getEnd());

		// Set text
		anno.setText(document.getText().substring(anno.getStart(), anno.getEnd()));

		// Set SpanType
		SpanType spanType;
		if (spanTypeMap.containsKey(xmlAnno.getSpanType())) {
			spanType = spanTypeMap.get(xmlAnno.getSpanType());
		} else {
			// SpanType not defined in Scheme
			throw new CreateException("Mismatch of Annotations and Scheme");
		}
		anno.setSpanType(spanType);

		// Set Labels
		for (de.unisaarland.swan.export.model.xml.Label xmlLabel : xmlAnno.getLabels()) {
			String labelSetName = xmlLabel.getlabelSetName();
			if (labelSetMap.containsKey(labelSetName)) {
				LabelSet labelSet = labelSetMap.get(labelSetName);
				// Check SpanType
				if (!labelSet.getAppliesToSpanTypes().contains(spanType)) {
					throw new CreateException("Mismatch of Annotations and Scheme");
				}
				// Find Labels
				boolean found;
				for (String labelName : xmlLabel.getLabel()) {
					found = false;
					for (Label label : labelSet.getLabels()) {
						if (label.getName().equals(labelName)) {
							anno.addLabel(label);
							found = true;
							break;
						}
					}
					if (!found) {
						// LabelSet doesn't contain specified Label
						throw new CreateException("Mismatch of Annotations and Scheme");
					}
				}
			} else {
				// LabelSet not in Scheme
				throw new CreateException("Mismatch of Annotations and Scheme");
			}
		}

		annotationMap.put(anno.getId(), anno);
		return anno;
	}

	/**
	 * Creates a new link entity.
	 *
	 * @param xmlLink
	 * @param user
	 * @param document
	 * @param annotationMap
	 * @return
	 * @throws CreateException
	 */
	private Link createLink(de.unisaarland.swan.export.model.xml.Link xmlLink, Users user,
							de.unisaarland.swan.entities.Document document,
							Map<Long, Annotation> annotationMap) throws CreateException {
		Link link = new Link();
		link.setId(getNewId());
		link.setUser(user);
		link.setDocument(document);

		// Set Annotations
		Annotation anno1 = annotationMap.get(xmlLink.getFrom());
		Annotation anno2 = annotationMap.get(xmlLink.getTo());

		if (anno1 == null || anno2 == null) {
			// Annotations don't exist
			throw new CreateException("Inconsistent Annotations/Links");
		}

		link.setAnnotation1(anno1);
		link.setAnnotation2(anno2);

		// Set LinkLabels
		for (de.unisaarland.swan.export.model.xml.Label xmlLabel : xmlLink.getLabels()) {
			String linkTypeName = xmlLabel.getlabelSetName();
			if (linkTypeMap.containsKey(linkTypeName)) {
				LinkType linkType = linkTypeMap.get(linkTypeName);
				// Check SpanTypes
				if (!linkType.getStartSpanType().equals(anno1.getSpanType()) || !linkType.getEndSpanType().equals(anno2.getSpanType())) {
					// Annotation don't have the correct SpanType
					throw new CreateException("Mismatch of Annotations and Scheme");
				}

				// Find Labels
				boolean found;
				for (String labelName : xmlLabel.getLabel()) {
					found = false;
					for (LinkLabel label : linkType.getLinkLabels()) {
						if (label.getName().equals(labelName)) {
							link.addLabel(label);
							found = true;
							break;
						}
					}
					if (!found) {
						// LinkType doesn't contain specified Label
						throw new CreateException("Mismatch of Annotations and Scheme");
					}
				}
			} else {
				// LinkType not in Scheme
				throw new CreateException("Mismatch of Annotations and Scheme");
			}
		}

		return link;
	}

	/**
	 * Reads the xml file containing the scheme. If the scheme does not exist in the database, a new scheme is created.
	 *
	 * @param doc
	 * @param project
	 * @param userId
	 * @return
	 * @throws CreateException
	 * @throws JAXBException
	 */
	private Scheme parseScheme(org.w3c.dom.Document doc, Project project, long userId) throws CreateException, JAXBException {
		de.unisaarland.swan.export.model.xml.scheme.Scheme xmlScheme = unmarshalXmlScheme(doc);
		Scheme scheme = (Scheme) mapperFacade.map(xmlScheme, Scheme.class);

		// Check if Scheme already exists
		String name = scheme.getName();
		List<Scheme> existingSchemes = schemeDAO.findAll();
		Set<String> existingNames = new HashSet<>();
		for (Scheme existingScheme : existingSchemes) {
			existingNames.add(existingScheme.getName());
			if (name.equals(existingScheme.getName())) {
				if (equalsExistingScheme(scheme, existingScheme)) {
					// If schemes are equal set project scheme to the already existing scheme and return
					return existingScheme;
				}
			}
		}

		// If scheme with the same name exists, but they are not equal, change name
		while (existingNames.contains(name)) {
			name = "Copy of " + name;
		}
		scheme.setName(name);

		// Add missing fields
		Users creator = usersDAO.find(userId);
		scheme.setCreator(creator);
		ColorScheme colorScheme = new ColorScheme();
		colorScheme.setColorMode(ColorScheme.ColorMode.automatic);
		colorScheme.setScheme(scheme);
		scheme.setColorScheme(colorScheme);

		service.process(scheme);

		// TODO if something fails later, the scheme will still be in the database
		// This needs to be done because the equals method fails if no IDs are set
		schemeDAO.create(scheme);

		return scheme;
	}

	private void fillSchemeMaps(Scheme scheme) {
		for (SpanType span : scheme.getSpanTypes()) {
			spanTypeMap.put(span.getName(), span);
		}
		for (LabelSet labelSet : scheme.getLabelSets()) {
			labelSetMap.put(labelSet.getName(), labelSet);
		}
		for (LinkType linkType : scheme.getLinkTypes()) {
			linkTypeMap.put(linkType.getName(), linkType);
		}
	}

	/**
	 * See if user has already been added and create/add user if necessary, then return the Users object.
	 *
	 * @param xmlUser
	 * @param emailUserMap
	 * @param project
	 * @return
	 */
	private Users getUser(de.unisaarland.swan.export.model.xml.Users xmlUser, Map<String, Users> emailUserMap, Project project) {
		String email = xmlUser.getEmail();


		if (emailUserMap.containsKey(email)) {
			// If user has already been added to project, simply return Users object
			return emailUserMap.get(email);
		} else {
			// See if user already exists	°
			Users user = usersDAO.getUserByEmail(email);
			if (user == null) {
				user = createUser(xmlUser);
			}
			project.addUsers(user);
			emailUserMap.put(email, user);
			return user;
		}
	}

	/**
	 * Creates a new User entity.
	 *
	 * @param xmlUser
	 * @return
	 */
	private Users createUser(de.unisaarland.swan.export.model.xml.Users xmlUser) {
		Users user = new Users();
		user.setId(getNewId());
		user.setPrename(xmlUser.getPrename());
		user.setLastname(xmlUser.getLastname());
		user.setEmail(xmlUser.getEmail());
		user.setPassword(Utility.hashPassword("default"));
		user.setRole(Users.RoleType.annotator);
		user.setCreateDate(Utility.getCurrentTime());
		return user;
	}

	private de.unisaarland.swan.export.model.xml.scheme.Scheme unmarshalXmlScheme(org.w3c.dom.Document doc) throws JAXBException {
		JAXBContext jaxbContext = JAXBContext.newInstance(de.unisaarland.swan.export.model.xml.scheme.Scheme.class);
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		de.unisaarland.swan.export.model.xml.scheme.Scheme xmlScheme = (de.unisaarland.swan.export.model.xml.scheme.Scheme) jaxbUnmarshaller.unmarshal(doc);
		return xmlScheme;
	}

	private de.unisaarland.swan.export.model.xml.Document unmarshalXmlAnnotations(org.w3c.dom.Document doc) throws JAXBException {
		JAXBContext jaxbContext = JAXBContext.newInstance(de.unisaarland.swan.export.model.xml.Document.class);
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		de.unisaarland.swan.export.model.xml.Document parsedAnnotations = (de.unisaarland.swan.export.model.xml.Document) jaxbUnmarshaller.unmarshal(doc);
		return parsedAnnotations;
	}

	/**
	 * Compares two schemes by comparing the names of all SpanTypes, LabelSets, Labels etc.
	 *
	 * @param parsedScheme
	 * @param existingScheme
	 * @return
	 */
	private boolean equalsExistingScheme(Scheme parsedScheme, Scheme existingScheme) {
		// Compare VisElements
		for (VisualizationElement parsedElement : parsedScheme.getVisElements()) {
			for (VisualizationElement existingElement : existingScheme.getVisElements()) {
				if (parsedElement.getVisKind().equals(existingElement.getVisKind())) {
					if (parsedElement.getVisState().equals(existingElement.getVisState())) {
						break;
					} else {
						return false;
					}
				}
			}
		}

		// Compare SpanTypes
		Set<String> parsed = new HashSet<>();
		Set<String> existing = new HashSet<>();

		for (SpanType parsedSpan : parsedScheme.getSpanTypes()) {
			parsed.add(parsedSpan.getName());
		}
		for (SpanType existingSpan : existingScheme.getSpanTypes()) {
			existing.add(existingSpan.getName());
		}

		if (!parsed.equals(existing)) {
			return false;
		}


		// Compare Label Sets
		boolean found;
		for (LabelSet parsedLabelSet : parsedScheme.getLabelSets()) {
			found = false;
			for (LabelSet existingLabelSet : existingScheme.getLabelSets()) {
				if (parsedLabelSet.getName().equals(existingLabelSet.getName())) {
					if (parsedLabelSet.isExclusive() != existingLabelSet.isExclusive()) {
						return false;
					}

					// Compare appliesToSpanTypes
					parsed.clear();
					existing.clear();
					for (SpanType parsedSpan : parsedLabelSet.getAppliesToSpanTypes()) {
						parsed.add(parsedSpan.getName());
					}
					for (SpanType existingSpan : existingLabelSet.getAppliesToSpanTypes()) {
						existing.add(existingSpan.getName());
					}
					if (!parsed.equals(existing)) {
						return false;
					}

					// Compare Labels
					parsed.clear();
					existing.clear();
					for (Label parsedLabel : parsedLabelSet.getLabels()) {
						parsed.add(parsedLabel.getName());
					}
					for (Label existingLabel : existingLabelSet.getLabels()) {
						existing.add(existingLabel.getName());
					}
					if (!parsed.equals(existing)) {
						return false;
					}

					found = true;
					break;
				}
			}

			if (!found) {
				return false;
			}
		}


		// Compare Link Types
		for (LinkType parsedLink : parsedScheme.getLinkTypes()) {
			found = false;
			for (LinkType existingLink : existingScheme.getLinkTypes()) {
				if (parsedLink.getName().equals(existingLink.getName())) {
					if (!parsedLink.getStartSpanType().getName().equals(existingLink.getStartSpanType().getName())) {
						return false;
					}
					if (!parsedLink.getEndSpanType().getName().equals(existingLink.getEndSpanType().getName())) {
						return false;
					}

					// Compare Labels
					parsed.clear();
					existing.clear();
					for (LinkLabel parsedLabel : parsedLink.getLinkLabels()) {
						parsed.add(parsedLabel.getName());
					}
					for (LinkLabel existingLabel : existingLink.getLinkLabels()) {
						existing.add(existingLabel.getName());
					}
					if (!parsed.equals(existing)) {
						return false;
					}

					found = true;
					break;
				}
			}
			if (!found) {
				return false;
			}
		}

		return true;
	}
		/**
	 *
	 * @param user
	 * @param document
	 */
	private void addState(Users user, de.unisaarland.swan.entities.Document document) {
		State state = new State();
		state.setId(getNewId());
		state.setDocument(document);
		state.setUser(user);
		document.addStates(state);
	}

	/**
	 *
	 * @param project
	 * @param annotations
	 * @param links
	 */
	private void processProject(Project project, Set<Annotation> annotations, Set<Link> links) {
		// Add project to scheme and users
		project.getScheme().addProjects(project);
		for (Users user : project.getUsers()) {
			user.addProjects(project);
		}

		// Create Annotations
		for (Annotation anno : annotations) {
			annotationDAO.create(anno);
		}
		for (Link link : links) {
			linkDAO.create(link);
		}
	}


}
