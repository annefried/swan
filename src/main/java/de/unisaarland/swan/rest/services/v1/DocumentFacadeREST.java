/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.rest.services.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.swan.LoginUtil;
import de.unisaarland.swan.business.Service;
import de.unisaarland.swan.dao.DocumentDAO;
import de.unisaarland.swan.dao.UsersDAO;
import de.unisaarland.swan.entities.BooleanHelper;
import de.unisaarland.swan.entities.Document;
import de.unisaarland.swan.tokenization.model.Line;
import de.unisaarland.swan.entities.Users;
import de.unisaarland.swan.rest.view.View;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.CreateException;
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
    @Path("/{docId}/{userId}")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response markDocumentAsCompleted(
                        @PathParam("docId") Long docId,
                        @PathParam("userId") Long userId,
                        BooleanHelper boolVal) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.annotator));
            Document doc = service.markDocumentAsCompletedByDocIdUserId(docId, userId, boolVal.isValue());
            documentDAO.merge(doc);
            return Response.ok().build();
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    @POST
    @Path("/adddoctoproject")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response addDocumentToProjectREST(Document entity) throws CloneNotSupportedException {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            Document doc = service.addDocumentToProject(entity);
            return documentDAO.create(doc);
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
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.removeDocument(documentDAO.findDocumentById(id));
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (CreateException | NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Document find(@PathParam("id") Long id) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Document doc = documentDAO.findDocumentById(id);
            return doc;
        } catch (SecurityException | NoResultException e) {
           return null;
        }
        
    }
    
    /**
     * Returns the tokenized text of the document.
     * 
     * The document will be tokenized with every call of getTokensByDocId. Tests
     * showed that the tokenization with the creation of the document and storing
     * the data in the database carries big performance disadvantages. Tokenize
     * the document with every request is faster than retrieving them out of
     * the database and sorting the values per token position and line.
     * 
     * @param docId
     * @return 
     */
    @GET
    @Path("/tokens/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getTokensByDocId(@PathParam("id") Long docId) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            
            List<Line> list = service.getTokensByDocId(docId);
            return Response.ok(mapper.writerWithView(View.Tokens.class)
                                        .withRootName("tokens")
                                        .writeValueAsString(list))
                            .build();
        } catch (SecurityException e){
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        } catch (JsonProcessingException ex) {
            Logger.getLogger(DocumentFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        
    }

}
