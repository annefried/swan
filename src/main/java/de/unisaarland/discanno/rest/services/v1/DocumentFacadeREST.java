/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.rest.services.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.discanno.LoginUtil;
import de.unisaarland.discanno.business.Service;
import de.unisaarland.discanno.dao.DocumentDAO;
import de.unisaarland.discanno.dao.UsersDAO;
import de.unisaarland.discanno.entities.BooleanHelper;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Users;
import java.net.URISyntaxException;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * The REST service responsible for documents.
 *
 * @author Timo Guehring
 */
@Stateless
@Path("/document")
public class DocumentFacadeREST extends AbstractFacade<Document> {

    // Needed to write JSON with specific properties e.g. views
    private static final ObjectMapper mapper = new ObjectMapper();
    
    @EJB
    Service service;
    
    @EJB
    UsersDAO usersDAO;
    
    @EJB
    DocumentDAO documentDAO;
    
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public Response create(Document entity) {
        
        try {   
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.process(entity);
            return documentDAO.create(entity);
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
    }
    
    @POST
    @Path("/{docId}/{userId}")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response markDocumentAsCompleted(
                        @PathParam("docId") Long docId,
                        @PathParam("userId") Long userId,
                        BooleanHelper boolVal) throws URISyntaxException {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.annotator));
            Document doc = service.markDocumentAsCompletedByDocIdUserId(docId, userId, boolVal.isValue());
            documentDAO.merge(doc);
            return Response.ok().build();
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    @POST
    @Path("/adddoctoproject")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response addDocumentToProjectREST(Document entity) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            Document doc = service.addDocumentToProject(entity);
            return documentDAO.create(doc);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException | IllegalArgumentException | CloneNotSupportedException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

    @DELETE
    @Path("{id}")
    public Response remove(@PathParam("id") Long id) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.removeDocument(documentDAO.find(id));
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Document find(@PathParam("id") Long id) throws URISyntaxException {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Document doc = documentDAO.find(id);
            return doc;
        } catch (SecurityException e){
           return null;
        }
        
    }

}
