/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.rest.services.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.swan.LoginUtil;
import de.unisaarland.swan.business.Service;
import de.unisaarland.swan.dao.AnnotationDAO;
import de.unisaarland.swan.dao.UsersDAO;
import de.unisaarland.swan.entities.Annotation;
import de.unisaarland.swan.entities.BooleanHelper;
import de.unisaarland.swan.entities.Label;
import de.unisaarland.swan.entities.SpanType;
import de.unisaarland.swan.rest.view.View;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.CreateException;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * The REST service responsible for annotations.
 *
 * @author Timo Guehring
 */
@Stateless
@Path("/annotations")
public class AnnotationFacadeREST extends AbstractFacade<Annotation> {

    // Needed to write JSON with specific properties e.g. views
    private static final ObjectMapper mapper = new ObjectMapper();

    @EJB
    Service service;
    
    @EJB
    UsersDAO usersDAO;
    
    @EJB
    AnnotationDAO annotationDAO;

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public Response create(Annotation entity) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            service.process(entity);
            return annotationDAO.create(entity);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    /**
     * Updates an existing annotation. Used for the stretch feature in the GUI.
     * Only end, start and text can be changed.
     * 
     * @param entity (Annotation)
     * @return Response
     */
    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    public Response edit(Annotation entity) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            return service.edit(entity);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

    @DELETE
    @Path("{id}")
    public Response remove(@PathParam("id") Long id) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            service.removeAnnotation(annotationDAO.find(id));
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    /**
     * This method removes a label from an annotation. There was a bug with
     * Jersey or AngularJS which did not accept parameters in a delete request
     * in the body, therefore the REST type is given as POST and not DELETE.
     * 
     * @param annoId
     * @param label
     * @return 
     */
    @POST
    @Path("/removelabel/{annoId}")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response removeLabelFromAnnotationREST(@PathParam("annoId") Long annoId, Label label) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            service.removeLabelFromAnnotation(annotationDAO.find(annoId), label);
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    /**
     * TODO check if label belongs to the scheme
     * 
     * @param annoId
     * @param label
     * @return 
     */
    @POST
    @Path("/addlabel/{annoId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response addLabelToAnnotationREST(@PathParam("annoId") Long annoId, Label label) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Annotation anno = service.addLabelToAnnotation(annoId, label);
            return annotationDAO.merge(anno);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    @POST
    @Path("/changest/{annoId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response changeSpanTypeREST(@PathParam("annoId") Long annoId, SpanType spanType) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Annotation anno = service.changeSpanType(annoId, spanType);
            annotationDAO.merge(anno);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    @POST
    @Path("/notsure/{annoId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response setNotSureREST(@PathParam("annoId") Long annoId, BooleanHelper boolVal) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Annotation anno = annotationDAO.setNotSure(annoId, boolVal.isValue());
            annotationDAO.merge(anno);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

    @GET
    @Path("{userId}/{docId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getAnnotationsByUserIdDocId(@PathParam("userId") Long userId, @PathParam("docId") Long docId) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));

            List<Annotation> list = annotationDAO.getAllAnnotationsByUserIdDocId(userId, docId);

            return Response.ok(mapper.writerWithView(View.Annotations.class)
                                        .withRootName("annotations")
                                        .writeValueAsString(list))
                            .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (JsonProcessingException e) {
            Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, e);
            return Response.serverError().build();
        }
        
    }

}
