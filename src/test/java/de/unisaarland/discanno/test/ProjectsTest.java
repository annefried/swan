/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import de.unisaarland.discanno.Utility;
import de.unisaarland.discanno.business.Service;
import de.unisaarland.discanno.entities.Annotation;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Label;
import de.unisaarland.discanno.entities.LabelLabelSetMap;
import de.unisaarland.discanno.entities.LabelSet;
import de.unisaarland.discanno.entities.Link;
import de.unisaarland.discanno.entities.LinkLabel;
import de.unisaarland.discanno.entities.LinkLabelLinkSetMap;
import de.unisaarland.discanno.entities.LinkSet;

import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Scheme;
import de.unisaarland.discanno.entities.State;
import de.unisaarland.discanno.entities.Users;

import java.util.List;
import java.util.Set;
import javax.ejb.CreateException;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;

/**
 *
 * @author Timo Guehring
 */
public class ProjectsTest extends BaseTest {
    
    Service service = new Service();
    
    @Before
    public void configureService() {
        super.configureService(service);
    }
    
    @Test
    public void testScenario1() throws CloneNotSupportedException, CreateException {
        
        // Create scheme
        Scheme scheme = TestDataProvider.getScheme1();
        service.process(scheme);
        em.persist(scheme);
        
        // Create user
        Users user = TestDataProvider.getAdmin();
        em.persist(user);
        
        // Create project and set scheme
        Project project = TestDataProvider.getProject1();
        project.getScheme().setId(scheme.getId());
        service.process(project);
        em.persist(project);
        
        Users retUser = em.find(Users.class, user.getId());
        assertNotNull(retUser);
        assertTrue(retUser.getPrename().equals("John"));
        assertTrue(retUser.getLastname().equals("Locke"));
        assertTrue(retUser.getPassword().equals(Utility.hashPassword("secret")));
        assertTrue(retUser.getRole().equals(Users.RoleType.admin));
        assertTrue(retUser.getEmail().equals("admin@web.de"));
        assertTrue(retUser.getManagingProjects().isEmpty());
        assertTrue(retUser.getProjects().isEmpty());
        assertTrue(retUser.getSession() == null
                    || retUser.getSession().equals(""));
        
        // Add user to project
        service.addUserToProject(project.getId(), retUser.getId());
        
        assertTrue(retUser.getProjects().size() == 1);
        assertTrue(retUser.getManagingProjects().isEmpty());
        
        // Add document to project
        Document doc = TestDataProvider.getDocument1();
        doc.setProject(project);
        service.process(doc);
        em.persist(doc);
        
        Document retDoc = em.find(Document.class, doc.getId());
        assertNotNull(retDoc);
        assertTrue(retDoc.getName().equals("Politics1"));
        assertTrue(retDoc.getText().equals(TestDataProvider.TEXT_1));
        assertTrue(retDoc.getDefaultAnnotations().isEmpty());
        assertTrue(retDoc.getProject().getId().equals(project.getId()));
        assertTrue(retDoc.getStates().isEmpty());
        
        service.addDocumentToProject(retDoc);
        assertTrue(retDoc.getStates().size() == 1);
        
        Object[] states = retDoc.getStates().toArray();
        State state = (State) states[0];
        assertNotNull(state);
        assertFalse(state.isCompleted());
        assertTrue(state.getDocument().getId().equals(retDoc.getId()));
        assertNotNull(state.getLastEdit());
        assertTrue(state.getUser().getId().equals(retUser.getId()));
        
        testAnnotationsAndLinks(retDoc,
                                retUser,
                                scheme.getLabelSets().get(0),
                                scheme.getLinkSets().get(0));
    }
    
    public void testAnnotationsAndLinks(Document doc, Users user, LabelSet labelSet, LinkSet linkSet) throws CloneNotSupportedException {
        
        Annotation anno1 = testAddAnnotation1(doc, user, labelSet);
        Annotation anno2 = testAddAnnotation2(doc, user, labelSet);
        testAddMultipleAnnotations(doc, user, labelSet);
        testAddLink(doc, user, linkSet, anno1, anno2);
    }
    
    public Annotation testAddAnnotation1(Document doc, Users user, LabelSet labelSet) throws CloneNotSupportedException {
        
        Annotation anno = TestDataProvider.getAnnotation1();
        anno.setUser(user);
        anno.setDocument(doc);
        service.process(anno);
        em.persist(anno);
        
        Annotation retAnno = em.find(Annotation.class, anno.getId());
        assertNotNull(retAnno);
        assertFalse(retAnno.isNotSure());
        assertTrue(retAnno.getText().equals("The"));
        assertTrue(retAnno.getDocument().getId().equals(doc.getId()));
        assertTrue(retAnno.getUser().getId().equals(user.getId()));
        assertTrue(retAnno.getStart() == 0);
        assertTrue(retAnno.getEnd() == 3);
        assertTrue(retAnno.getLabelMap().isEmpty());
        assertTrue(retAnno.getTargetType().getTargetType().equals("verb"));
        
        // Add label to annotation 1
        Label label = TestDataProvider.getLabel1();
        label.addLabelSet(labelSet);
        service.addLabelToAnnotation(retAnno.getId(), label);
        
        Set<LabelLabelSetMap> mapSet = retAnno.getLabelMap();
        Object[] maps = mapSet.toArray();
        LabelLabelSetMap map = (LabelLabelSetMap) maps[0];
        
        assertTrue(mapSet.size() == 1);
        assertTrue(map.getLabel().getLabelId().equals(label.getLabelId()));
        assertTrue(map.getLabelSets().size() == 1);
        
        // Test broken labels
        try {
            Label labelBroken = TestDataProvider.getLabel1();
            service.addLabelToAnnotation(retAnno.getId(), labelBroken);
            fail("No IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage()
                    .equals("Service: Adding Label to Annotation failed"));
        }
        
        return anno;
    }
    
    public Annotation testAddAnnotation2(Document doc, Users user, LabelSet labelSet) throws CloneNotSupportedException {
        
        Annotation anno = TestDataProvider.getAnnotation2();
        anno.setUser(user);
        anno.setDocument(doc);
        service.process(anno);
        em.persist(anno);
        
        Annotation retAnno = em.find(Annotation.class, anno.getId());
        assertNotNull(retAnno);
        assertTrue(retAnno.isNotSure());
        assertTrue(retAnno.getText().equals("the"));
        assertTrue(retAnno.getDocument().getId().equals(doc.getId()));
        assertTrue(retAnno.getUser().getId().equals(user.getId()));
        assertTrue(retAnno.getStart() == 65);
        assertTrue(retAnno.getEnd() == 68);
        assertTrue(retAnno.getLabelMap().isEmpty());
        assertTrue(retAnno.getTargetType().getTargetType().equals("passage"));
        
        // Add label to annotation 1
        Label label = TestDataProvider.getLabel1();
        label.addLabelSet(labelSet);
        service.addLabelToAnnotation(retAnno.getId(), label);
        
        Set<LabelLabelSetMap> mapSet = retAnno.getLabelMap();
        Object[] maps = mapSet.toArray();
        LabelLabelSetMap map = (LabelLabelSetMap) maps[0];
        
        assertTrue(mapSet.size() == 1);
        assertTrue(map.getLabel().getLabelId().equals(label.getLabelId()));
        assertTrue(map.getLabelSets().size() == 1);
        
        return anno;
    }

    public void testAddMultipleAnnotations(Document doc, Users user, LabelSet labelSet) {

        List<Annotation> annos = TestDataProvider.getAnnotations();
        
        for (Annotation anno : annos) {
            anno.setUser(user);
            anno.setDocument(doc);
            service.process(anno);
            em.persist(anno);
        }
        
        List<Annotation> retAnnos = findAll(Annotation.class);
        assertTrue(retAnnos.size() == annos.size() + 2);
    }

    private void testAddLink(Document doc, Users user, LinkSet linkSet, Annotation anno1, Annotation anno2) {

        Link link = new Link();
        link.setAnnotation1(anno1);
        link.setAnnotation2(anno2);
        link.setDocument(doc);
        link.setUser(user);

        service.process(link);
        em.persist(link);
        
        Link retLink = em.find(Link.class, link.getId());
        assertNotNull(retLink);
        assertTrue(retLink.getAnnotation1().getId().equals(anno1.getId()));
        assertTrue(retLink.getAnnotation2().getId().equals(anno2.getId()));
        assertTrue(retLink.getLabelMap().isEmpty());
        assertTrue(retLink.getUser().getId().equals(user.getId()));
        assertTrue(retLink.getDocument().getId().equals(doc.getId()));
        
        // Add label to link
        LinkLabel label = TestDataProvider.getLinkLabel1();
        label.addLinkSet(linkSet);
        service.addLinkLabelToLink(retLink.getId(), label);
        
        Set<LinkLabelLinkSetMap> mapSet = retLink.getLabelMap();
        Object[] maps = mapSet.toArray();
        LinkLabelLinkSetMap map = (LinkLabelLinkSetMap) maps[0];
        
        assertTrue(mapSet.size() == 1);
        assertTrue(map.getLabel().getLinkLabel().equals(label.getLinkLabel()));
        assertTrue(map.getLinkSets().size() == 1);
        
        // Test broken label
        try {
            LinkLabel labelBroken = TestDataProvider.getLinkLabel1();
            service.addLinkLabelToLink(retLink.getId(), labelBroken);
            fail("No IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage()
                    .equals("Service: Adding LinkLabel to Link failed"));
        }

    }
    
}
