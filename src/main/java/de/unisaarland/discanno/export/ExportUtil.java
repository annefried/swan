/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export;

import de.unisaarland.discanno.dao.AnnotationDAO;
import de.unisaarland.discanno.dao.LinkDAO;
import de.unisaarland.discanno.export.model.Document;
import de.unisaarland.discanno.export.model.Link;
import de.unisaarland.discanno.export.model.Annotation;
import de.unisaarland.discanno.export.model.AnnotationSet;
import de.unisaarland.discanno.entities.LabelLabelSetMap;
import de.unisaarland.discanno.entities.LinkLabelLinkSetMap;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Users;
import de.unisaarland.discanno.export.model.Label;
import de.unisaarland.discanno.export.uimaTypes.DiscAnnoLink;
import de.unisaarland.discanno.export.uimaTypes.DiscAnnotation;
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
import org.apache.commons.io.FileUtils;
import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.factory.TypeSystemDescriptionFactory;
import org.apache.uima.fit.util.CasIOUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.cas.EmptyFSList;
import org.apache.uima.jcas.cas.FSList;
import org.apache.uima.jcas.cas.NonEmptyFSList;
import org.apache.uima.resource.metadata.TypeSystemDescription;
import org.xml.sax.SAXException;

/**
 *
 * @author Timo Guehring
 * @author Annemarie Friedrich
 */
public class ExportUtil {

    final AnnotationDAO annotationDAO;
    final LinkDAO linkDAO;

    public ExportUtil(AnnotationDAO annotationDAO, LinkDAO linkDAO) {
        this.annotationDAO = annotationDAO;
        this.linkDAO = linkDAO;
    }

    /**
     * Returns a zip file containing one XMI per document, UIMA annotations are
     * created on the document for all annotators that were assigned to the
     * project.
     *
     * @param proj
     * @return
     */
    public File getExportDataXmi(Project proj) {
        try {
            File file = new File("discanno_" + proj.getName() + ".zip");
            FileOutputStream fos = new FileOutputStream(file);
            BufferedOutputStream bos = new BufferedOutputStream(fos);
            ZipOutputStream zos = new ZipOutputStream(bos);

            for (de.unisaarland.discanno.entities.Document d : proj.getDocuments()) {

                JCas jCas = JCasFactory.createJCas();
                jCas.setDocumentLanguage("en");
                jCas.setDocumentText(d.getText());

                String filename = d.getName() + ".xmi";

                File xmiFile = new File(filename);
                
                for (Users u : proj.getUsers()) {
                    
                    Map<Long, DiscAnnotation> annotsById = new HashMap<>();

                    // add Annotations to JCas
                    for (de.unisaarland.discanno.entities.Annotation annotation : annotationDAO.getAllAnnotationsByUserIdDocId(u.getId(), d.getId())) {
                        DiscAnnotation dAnnot = new DiscAnnotation(jCas);
                        dAnnot.setBegin(annotation.getStart());
                        dAnnot.setEnd(annotation.getEnd());
                        dAnnot.setAnnotatorId(u.getEmail());
                        dAnnot.setTargetType(annotation.getTargetType().getTargetType());
                        dAnnot.setAnnotationId(annotation.getId().toString());
                        annotsById.put(annotation.getId(), dAnnot);
                        
                        FSList list = new EmptyFSList(jCas);
                        Set<Label> labels = convertLabelsToExportLabelSet(annotation.getLabelMap());
                        for (Label label : labels) {
                            for (String labelName : label.getLabel()) {
                                de.unisaarland.discanno.export.uimaTypes.DiscAnnoLabel uimaLabel
                                        = new de.unisaarland.discanno.export.uimaTypes.DiscAnnoLabel(jCas);
                                uimaLabel.setName(labelName);
                                uimaLabel.setLabelSet(label.getlabelSetName());

                                NonEmptyFSList extendedList = new NonEmptyFSList(jCas);
                                extendedList.setHead(uimaLabel);
                                extendedList.setTail(list);
                                list = extendedList;

                            }
                        }
                        dAnnot.setLabels(list);
                        
                        dAnnot.addToIndexes();
                    }

                    for (de.unisaarland.discanno.entities.Link link : linkDAO.getAllLinksByUserIdDocId(u.getId(), d.getId())) {
                        DiscAnnoLink dLink = new DiscAnnoLink(jCas);
                        dLink.setLinkBegin(annotsById.get(link.getAnnotation1().getId()));
                        dLink.setLinkEnd(annotsById.get(link.getAnnotation2().getId()));
                        dLink.setAnnotatorId(u.getEmail());
                        
                        FSList list = new EmptyFSList(jCas);
                        Set<Label> labels = convertLinkLabelsToExportLabelSet(link.getLabelMap());
                        for (Label label : labels) {
                            for (String labelName : label.getLabel()) {
                                de.unisaarland.discanno.export.uimaTypes.DiscAnnoLabel uimaLabel
                                        = new de.unisaarland.discanno.export.uimaTypes.DiscAnnoLabel(jCas);
                                uimaLabel.setName(labelName);
                                uimaLabel.setLabelSet(label.getlabelSetName());

                                NonEmptyFSList extendedList = new NonEmptyFSList(jCas);
                                extendedList.setHead(uimaLabel);
                                extendedList.setTail(list);
                                list = extendedList;

                            }
                        }
                        dLink.setLabels(list);
                        
                        dLink.addToIndexes();
                        
                        // add as link to start annotation
                        DiscAnnotation startAnnot = annotsById.get(link.getAnnotation1().getId());
                        FSList linkList = startAnnot.getLinks();
                        if (linkList == null) {
                            linkList = new EmptyFSList(jCas);
                        }
                        NonEmptyFSList extendedList = new NonEmptyFSList(jCas);
                        extendedList.setHead(dLink);
                        extendedList.setTail(linkList);
                        startAnnot.setLinks(extendedList);
                        
                    }

                }

                // convert JCas to Xmi
                CasIOUtil.writeXmi(jCas, xmiFile);

                zos.putNextEntry(new ZipEntry(filename));
                zos.write(FileUtils.readFileToByteArray(xmiFile));
                zos.closeEntry();
            }

            // add type system for convenience
            File typeSystemFile = new File("typesystem.xml");
            TypeSystemDescription tsd = TypeSystemDescriptionFactory.createTypeSystemDescription();
            OutputStream os = new FileOutputStream(typeSystemFile);
            tsd.toXML(os);
            os.close();
            zos.putNextEntry(new ZipEntry("typesystem.xml"));
            zos.write(FileUtils.readFileToByteArray(typeSystemFile));
            zos.closeEntry();

            zos.close();
            bos.close();
            fos.close();

            return file;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        } catch (UIMAException | SAXException | IOException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Error while creating UIMA xmi files / zipping");
    }

    /**
     * Returns a zip file containing all annotation and link data by annotator
     * and document belonging to the given project: creates one XML file per
     * annotator.
     *
     * @param proj Project
     * @return zip file
     */
    public File getExportData(Project proj) {

        try {
            File file = new File("discanno_" + proj.getName() + ".zip");
            FileOutputStream fos = new FileOutputStream(file);
            BufferedOutputStream bos = new BufferedOutputStream(fos);
            ZipOutputStream zos = new ZipOutputStream(bos);

            for (de.unisaarland.discanno.entities.Document d : proj.getDocuments()) {
                for (Users u : proj.getUsers()) {

                    String fileName = proj.getName()
                            + "_" + d.getName()
                            + "_" + u.getEmail()
                            + ".xml";
                    File docUserfile = new File(fileName);

                    List<de.unisaarland.discanno.entities.Annotation> annotations
                            = annotationDAO.getAllAnnotationsByUserIdDocId(u.getId(), d.getId());
                    List<de.unisaarland.discanno.entities.Link> links
                            = linkDAO.getAllLinksByUserIdDocId(u.getId(), d.getId());
                    Document exportDoc = convertToExportDocument(d, annotations, links);

                    marshalXMLToSingleFile(exportDoc, docUserfile);

                    zos.putNextEntry(new ZipEntry(fileName));
                    zos.write(FileUtils.readFileToByteArray(docUserfile));
                    zos.closeEntry();

                }
            }

            zos.close();
            bos.close();
            fos.close();

            return file;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Error while zipping");
    }

    /**
     * Writes the object Document into the file.
     *
     * @param Document d
     * @param File file
     */
    private void marshalXMLToSingleFile(Document d, File file) {

        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Document.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            jaxbMarshaller.marshal(d, file);
            return;
        } catch (JAXBException ex) {
            Logger.getLogger(ExportUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        throw new RuntimeException("ExportUtil: Something went wrong while marshalling the XML");
    }

    private Document convertToExportDocument(de.unisaarland.discanno.entities.Document d,
            List<de.unisaarland.discanno.entities.Annotation> annotations,
            List<de.unisaarland.discanno.entities.Link> links) {

        Document document = new Document();
        document.setAnnotations(
                convertAnnotationsToAnnotationSet(annotations));
        document.setLinks(
                convertLinksToLinkSet(links));

        return document;
    }

    private AnnotationSet convertAnnotationsToAnnotationSet(List<de.unisaarland.discanno.entities.Annotation> annotations) {

        AnnotationSet annotationSet = new AnnotationSet();
        Set<Annotation> annotatiosExport = new HashSet<>();

        for (de.unisaarland.discanno.entities.Annotation a : annotations) {
            annotatiosExport.add(
                    convertAnnotationToExportAnnotation(a));
        }
        annotationSet.setAnnotations(annotatiosExport);

        return annotationSet;
    }

    private Annotation convertAnnotationToExportAnnotation(de.unisaarland.discanno.entities.Annotation a) {
        Annotation anno = new Annotation();
        anno.setId(a.getId());
        anno.setStart(a.getStart());
        anno.setEnd(a.getEnd());
       // anno.setText(a.getText());
        anno.setTargetType(a.getTargetType().getTargetType());
        anno.setLabels(
                convertLabelsToExportLabelSet(
                        a.getLabelMap()));
        return anno;
    }

    private Set<Label> convertLabelsToExportLabelSet(Set<LabelLabelSetMap> maps) {

        Set<Label> labels = new HashSet<>();

        // collect selected labels per LabelSet
        Map<String, Set<String>> setToLabelsMap = new HashMap<>();

        for (LabelLabelSetMap m : maps) {

            for (de.unisaarland.discanno.entities.LabelSet s : m.getLabelSets()) {

                if (!setToLabelsMap.containsKey(s.getName())) {
                    setToLabelsMap.put(s.getName(), new HashSet<String>());
                }
                setToLabelsMap.get(s.getName()).add(m.getLabel().getLabelId());
            }
        }

        for (String labelSetName : setToLabelsMap.keySet()) {
            Label annotatedLabel = new Label();
            annotatedLabel.setLabel(setToLabelsMap.get(labelSetName));
            annotatedLabel.setLabelSetName(labelSetName);
            labels.add(annotatedLabel);
        }

        return labels;
    }

    private de.unisaarland.discanno.export.model.LinkSet convertLinksToLinkSet(List<de.unisaarland.discanno.entities.Link> links) {

        de.unisaarland.discanno.export.model.LinkSet linkSet
                = new de.unisaarland.discanno.export.model.LinkSet();
        Set<Link> newLinks = new HashSet<>();

        for (de.unisaarland.discanno.entities.Link l : links) {
            newLinks.add(
                    convertLinkToExportLink(l));
        }
        linkSet.setLinks(newLinks);

        return linkSet;
    }

    private Link convertLinkToExportLink(de.unisaarland.discanno.entities.Link link) {
        Link newLink = new Link();
        newLink.setFrom(link.getAnnotation1().getId());
        newLink.setTo(link.getAnnotation2().getId());
        newLink.setLabels(
                convertLinkLabelsToExportLabelSet(
                        link.getLabelMap()));
        return newLink;
    }

    private Set<Label> convertLinkLabelsToExportLabelSet(Set<LinkLabelLinkSetMap> maps) {

        Set<Label> labels = new HashSet<>();

        // collect selected labels per LabelSet
        Map<String, Set<String>> setToLabelsMap = new HashMap<>();

        for (LinkLabelLinkSetMap m : maps) {

            for (de.unisaarland.discanno.entities.LinkSet s : m.getLinkSets()) {

                if (!setToLabelsMap.containsKey(s.getName())) {
                    setToLabelsMap.put(s.getName(), new HashSet<String>());
                }
                setToLabelsMap.get(s.getName()).add(m.getLabel().getLinkLabel());
            }
        }

        for (String labelSetName : setToLabelsMap.keySet()) {
            Label annotatedLabel = new Label();
            annotatedLabel.setLabel(setToLabelsMap.get(labelSetName));
            annotatedLabel.setLabelSetName(labelSetName);
            labels.add(annotatedLabel);
        }

        return labels;
    }

}
