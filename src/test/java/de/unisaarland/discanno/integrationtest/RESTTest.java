/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.integrationtest;

//import com.sun.jersey.api.client.WebResource;

import de.unisaarland.discanno.integrationtest.BaseITTest;

//import com.sun.jersey.api.representation.Form;
//import com.sun.jersey.test.framework.AppDescriptor;
//import com.sun.jersey.test.framework.WebAppDescriptor;
//import de.unisaarland.discanno.entities.Project;
//import java.net.URISyntaxException;
//import javax.ws.rs.client.Client;
//import javax.ws.rs.client.ClientBuilder;
//import javax.ws.rs.client.WebTarget;
//import javax.ws.rs.core.MediaType;
//import org.codehaus.jettison.json.JSONException;
//import org.codehaus.jettison.json.JSONObject;
//import java.util.List;
//import java.util.Set;
//import org.junit.Test;
//import static org.junit.Assert.*;
//import org.junit.Before;

/**
 * Integration test environment did not work. For more details look into BaseITTest
 *
 * @author Timo Guehring
 */
public class RESTTest extends BaseITTest {
    
    private static final String PROJECT_PATH = "/discanno/tempannot/project";
    private static final String LOGIN_PATH = "discanno/tempannot/usermanagment/login";
    
//    @Override
//    protected AppDescriptor configure() {
//        return new WebAppDescriptor.Builder().build();
//    }
    
    /**
     * TODO this is not independent from the real application
     * 
     * @throws JSONException
     * @throws URISyntaxException 
     */
//    @Test
//    public void testLogin() throws JSONException, URISyntaxException {
//        Users admin = TestDataProvider.getAdmin();
//        
//        em.getTransaction().begin();
//        em.persist(admin);
//        em.getTransaction().commit();
//        
//        Form f = new Form();
//        f.add("email", "admin@web.de");    
//        f.add("password", "secret");    
//        
//        String response = webResource.path(LOGIN_PATH).post(String.class, f);
//        JSONObject json = new JSONObject(response);
//        JSONObject user = (JSONObject) json.get("user");
//        
//        assertNotNull(user);
//        assertEquals("John", user.get("prename"));
//        assertEquals("Doe", user.get("lastname"));
//        assertEquals("admin@web.de", user.get("email"));
//        assertEquals(Users.RoleType.admin, user.get("role"));
//        assertTrue(user.isNull("password"));
//    }
    
//    @Test
//    public void testCreate() throws JSONException, URISyntaxException {
//        Project project = TestDataProvider.getProject1();
//        webResource.path(PROJECT_PATH).type(MediaType.APPLICATION_JSON).post(project);
//        JSONObject json = webResource.path(PROJECT_PATH).get(JSONObject.class);
//        assertEquals("Project1", json.get("name"));
//    }
    
}
