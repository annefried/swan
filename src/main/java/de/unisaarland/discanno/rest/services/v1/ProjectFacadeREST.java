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
import de.unisaarland.discanno.dao.AnnotationDAO;
import de.unisaarland.discanno.dao.LinkDAO;
import de.unisaarland.discanno.dao.ProjectDAO;
import de.unisaarland.discanno.dao.UsersDAO;
import de.unisaarland.discanno.export.ExportUtil;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Users;
import de.unisaarland.discanno.rest.view.View;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
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
import org.apache.commons.io.FileUtils;

/**
 * The REST service responsible for projects.
 *
 * @author Timo Guehring
 */
@Stateless
@Path("/project")
public class ProjectFacadeREST extends AbstractFacade<Project> {

    // Needed to write JSON with specific properties e.g. views
    private static ObjectMapper mapper = new ObjectMapper();

    @EJB
    Service service;
    
    @EJB
    UsersDAO usersDAO;
    
    @EJB
    ProjectDAO projectDAO;
    
    @EJB
    AnnotationDAO annotationDAO;
    
    @EJB
    LinkDAO linkDAO;
    

    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public Response create(Project entity) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.process(entity);
            return projectDAO.create(entity);
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

    }

    @DELETE
    @Path("{id}")
    public Response remove(@PathParam("id") Long id) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.removeProject(projectDAO.find(id, false));
            return Response.status(Response.Status.OK).build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/add/{projId}/{userId}")
    public Response addUserToProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.addUserToProject(projId, userId);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (NoResultException | CloneNotSupportedException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/del/{projId}/{userId}")
    public Response deleteUserFromProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.removeUserFromProject(projId, userId);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/addManager/{projId}/{userId}")
    public Response addProjectManagerToProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.addProjectManagerToProject(projId, userId);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/delManager/{projId}/{userId}")
    public Response deleteProjectManagerFromProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {
        
        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
            service.removeProjectManagerFromProject(projId, userId);
            return Response.ok().build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

    }
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response getProjects() throws URISyntaxException {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));

            List<Project> list = projectDAO.findAll();

            return Response.ok(mapper.writerWithView(View.Projects.class)
                                        .withRootName("projects")
                                        .writeValueAsString(list))
                            .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (JsonProcessingException ex) {
            Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
        
    }

    @GET
    @Path("/byuser/{userId}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getProjectsByUserId(@PathParam("userId") Long userId) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));

            List<Project> list = projectDAO.getAllProjectsByUserId(userId);

            return Response.ok(mapper.writerWithView(View.Projects.class)
                                        .withRootName("projects")
                                        .writeValueAsString(list))
                            .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (JsonProcessingException ex) {
            Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
        
    }
    
    /**
     * This method returns a zip archive containing all Users annotations project
     * related. For each document and user pair will be a single .xml file
     * created in the de.unisaarland.disacnno.export.model format.
     * 
     * @param projId
     * @return 
     */
    @GET
    @Path("/export/{projId}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response exportProjectByProjIdAsZip(@PathParam("projId") Long projId) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));

            Project proj = (Project) projectDAO.find(projId, false);
            
            ExportUtil exportUtil = new ExportUtil(annotationDAO, linkDAO);
            File file = exportUtil.getExportData(proj);
            
            return Response
                        .ok(FileUtils.readFileToByteArray(file))
                        .header("Content-Disposition", "attachment; filename=\"export_" + proj.getName() + ".zip\"")
                        .build();
            
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (IOException ex) {
            Logger.getLogger(ProjectFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }
    
     /**
     * This method returns a zip archive containing all Users annotations project
     * related. For each document and user pair will be a single .xml file
     * created in the de.unisaarland.disacnno.export.model format.
     * 
     * @param projId
     * @return 
     */
    @GET
    @Path("/exportXmi/{projId}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response exportProjectByProjIdAsXmiZip(@PathParam("projId") Long projId) {

        try {
            LoginUtil.check(usersDAO.checkLogin(getSessionID()));

            Project proj = (Project) projectDAO.find(projId, false);
            
            ExportUtil exportUtil = new ExportUtil(annotationDAO, linkDAO);
            File file = exportUtil.getExportDataXmi(proj);
            
            return Response
                        .ok(FileUtils.readFileToByteArray(file))
                        .header("Content-Disposition", "attachment; filename=\"exportXmi_" + proj.getName() + ".zip\"")
                        .build();
            
        } catch (SecurityException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        } catch (IOException ex) {
            Logger.getLogger(ProjectFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        } catch (NoResultException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        
    }

}
