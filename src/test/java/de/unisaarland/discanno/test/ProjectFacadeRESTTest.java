/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Scheme;
import de.unisaarland.discanno.entities.Users;
import de.unisaarland.discanno.rest.services.v1.DocumentFacadeREST;
import de.unisaarland.discanno.rest.services.v1.ProjectFacadeREST;
import de.unisaarland.discanno.rest.services.v1.SchemeFacadeREST;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;
import javax.ws.rs.core.Response;
import org.codehaus.jettison.json.JSONArray;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;

/**
 *
 * @author Timo Guehring
 */
public class ProjectFacadeRESTTest extends BaseTest {

    ProjectFacadeREST projRESTService = new ProjectFacadeREST();
    SchemeFacadeREST schemeRESTService = new SchemeFacadeREST();
    DocumentFacadeREST documentRESTService = new DocumentFacadeREST();
    
    @Before
    public void configureRESTFacade() {
        super.configureService(projRESTService);
        super.configureService(schemeRESTService);
        super.configureService(documentRESTService);
    }
    
    @Test
    public void testScenario1() throws JSONException, IOException, CloneNotSupportedException {

        Users admin = TestDataProvider.getAdmin();
        admin.setSession(BaseTest.SESSION_STR);
        persistAndFlush(admin);
        
        Scheme scheme = TestDataProvider.getScheme1();
        schemeRESTService.create(scheme);
        
        Response respSchemes = schemeRESTService.getSchemes();
        JSONObject jsonSchemes = new JSONObject((String) respSchemes.getEntity());
        JSONArray schemes = jsonSchemes.getJSONArray("schemes");
        assertTrue(schemes.length() == 1);
        assertTrue(respSchemes.getStatus() == 200);
        
        Project proj = TestDataProvider.getProject1();
        proj.setScheme(scheme);
        projRESTService.create(proj);
        
        Response respProjects = projRESTService.getProjectsByUserId(admin.getId());
        JSONObject jsonProjects = new JSONObject((String) respProjects.getEntity());
        JSONArray projects = jsonProjects.getJSONArray("projects");
        assertTrue(projects.length() == 1);
        assertTrue(respProjects.getStatus() == 200);
        
        testAddProjectManager(proj, admin);
        testRemoveProjectManager(proj, admin);
        
        testAddUser(proj, admin);
        
        testExport(proj);
        
        testRemoveUser(proj, admin);
        
        testRemoveProject(proj);
    }
    
    public void testAddProjectManager(Project proj, Users user) throws JSONException, IOException {
        Response resp = projRESTService.addProjectManagerToProject(proj.getId(), user.getId());
        assertTrue(resp.getStatus() == 200);
        
        Project retProj = getFirstProject(user);
        assertNotNull(retProj);
        
        assertTrue(retProj.getProjectManager().size() == 1);
        
        //TODO create methode getFirstFromSet
        Object[] projectManagers = retProj.getProjectManager().toArray();
        Users projMan = (Users) projectManagers[0];
        assertTrue(projMan.getId().equals(user.getId()));
    }
    
    public void testRemoveProjectManager(Project proj, Users user) throws JSONException, IOException {
        Response resp = projRESTService.deleteProjectManagerFromProject(proj.getId(), user.getId());
        assertTrue(resp.getStatus() == 200);
        assertNull(resp.getEntity());
        
        Response respProjects = projRESTService.getProjectsByUserId(user.getId());
        assertTrue(respProjects.getStatus() == 200);
        
        JSONObject jsonProjects = new JSONObject((String) respProjects.getEntity());
        JSONArray projects = jsonProjects.getJSONArray("projects");
        Project retProj = new ObjectMapper().readValue(projects.get(0).toString(), Project.class);
        
        assertNotNull(retProj);
        assertTrue(retProj.getProjectManager().isEmpty());
    }

    private void testAddUser(Project proj, Users user) throws JSONException, IOException, CloneNotSupportedException {

        Response resp = projRESTService.addUserToProject(proj.getId(), user.getId());
        assertTrue(resp.getStatus() == 200);
        
        Project retProj = getFirstProject(user);
        Set<Users> userSet = retProj.getUsers();
        Object[] users = userSet.toArray();
        Users user1 = (Users) users[0];
        
        Project retProjectById = getFirstProjectByUserId(user.getId());
        assertTrue(retProjectById.getUsers().size() == 1);
        
        assertNotNull(user1);
        assertTrue(user1.getId().equals(user.getId()));
    }

    private void testRemoveUser(Project proj, Users user) throws JSONException, IOException {

        Response resp = projRESTService.deleteUserFromProject(proj.getId(), user.getId());
        assertTrue(resp.getStatus() == 200);

        Project retProj = getFirstProject(user);
        Set<Users> userSet = retProj.getUsers();
        
        assertTrue(userSet.isEmpty());
    }
    
    private Project getFirstProject(Users user) throws JSONException, IOException {
        Response respProjects = projRESTService.getProjectsByUserId(user.getId());
        JSONObject jsonProjects = new JSONObject((String) respProjects.getEntity());
        JSONArray projects = jsonProjects.getJSONArray("projects");
        
        assertTrue(projects.length() == 1);
        
        Project retProj = new ObjectMapper().readValue(projects.get(0).toString(), Project.class);
        return retProj;
    }
    
    private Project getFirstProjectByUserId(Long userId) throws JSONException, IOException {
        Response respProjects = projRESTService.getProjectsByUserId(userId);
        JSONObject jsonProjects = new JSONObject((String) respProjects.getEntity());
        JSONArray projects = jsonProjects.getJSONArray("projects");
        
        assertTrue(projects.length() == 1);
        
        Project retProj = new ObjectMapper().readValue(projects.get(0).toString(), Project.class);
        return retProj;
    }

    private void testExport(Project proj) throws CloneNotSupportedException {

        // First add document to project
        Document doc = TestDataProvider.getDocument1();
        doc.setProject(proj);
        documentRESTService.addDocumentToProjectREST(doc);

        Response resp = projRESTService.exportProjectByProjIdAsZip(proj.getId());
        assertTrue(resp.getStatus() == 200);
        assertNotNull(resp.getEntity());

        // Test zip file
        File file = new File(proj.getName() + ".zip");
        try (FileOutputStream fos = new FileOutputStream(file) ) {
            byte[] zipByteArray = (byte[]) resp.getEntity();
            fos.write(zipByteArray);
            ZipFile zipFile = new ZipFile(file);
            assertTrue(zipFile.size() == 1);
        } catch (IOException | NullPointerException e) {
            fail("Problem generating zip file.");
        }

        documentRESTService.remove(doc.getId());
    }

    private void testRemoveProject(Project proj) {
        
        Long id = proj.getId();

        Response resp = projRESTService.remove(id);
        assertTrue(resp.getStatus() == 200);
        
        // Not available anymore
        Response resp2 = projRESTService.remove(id);
        assertTrue(resp2.getStatus() == Response.Status.BAD_REQUEST.getStatusCode());
    }
    
}
