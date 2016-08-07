/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.integrationtest;

//import com.sun.jersey.api.client.WebResource;
//import com.sun.jersey.test.framework.AppDescriptor;
//import com.sun.jersey.test.framework.WebAppDescriptor;
import com.sun.jersey.test.framework.JerseyTest;
//import de.unisaarland.swan.business.Service;
//import de.unisaarland.swan.dao.AbstractDAO;
//import de.unisaarland.swan.dao.BaseEntityDAO;
//import de.unisaarland.swan.rest.services.v1.ProjectFacadeREST;
//import java.lang.reflect.Field;
//import java.net.URI;
//import java.sql.Connection;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.sql.Statement;
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//import javax.persistence.EntityManager;
//import javax.persistence.EntityManagerFactory;
//import javax.persistence.Persistence;
//import javax.persistence.PersistenceException;
//import javax.ws.rs.GET;
//import javax.ws.rs.Path;
//import javax.ws.rs.core.MediaType;
//import javax.ws.rs.core.Response;
//import javax.ws.rs.core.UriBuilder;
//import javax.ws.rs.core.Application;
//import static org.glassfish.grizzly.http.server.Constants.GET;
//import org.glassfish.grizzly.http.server.HttpServer;
//import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
////import org.glassfish.jersey.server.ResourceConfig;
////import org.glassfish.jersey.test.JerseyTest;
//import org.junit.After;
//import static org.junit.Assert.assertEquals;
//import org.junit.Before;
//import org.junit.BeforeClass;
//import org.junit.Test;
//
//import com.google.inject.Guice;
//import com.google.inject.Injector;
//import com.google.inject.servlet.ServletModule;
//import com.sun.jersey.api.client.Client;
//import com.sun.jersey.api.client.ClientResponse;
//import com.sun.jersey.api.client.WebResource;
//import com.sun.jersey.api.client.config.DefaultClientConfig;
//import com.sun.jersey.api.container.grizzly2.GrizzlyServerFactory;
//import com.sun.jersey.api.core.PackagesResourceConfig;
//import com.sun.jersey.api.core.ResourceConfig;
//import com.sun.jersey.core.spi.component.ioc.IoCComponentProviderFactory;
//import com.sun.jersey.guice.spi.container.GuiceComponentProviderFactory;
//import org.glassfish.grizzly.http.server.HttpServer;
//import org.junit.After;
//import org.junit.Before;
//import org.junit.Test;
//
//import javax.ws.rs.core.MediaType;
//import javax.ws.rs.core.UriBuilder;
//import java.io.IOException;
//import java.net.URI;

/**
 * This should be the Base for integration tests like here described:
 * https://stackoverflow.com/questions/27160440/jersey-client-api-vs-jersey-test-framework
 * but unfortunately all trials did not work yet to run a server environment
 * independent from the real server.
 *
 * @author Timo Guehring
 */
public abstract class BaseITTest extends JerseyTest {
    
//    protected String baseUri = "http://localhost:" + 9998 + "/";
//    
//    protected EntityManager em;
////    private HttpServer server;
//    
//    protected WebResource webResource = client().resource(baseUri);
//
//    protected static EntityManagerFactory entityManagerFactory;

    public BaseITTest() {
        super("de.unisaarland.swan.rest.services.v1");
    }
    
//    @Before
//    public void setup() throws IOException {
//        EntityManagerFactory emf = Persistence
//                        .createEntityManagerFactory("test");
//        em = emf.createEntityManager();
//        em.getTransaction().begin();
//        webResource.type(MediaType.APPLICATION_JSON);
//    }
//    
//    @After
//    public void closeEntityManager() {
//        em.getTransaction().rollback();
//        em.close();
////        stopServer();
//    }
   
//    static final URI BASE_URI = getBaseURI();

//    private static URI getBaseURI() {
//        return UriBuilder.fromUri("http://localhost/").port(9998).build();
//    }

}
