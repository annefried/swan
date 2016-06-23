/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import de.unisaarland.discanno.entities.Annotation;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Label;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Scheme;
import de.unisaarland.discanno.entities.Users;
import de.unisaarland.discanno.rest.services.v1.AnnotationFacadeREST;
import de.unisaarland.discanno.rest.services.v1.DocumentFacadeREST;
import de.unisaarland.discanno.rest.services.v1.ProjectFacadeREST;
import de.unisaarland.discanno.rest.services.v1.SchemeFacadeREST;
import de.unisaarland.discanno.rest.services.v1.UserFacadeREST;
import java.util.Set;
import javax.ws.rs.core.Response;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Timo Guehring
 */
public class AnnotationFacadeRESTTest extends BaseTest {
    
    ProjectFacadeREST projRESTService = new ProjectFacadeREST();
    SchemeFacadeREST schemeRESTService = new SchemeFacadeREST();
    DocumentFacadeREST docRESTService = new DocumentFacadeREST();
    AnnotationFacadeREST annoRESTService = new AnnotationFacadeREST();
    UserFacadeREST userRESTService = new UserFacadeREST();
    
    Users user = null;
    Document doc = null;
    Scheme scheme = null;
    
    @Before
    public void configureRESTFacade() {
        super.configureService(projRESTService);
        super.configureService(schemeRESTService);
        super.configureService(docRESTService);
        super.configureService(annoRESTService);
        super.configureService(userRESTService);
    }
    
    @Before
    public void setupForAnnotations() throws CloneNotSupportedException {
        Users admin = TestDataProvider.getAdmin();
        admin.setSession(BaseTest.SESSION_STR);
        persistAndFlush(admin);
        this.user = admin;
        
        Scheme scheme = TestDataProvider.getScheme1();
        schemeRESTService.create(scheme);
        this.scheme = scheme;
        
        Project proj = TestDataProvider.getProject1();
        proj.setScheme(scheme);
        projRESTService.create(proj);
        projRESTService.addUserToProject(proj.getId(), admin.getId());
        
        Document doc = TestDataProvider.getDocument1();
        doc.setProject(proj);
        docRESTService.addDocumentToProjectREST(doc);
        this.doc = doc;
    }
    
    @Test
    public void testScenario1() {
        Annotation anno = TestDataProvider.getAnnotation1();
        anno.setUser(user);
        anno.setDocument(doc);
        Response resp = annoRESTService.create(anno);
        
        assertTrue(resp.getStatus() == 200);
        assertNotNull(resp.getEntity());
        
        Label label1 = TestDataProvider.getLabel1();
        Response lResp1 = annoRESTService.addLabelToAnnotationREST(anno.getId(), label1);
        assertTrue(lResp1.getStatus() == Response.Status.BAD_REQUEST.getStatusCode());
        
        Set<Label> labelsSet = scheme.getLabelSets().get(0).getLabels();
        Object[] labels = labelsSet.toArray();
        Label label = (Label) labels[0];
        Response lResp2 = annoRESTService.addLabelToAnnotationREST(anno.getId(), label);
        assertTrue(lResp2.getStatus() == 200);
    }
    
    @Test
    public void voidTestBrokenAnno1() {
        Annotation anno = TestDataProvider.getAnnotation2();
        Response resp = annoRESTService.create(anno);
        
        assertTrue(resp.getStatus() == Response.Status.BAD_REQUEST.getStatusCode());
        assertNull(resp.getEntity());
    }
    
    @Test
    public void voidTestBrokenAnno2() {
        Annotation anno = TestDataProvider.getAnnotation2();
        anno.setUser(user);
        Response resp = annoRESTService.create(anno);
        
        assertTrue(resp.getStatus() == Response.Status.BAD_REQUEST.getStatusCode());
        assertNull(resp.getEntity());
    }
    
    @Test
    public void voidTestBrokenAnno3() {
        Annotation anno = TestDataProvider.getAnnotation2();
        anno.setUser(user);
        Response resp = annoRESTService.create(anno);
        
        assertTrue(resp.getStatus() == Response.Status.BAD_REQUEST.getStatusCode());
        assertNull(resp.getEntity());
    }
    
    
    
}
