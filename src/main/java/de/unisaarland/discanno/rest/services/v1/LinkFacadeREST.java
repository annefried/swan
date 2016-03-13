/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.rest.services.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.discanno.LoginUtil;
import de.unisaarland.discanno.business.Service;
import de.unisaarland.discanno.dao.LinkDAO;
import de.unisaarland.discanno.dao.UsersDAO;
import de.unisaarland.discanno.entities.Link;
import de.unisaarland.discanno.entities.LinkLabel;
import de.unisaarland.discanno.entities.Users;
import de.unisaarland.discanno.rest.view.View;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
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
 * The REST service responsible for links.
 *
 * @author Timo Guehring
 */
@Stateless
@Path("/links")
public class LinkFacadeREST extends AbstractFacade<Link> {

    // Needed to write JSON with specific properties e.g. views
    private static final ObjectMapper mapper = new ObjectMapper();

    @EJB
    Service service;
    
    @EJB
    UsersDAO usersDAO;
    
    @EJB
    LinkDAO linkDAO;
    
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public Response create(Link entity) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.annotator));
            service.process(entity);
            return usersDAO.create(entity);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

    }

    @DELETE
    @Path("{id}")
    public Response remove(@PathParam("id") Long id) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.annotator));
            usersDAO.remove(usersDAO.find(id));
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

    }

    @GET
    @Path("{userId}/{docId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getLinksByUserIdDocId(@PathParam("userId") Long userId, @PathParam("docId") Long docId) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));

            List<Link> list = linkDAO.getAllLinksByUserIdDocId(userId, docId);

            return Response.ok(mapper.writerWithView(View.Links.class)
                                        .withRootName("links")
                                        .writeValueAsString(list))
                            .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (JsonProcessingException ex) {
            Logger.getLogger(LinkFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
        
    }
    
    /**
     * This method removes a label from a link. There was a bug with
     * Jersey or AngularJS which did not accept parameters in a delete request
     * in the body, therefore the REST type is given as POST and not DELETE.
     * 
     * @param linkId
     * @param label
     * @return 
     */
    @POST
    @Path("/removelabel/{linkId}")
    @Consumes({MediaType.APPLICATION_JSON})
    public Response removeLabelFromLinkREST(@PathParam("linkId") Long linkId, LinkLabel label) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            service.removeLabelFromLink(linkDAO.find(linkId), label);
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException | IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
    @POST
    @Path("/addlabel/{linkId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response addLinkLabelToLinkREST(@PathParam("linkId") Long linkId, LinkLabel label) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));
            Link link = service.addLinkLabelToLink(linkId, label);
            linkDAO.merge(link);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

}
