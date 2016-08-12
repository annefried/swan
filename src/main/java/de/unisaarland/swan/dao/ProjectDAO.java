/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.Project;
import de.unisaarland.swan.entities.Users;

import java.util.Collections;
import java.util.List;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;

/**
 * This DAO (Data Access Object) provides all CRUD operations for projects.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class ProjectDAO extends BaseEntityDAO<Project> {
    
    public ProjectDAO() {
        super(Project.class);
    }

    public List<Project> getAllProjectsAsAdmin() {
        return executeQuery(Project.QUERY_FIND_ALL);
    }

    /**
     * Returns a list of all projects whose user id is included
     * in the the projects users list. Currently used to
     * retrieve all projects by users with user role 'annotator'.
     *
     * @param user
     * @return
     */
    public List<Project> getAllProjectsByUser(final Users user) {
        return executeQuery(
                Project.QUERY_FIND_PROJECTS_BY_USER,
                Collections.singletonMap(Project.PARAM_USER, user));
    }

    /**
     * Returns a list of all projects whose user id is included
     * in the projects projectsManager list. Only used for project
     * manager.
     *
     * @param user
     * @return
     */
    public List<Project> getAllProjectsAsProjectManagerByUser(final Users user) {
        return executeQuery(
                Project.QUERY_FIND_PROJECTS_BY_PROJECT_MANAGER,
                Collections.singletonMap(Project.PARAM_USER, user));
    }

    public Project getProjectToDelete(final Long projId) {
        return firstResult(
                    executeQuery(
                        Project.QUERY_FIND_PROJECT_TO_DELETE,
                        Collections.singletonMap(Project.PARAM_ID, projId)));
    }

    public Project getProjectToAddUser(final Long projId) {
        return firstResult(
                executeQuery(
                        Project.QUERY_FIND_PROJECT_TO_ADD_USER,
                        Collections.singletonMap(Project.PARAM_ID, projId)));
    }

    public List<String> getAllProjectNames() {
        TypedQuery<String> query = em.createNamedQuery(Project.QUERY_FIND_ALL_PROJECT_NAMES, String.class);
        return query.getResultList();
    }

}
