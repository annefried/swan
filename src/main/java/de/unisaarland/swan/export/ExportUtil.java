/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export;

import de.unisaarland.swan.dao.AnnotationDAO;
import de.unisaarland.swan.dao.LinkDAO;
import de.unisaarland.swan.entities.*;
import de.unisaarland.swan.entities.Users;
import de.unisaarland.swan.export.model.xml.*;
import de.unisaarland.swan.export.model.uima.SwanAnnotation;
import de.unisaarland.swan.export.model.uima.SwanLabel;
import de.unisaarland.swan.export.model.uima.SwanLink;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import de.unisaarland.swan.export.model.xml.Label;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;
import org.apache.commons.io.FileUtils;
import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.factory.TypeSystemDescriptionFactory;
import org.apache.uima.fit.util.CasIOUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.cas.EmptyFSList;
import org.apache.uima.jcas.cas.FSList;
import org.apache.uima.jcas.cas.NonEmptyFSList;
import org.apache.uima.resource.ResourceInitializationException;
import org.apache.uima.resource.metadata.TypeSystemDescription;
import org.xml.sax.SAXException;

/**
 * @author Timo Guehring
 * @author Annemarie Friedrich
 */
public class ExportUtil {

    private static MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();
    private static MapperFacade mapperFacade = mapperFactory.getMapperFacade();
    private static final Class SCHEME_EXPORT_CLASS = de.unisaarland.swan.export.model.xml.scheme.Scheme.class;

    final AnnotationDAO annotationDAO;
    final LinkDAO linkDAO;

    public ExportUtil(AnnotationDAO annotationDAO, LinkDAO linkDAO) {
        this.annotationDAO = annotationDAO;
        this.linkDAO = linkDAO;
    }

    /**
     * Returns a zip file containing one XMI per document, UIMA annotations are
     * created for each document for all annotators that were assigned to the
     * project.
     *
     * @param proj Project
     * @return zip file
     */
    public File getExportDataInXMI(Project proj) {
        try {
            File zipFile = new File("swan_" + proj.getName() + ".zip");
            ZipOutputStream zos = createZipOutputStream(zipFile);

            for (de.unisaarland.swan.entities.Document d : proj.getDocuments()) {
            	addTxtFile(d, zos);
                File xmiFile = createXMIFileForDocument(d);
                createZipEntry(xmiFile, zos);
            }

            // Add type system for convenience
            File typeSystemFile = createTypeSystemFile();
            createZipEntry(typeSystemFile, zos);
			zos.finish();
            zos.close();

            return zipFile;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UIMAException | SAXException | IOException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Error while creating UIMA XMI files / zipping");
    }

    private File createXMIFileForDocument(de.unisaarland.swan.entities.Document d) throws UIMAException, IOException {
        JCas jCas = createJCasForDocument(d);

        String filename = d.getName() + ".xmi";
        File xmiFile = new File(filename);

        for (Users u : d.getProject().getUsers()) {
            Map<Long, SwanAnnotation> annotsById = new HashMap<>();
            for (de.unisaarland.swan.entities.Annotation annotation : annotationDAO.getAllAnnotationsByUserIdDocId(u.getId(), d.getId())) {
                addAnnotationToJCas(annotation, annotsById, jCas);
            }
            for (de.unisaarland.swan.entities.Link link : linkDAO.getAllLinksByUserIdDocId(u.getId(), d.getId())) {
                addLinkToJCas(link, annotsById, jCas);
            }
        }

        CasIOUtil.writeXmi(jCas, xmiFile);
        return xmiFile;
    }

    private JCas createJCasForDocument(de.unisaarland.swan.entities.Document d) throws UIMAException {
        JCas jCas = JCasFactory.createJCas();
        jCas.setDocumentLanguage("en");
        jCas.setDocumentText(d.getText());

        return jCas;
    }

    private void addAnnotationToJCas(de.unisaarland.swan.entities.Annotation annotation, Map<Long, SwanAnnotation> annotsById, JCas jCas) {
        SwanAnnotation dAnnot = new SwanAnnotation(jCas);
        dAnnot.setBegin(annotation.getStart());
        dAnnot.setEnd(annotation.getEnd());
        dAnnot.setAnnotatorId(annotation.getUser().getEmail());
        dAnnot.setSpanType(annotation.getSpanType().getName());
        dAnnot.setAnnotationId(annotation.getId().toString());
        annotsById.put(annotation.getId(), dAnnot);

		Set<Label> labels = convertLabelsToExportLabelSet(annotation.getLabels());
        FSList list = createLabelList(jCas, labels);

        dAnnot.setLabels(list);

        dAnnot.addToIndexes();
    }

    private void addLinkToJCas(de.unisaarland.swan.entities.Link link, Map<Long, SwanAnnotation> annotsById, JCas jCas) {
        SwanLink dLink = new SwanLink(jCas);
        dLink.setLinkBegin(annotsById.get(link.getAnnotation1().getId()));
        dLink.setLinkEnd(annotsById.get(link.getAnnotation2().getId()));
        dLink.setAnnotatorId(link.getUser().getEmail());

        Set<de.unisaarland.swan.export.model.xml.Label> labels = convertLinkLabelsToExportLabelSet(link.getLinkLabels());
        FSList list = createLabelList(jCas, labels);

        dLink.setLabels(list);

        dLink.addToIndexes();

        // add as link to start annotation
        SwanAnnotation startAnnot = annotsById.get(link.getAnnotation1().getId());
        FSList linkList = startAnnot.getLinks();
        if (linkList == null) {
            linkList = new EmptyFSList(jCas);
        }
        NonEmptyFSList extendedList = new NonEmptyFSList(jCas);
        extendedList.setHead(dLink);
        extendedList.setTail(linkList);
        startAnnot.setLinks(extendedList);
    }

    /**
     * Returns a list containing uimaLabels for all labels in a given set
     *
     * @param jCas JCas
     * @param labels Set<Label> labels
     * @return list FSList
     */
    private FSList createLabelList(JCas jCas, Set<de.unisaarland.swan.export.model.xml.Label> labels) {
        FSList list = new EmptyFSList(jCas);
        for (de.unisaarland.swan.export.model.xml.Label label : labels) {
            for (String labelName : label.getLabel()) {
                SwanLabel uimaLabel
                        = new SwanLabel(jCas);
                uimaLabel.setName(labelName);
                uimaLabel.setLabelSet(label.getlabelSetName());

                NonEmptyFSList extendedList = new NonEmptyFSList(jCas);
                extendedList.setHead(uimaLabel);
                extendedList.setTail(list);
                list = extendedList;
            }
        }

        return list;
    }

    private File createTypeSystemFile() throws IOException, ResourceInitializationException, SAXException {
        File typeSystemFile = new File("typesystem.xml");
        TypeSystemDescription tsd = TypeSystemDescriptionFactory.createTypeSystemDescription();
        OutputStream os = new FileOutputStream(typeSystemFile);
        tsd.toXML(os);
        os.close();

        return typeSystemFile;
    }

    /**
     * Returns a zip file containing all annotation and link data by annotator
     * and document belonging to the given project: creates one XML file per
     * annotator.
     *
     * @param proj Project
     * @return zip file
     */
    public File getExportDataInXML(Project proj) {
        try {
            File zipFile = new File("swan_" + proj.getName() + ".zip");
            ZipOutputStream zos = createZipOutputStream(zipFile);

            for (de.unisaarland.swan.entities.Document d : proj.getDocuments()) {
            	// Insert text file
				addTxtFile(d, zos);

				// Insert annotations
                for (Users u : proj.getUsers()) {

                    String fileName = proj.getName()
                            + "_" + d.getName()
                            + "_" + u.getEmail()
                            + ".xml";
                    File docUserfile = new File(fileName);

					de.unisaarland.swan.export.model.xml.Users user = convertUserToExportUser(u);

                    List<de.unisaarland.swan.entities.Annotation> annotations
                            = annotationDAO.getAllAnnotationsByUserIdDocId(u.getId(), d.getId());
                    System.out.println(annotations.size());
                    List<de.unisaarland.swan.entities.Link> links
                            = linkDAO.getAllLinksByUserIdDocId(u.getId(), d.getId());
                    de.unisaarland.swan.export.model.xml.Document exportDoc = convertToExportDocument(d, annotations, links, user);

                    marshalXMLToSingleFile(exportDoc, docUserfile);
                    createZipEntry(docUserfile, zos);
                }
            }

            // Insert scheme
            marshalScheme(proj, zos);
            zos.finish();
            zos.close();

            return zipFile;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Error while zipping data to XML");
    }

    private ZipOutputStream createZipOutputStream(File file) throws FileNotFoundException {
        FileOutputStream fos = new FileOutputStream(file);
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        return new ZipOutputStream(bos);
    }

    private void createZipEntry(File file, ZipOutputStream zos) throws IOException {
    	ZipEntry ze = new ZipEntry(file.getName());
        zos.putNextEntry(ze);
        zos.write(FileUtils.readFileToByteArray(file));
        zos.closeEntry();
    }

	/**
	 * Inserts the .txt file of a document into the zip file.
	 *
	 * @param d
	 * @param zos
	 * @throws IOException
	 */
	private void addTxtFile(de.unisaarland.swan.entities.Document d, ZipOutputStream zos) throws IOException {
		// Insert text file
		String txtFileName = d.getName() +".txt";
		File txtFile = new File(txtFileName);
		FileOutputStream fos = new FileOutputStream(txtFile);
		fos.write(d.getText().getBytes());
		fos.close();
		createZipEntry(txtFile, zos);
	}

	private void marshalScheme(Project proj, ZipOutputStream zos) throws IOException {
        final Scheme schemeOrig = proj.getScheme();
        final de.unisaarland.swan.export.model.xml.scheme.Scheme schemeExport
                    = (de.unisaarland.swan.export.model.xml.scheme.Scheme) mapperFacade.map(schemeOrig, SCHEME_EXPORT_CLASS);

        String fileName = schemeExport.getName() + ".xml";
        File schemefile = new File(fileName);

        marshalXMLToSingleFile(schemeExport, schemefile);

        ZipEntry ze = new ZipEntry(fileName);
        zos.putNextEntry(ze);
        zos.write(FileUtils.readFileToByteArray(schemefile));
        zos.closeEntry();
    }

    /**
     * Writes the object Document into the file.
     *
     * @param o
     * @param file
     */
    private void marshalXMLToSingleFile(Object o, File file) {

        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(o.getClass());
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(o, file);
            return;
        } catch (JAXBException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Something went wrong while marshalling the XML");
    }

    private de.unisaarland.swan.export.model.xml.Document convertToExportDocument(de.unisaarland.swan.entities.Document d,
																				  List<de.unisaarland.swan.entities.Annotation> annotations,
																				  List<de.unisaarland.swan.entities.Link> links,
																				  de.unisaarland.swan.export.model.xml.Users user) {

        de.unisaarland.swan.export.model.xml.Document document = new de.unisaarland.swan.export.model.xml.Document();
        document.setName(d.getName());
        document.setUser(user);
        document.setAnnotations(
                convertAnnotationsToAnnotationSet(annotations));
        document.setLinks(
                convertLinksToLinkType(links));

        return document;
    }

    private AnnotationSet convertAnnotationsToAnnotationSet(List<de.unisaarland.swan.entities.Annotation> annotations) {
        AnnotationSet annotationSet = new AnnotationSet();
        Set<de.unisaarland.swan.export.model.xml.Annotation> annotatiosExport = new HashSet<>();

        for (de.unisaarland.swan.entities.Annotation a : annotations) {
            annotatiosExport.add(
                    convertAnnotationToExportAnnotation(a));
        }
        annotationSet.setAnnotations(annotatiosExport);

        return annotationSet;
    }

    private de.unisaarland.swan.export.model.xml.Annotation convertAnnotationToExportAnnotation(de.unisaarland.swan.entities.Annotation a) {
        de.unisaarland.swan.export.model.xml.Annotation anno = new de.unisaarland.swan.export.model.xml.Annotation();
        anno.setId(a.getId());
        anno.setStart(a.getStart());
        anno.setEnd(a.getEnd());
        // anno.setText(a.getText());
        anno.setSpanType(a.getSpanType().getName());

        anno.setLabels(
                convertLabelsToExportLabelSet(
                        a.getLabels()));
        return anno;
    }

    private de.unisaarland.swan.export.model.xml.Users convertUserToExportUser(Users u) {
		de.unisaarland.swan.export.model.xml.Users user = new de.unisaarland.swan.export.model.xml.Users();
		user.setPrename(u.getPrename());
		user.setLastname(u.getLastname());
		user.setEmail(u.getEmail());
		return user;
	}

    private Set<Label> convertLabelsToExportLabelSet(Set<de.unisaarland.swan.entities.Label> labelEntities) {

        // collect selected labels per LabelSet
        Map<String, Set<String>> setToLabelsMap = new HashMap<>();

        for (de.unisaarland.swan.entities.Label l : labelEntities) {
            de.unisaarland.swan.entities.LabelSet s = l.getLabelSet();

            if (!setToLabelsMap.containsKey(s.getName())) {
                setToLabelsMap.put(s.getName(), new HashSet<String>());
            }
            setToLabelsMap.get(s.getName()).add(l.getName());

        }

        Set<de.unisaarland.swan.export.model.xml.Label> labels = createExportLabelsFromMap(setToLabelsMap);

        return labels;
    }

    private Set<de.unisaarland.swan.export.model.xml.Label> createExportLabelsFromMap(Map<String, Set<String>> setToLabelsMap) {
		Set<de.unisaarland.swan.export.model.xml.Label> labels = new HashSet<>();
		for (String labelSetName : setToLabelsMap.keySet()) {
			de.unisaarland.swan.export.model.xml.Label annotatedLabel = new de.unisaarland.swan.export.model.xml.Label();
			annotatedLabel.setLabel(setToLabelsMap.get(labelSetName));
			annotatedLabel.setLabelSetName(labelSetName);
			labels.add(annotatedLabel);
		}
		return labels;

	}

    private de.unisaarland.swan.export.model.xml.LinkType convertLinksToLinkType(List<de.unisaarland.swan.entities.Link> links) {

        de.unisaarland.swan.export.model.xml.LinkType linkType
                = new de.unisaarland.swan.export.model.xml.LinkType();
        Set<de.unisaarland.swan.export.model.xml.Link> newLinks = new HashSet<>();

        for (de.unisaarland.swan.entities.Link l : links) {
            newLinks.add(
                    convertLinkToExportLink(l));
        }
        linkType.setLinks(newLinks);

        return linkType;
    }

    private de.unisaarland.swan.export.model.xml.Link convertLinkToExportLink(de.unisaarland.swan.entities.Link link) {
        de.unisaarland.swan.export.model.xml.Link newLink = new de.unisaarland.swan.export.model.xml.Link();
        newLink.setFrom(link.getAnnotation1().getId());
        newLink.setTo(link.getAnnotation2().getId());
        newLink.setLabels(
                convertLinkLabelsToExportLabelSet(
                        link.getLinkLabels()));
        return newLink;
    }

    private Set<de.unisaarland.swan.export.model.xml.Label> convertLinkLabelsToExportLabelSet(Set<de.unisaarland.swan.entities.LinkLabel> linkLabels) {

        // collect selected labels per LabelSet
        Map<String, Set<String>> setToLabelsMap = new HashMap<>();

        for (de.unisaarland.swan.entities.LinkLabel l : linkLabels) {

            de.unisaarland.swan.entities.LinkType s = l.getLinkType();
            if (!setToLabelsMap.containsKey(s.getName())) {
                setToLabelsMap.put(s.getName(), new HashSet<String>());
            }
            setToLabelsMap.get(s.getName()).add(l.getName());

        }

		return createExportLabelsFromMap(setToLabelsMap);
    }

}
