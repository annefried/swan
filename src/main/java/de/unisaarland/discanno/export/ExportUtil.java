/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export;

import de.unisaarland.discanno.dao.AnnotationDAO;
import de.unisaarland.discanno.dao.LinkDAO;
import de.unisaarland.discanno.export.model.Document;
import de.unisaarland.discanno.export.model.LabelSet;
import de.unisaarland.discanno.export.model.Link;
import de.unisaarland.discanno.export.model.Annotation;
import de.unisaarland.discanno.export.model.AnnotationSet;
import de.unisaarland.discanno.entities.LabelLabelSetMap;
import de.unisaarland.discanno.entities.LinkLabelLinkSetMap;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.TargetType;
import de.unisaarland.discanno.entities.Users;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author Timo Guehring
 */
public class ExportUtil {
    
    final AnnotationDAO annotationDAO;
    final LinkDAO linkDAO;
    
    public ExportUtil(AnnotationDAO annotationDAO, LinkDAO linkDAO) {
        this.annotationDAO = annotationDAO;
        this.linkDAO = linkDAO;
    }
    
    /**
     * Returns a zip file containing all annotation and link data by users and
     * documents belonging to the given project.
     * 
     * @param proj Project
     * @return zip file
     */
    public File getExportData(Project proj) {
        
        try {
            File file = new File("export.zip");
            FileOutputStream fos = new FileOutputStream(file);
            BufferedOutputStream bos = new BufferedOutputStream(fos);
            ZipOutputStream zos = new ZipOutputStream(bos);
            
            for (de.unisaarland.discanno.entities.Document d : proj.getDocuments()) {
                for (Users u : proj.getUsers()) {
                    
                    String fileName = proj.getName()
                                        + "_" + d.getName()
                                        + "_" + u.getPrename()
                                        + "_" + u.getLastname()
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
        document.setTargetTypes(
                    convertTargetTypesToExportTargetTypes(d));
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
                    convertAnntationToExportAnnotation(a));
        }
        annotationSet.setAnnotations(annotatiosExport);
        
        return annotationSet;
    }
    
    private Annotation convertAnntationToExportAnnotation(de.unisaarland.discanno.entities.Annotation a) {
        Annotation anno = new Annotation();
        anno.setId(a.getId());
        anno.setStart(a.getStart());
        anno.setEnd(a.getEnd());
        anno.setText(a.getText());
        anno.setTargetType(a.getTargetType().getTargetType());
        anno.setLabels(
                convertLabelsToExportLabelSet(
                        a.getLabelMap()));
        return anno;
    }
    
    private LabelSet convertLabelsToExportLabelSet(Set<LabelLabelSetMap> maps) {
        
        LabelSet labelSet = new LabelSet();
        Set<String> newLabels = new HashSet<>();
        
        for (LabelLabelSetMap m : maps) {
            newLabels.add(m.getLabel().getLabelId());
        }
        
        labelSet.setLabel(newLabels);
        
        return labelSet;
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
    
    private LabelSet convertLinkLabelsToExportLabelSet(Set<LinkLabelLinkSetMap> maps) {
        
        LabelSet labelSet = new LabelSet();
        Set<String> labels = new HashSet<>();
        
        for (LinkLabelLinkSetMap m : maps) {
            labels.add(m.getLabel().getLinkLabel());
        }
        labelSet.setLabel(labels);
        
        return labelSet;
    }

    private Set<String> convertTargetTypesToExportTargetTypes(de.unisaarland.discanno.entities.Document d) {
        
        Set<String> targetTypes = new HashSet<>();
        
        for (TargetType tt : d.getProject().getScheme().getTargetTypes()) {
            targetTypes.add(tt.getTargetType());
        }
        
        return targetTypes;
    }
    
}
