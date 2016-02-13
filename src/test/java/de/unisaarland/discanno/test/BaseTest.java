/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import de.unisaarland.discanno.entities.*;
import java.lang.reflect.Field;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.junit.After;
import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.mockito.Mockito;

/**
 *
 * @author Timo Guehring
 */
public abstract class BaseTest {
    
    public static final String SESSION_STR = "session123";
    
    private static final Pattern DAO_PATTERN = Pattern.compile("\\w*DAO");
    private static final Pattern SERVICE_PATTERN = Pattern.compile("service");
    private static final Pattern REQUEST_PATTERN = Pattern.compile("request");
    
    private static final List<Class> entityClasses = new ArrayList<>();
    //    protected static EntityManagerFactory entityManagerFactory;
    
    static {
        entityClasses.add(Annotation.class);
        entityClasses.add(Document.class);
        entityClasses.add(Label.class);
        entityClasses.add(LabelLabelSetMap.class);
        entityClasses.add(LabelSet.class);
        entityClasses.add(Link.class);
        entityClasses.add(LinkLabel.class);
        entityClasses.add(LinkLabelLinkSetMap.class);
        entityClasses.add(LinkSet.class);
        entityClasses.add(Project.class);
        entityClasses.add(Scheme.class);
        entityClasses.add(State.class);
        entityClasses.add(TargetType.class);
        entityClasses.add(TimeLogging.class);
        entityClasses.add(Users.class);
    }
    
    protected EntityManager em;
    
    @Before
    public void setup() throws IOException {
        EntityManagerFactory emf = Persistence
                        .createEntityManagerFactory("test");
        em = emf.createEntityManager();
        em.getTransaction().begin();
    }
    
    @After
    public void closeEntityManager() {
//        removeAll();
        em.getTransaction().rollback();
        em.close();
    }
    
    private <E> void setEntityManager(Object bm) {
        try {
            Field f = bm.getClass()
                        .getSuperclass()
                        .getSuperclass()
                        .getDeclaredField("em");
            f.setAccessible(true);
            f.set(bm, em);
        } catch (SecurityException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
        // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    
    protected <Entity> List<Entity> findAll(Class<Entity> entityClass) {
        javax.persistence.criteria.CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(entityClass));
        return em.createQuery(cq).getResultList();
    }
    
    protected void configureService(Object object) {
        
        try {
            final Field[] fields = object.getClass().getDeclaredFields();
            for (final Field f : fields) {

                final String fieldName = f.getName();
                final Matcher daoMatcher = DAO_PATTERN.matcher(fieldName);
                final Matcher serviceMatcher = SERVICE_PATTERN.matcher(fieldName);

                if (daoMatcher.matches()) {
                    f.setAccessible(true);
                    Object dao = f.getType().newInstance();
                    setEntityManager(dao);
                    f.set(object, dao);
                } else if (serviceMatcher.matches()) {
                    f.setAccessible(true);
                    Object service = f.getType().newInstance();
                    configureService(service);
                    f.set(object, service);
                    
                    exchangeHttpServletRequest(object);
                }

            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }
        
    }
    
    private void removeAll() {
        
        String str = "SET foreign_key_checks = 0;";
//        String str = "BEGIN TRANSACTION\n";

        for (Class c : entityClasses) {
            String simpleName = c.getSimpleName();
            str += "DELETE FROM " + simpleName.toLowerCase() + ";\n";
        }
        
        str = "SET foreign_key_checks = 1;";
        
        Query q = em.createNativeQuery(str);
        q.executeUpdate();
        
    }

    private void exchangeHttpServletRequest(Object parent) {
        try {
            Field f = parent.getClass()
                        .getSuperclass()
                        .getDeclaredField("request");
            f.setAccessible(true);
            HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
            HttpSession sess = Mockito.mock(HttpSession.class);
            Mockito.when(req.getSession(true)).thenReturn(sess);
            Mockito.when(sess.getId()).thenReturn(SESSION_STR);
            
            f.set(parent, req);
        } catch (SecurityException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
        // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    } 
    
}
