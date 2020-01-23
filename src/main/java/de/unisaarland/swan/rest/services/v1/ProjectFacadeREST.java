/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.rest.services.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.unisaarland.swan.LoginUtil;
import de.unisaarland.swan.business.Service;
import de.unisaarland.swan.dao.*;
import de.unisaarland.swan.export.ExportUtil;
import de.unisaarland.swan.entities.Project;
import de.unisaarland.swan.entities.Users;
import de.unisaarland.swan.reimport.ImportUtil;
import de.unisaarland.swan.rest.view.View;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.*;
import javax.persistence.NoResultException;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.FileUtils;
import org.xml.sax.SAXException;

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

	@EJB
	SchemeDAO schemeDAO;


	@POST
	@Consumes({MediaType.APPLICATION_JSON})
	public Response create(Project entity) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
			service.process(entity);
			return projectDAO.create(entity);
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
			service.removeProject(id);
			return Response.status(Response.Status.OK).build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (CreateException e) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} catch (NoResultException e) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@POST
	@Consumes({MediaType.APPLICATION_JSON})
	@Path("/add/{projId}/{userId}")
	public Response addUserToProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) throws CloneNotSupportedException {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
			service.addUserToProject(projId, userId);
			return Response.ok().build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (CreateException e) {
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
		} catch (CreateException ex) {
			return Response.status(Response.Status.BAD_REQUEST).build();
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
		} catch (CreateException ex) {
			return Response.status(Response.Status.BAD_REQUEST).build();
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
		} catch (CreateException ex) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@POST
	@Consumes({MediaType.APPLICATION_JSON})
	@Path("/addWatchingUser/{projId}/{userId}")
	public Response addWatchingUserToProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
			service.addWatchingUserToProject(projId, userId);
			return Response.ok().build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (CreateException ex) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@POST
	@Consumes({MediaType.APPLICATION_JSON})
	@Path("/delWatchingUser/{projId}/{userId}")
	public Response deleteWatchingUserFromProject(@PathParam("projId") Long projId, @PathParam("userId") Long userId) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));
			service.removeWatchingUserFromProject(projId, userId);
			return Response.ok().build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (CreateException ex) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@GET
	@Path("/byuser/")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getProjectsByUserId(@QueryParam("userId") Long userId, @QueryParam("page") Integer page) {

		try {
			if (page < 1) throw new IllegalArgumentException();
			LoginUtil.check(usersDAO.checkLogin(getSessionID()));

			Users user = (Users) usersDAO.find(userId, false);
			List<Project> list = service.getProjectsByUser(user, page);

			Class clazz = user.getRole() == Users.RoleType.annotator ? View.ProjectsForUser.class : View.Projects.class;
			return Response.ok(mapper.writerWithView(clazz)
				.withRootName("projects")
				.writeValueAsString(list))
				.build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (JsonProcessingException ex) {
			Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
			return Response.serverError().build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@GET
	@Path("/byId/{projId}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getProjectById(@PathParam("projId") Long projId) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID()));

			Project proj = (Project) projectDAO.find(projId, false);

			return Response.ok(mapper.writerWithView(View.ProjectsForUser.class)
				.withRootName("project")
				.writeValueAsString(proj))
				.build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (JsonProcessingException ex) {
			Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
			return Response.serverError().build();
		} catch (IllegalArgumentException e) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

	@GET
	@Path("/count/byuser/{userId}")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getProjectCountsByUserId(@PathParam("userId") Long userId) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID()));

			Long number = service.getProjectCountsByUser(userId);

			return Response.ok(mapper.writeValueAsString(number)).build();
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (JsonProcessingException ex) {
			Logger.getLogger(SchemeFacadeREST.class.getName()).log(Level.SEVERE, null, ex);
			return Response.serverError().build();
		}

	}

	/**
	 * Returns a list of all project names, so the frontend can check on
	 * duplicate names.
	 *
	 * @return
	 */
	@GET
	@Path("/names")
	@Produces({MediaType.APPLICATION_JSON})
	public Response getAllProjectNames() {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));

			List<String> list = projectDAO.getAllProjectNames();

			return Response.ok(mapper.writer()
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
	@Path("search")
	@Produces({MediaType.APPLICATION_JSON})
	public Response search(@QueryParam("userId") Long userId, @QueryParam("searchKeyword") String searchKeyword) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID()));

			Users user = (Users) usersDAO.find(userId, false);
			List<Project> list = projectDAO.search(user, searchKeyword.toLowerCase());

			Class clazz = user.getRole() == Users.RoleType.annotator ? View.ProjectsForUser.class : View.Projects.class;
			return Response.ok(mapper.writerWithView(clazz)
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
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));

			Project proj = (Project) projectDAO.find(projId, false);

			ExportUtil exportUtil = new ExportUtil(annotationDAO, linkDAO);
			File file = exportUtil.getExportDataInXML(proj);

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
	 * related. For each document and user pair will be a single .xmi file
	 * created in the UIMA format.
	 *
	 * @param projId
	 * @return
	 */
	@GET
	@Path("/exportXmi/{projId}")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response exportProjectByProjIdAsXmiZip(@PathParam("projId") Long projId) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));

			Project proj = (Project) projectDAO.find(projId, false);

			ExportUtil exportUtil = new ExportUtil(annotationDAO, linkDAO);
			File file = exportUtil.getExportDataInXMI(proj);

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


	/**
	 * Import a previously exported project in .zip format
	 *
	 * @param userId
	 * @param projectName
	 * @param tokenizationLang
	 * @param is
	 * @return
	 */
	@POST
	@Path("/reimport/{userId}/{projectName}/{tokenizationLang}")
	@Consumes(MediaType.APPLICATION_OCTET_STREAM)
	public Response reimportProjectAsZip(@PathParam("userId") Long userId, @PathParam("projectName") String projectName,
										 @PathParam("tokenizationLang") Project.TokenizationLang tokenizationLang, InputStream is) {

		try {
			LoginUtil.check(usersDAO.checkLogin(getSessionID(), Users.RoleType.projectmanager));

			ImportUtil importUtil = new ImportUtil(annotationDAO, linkDAO, usersDAO, schemeDAO, projectDAO, service);
			return importUtil.importProjectXML(is, userId, projectName, tokenizationLang);
		} catch (SecurityException e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		} catch (CreateException ex) {
			ex.printStackTrace();
			return Response.status(Response.Status.BAD_REQUEST).build();
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Response.Status.BAD_REQUEST).build();
		} catch (SAXException e) {
			e.printStackTrace();
			return Response.status(Response.Status.BAD_REQUEST).build();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			return Response.status(Response.Status.BAD_REQUEST).build();
		} catch (JAXBException e) {
			e.printStackTrace();
			return Response.status(Response.Status.BAD_REQUEST).build();
		}

	}

}
