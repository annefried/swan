/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Project;
import java.util.List;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

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
        return findAll();

        /*
         TODO we should optimize the fetching strategy probably via
         a manual SQL query so that we do not fetch the documents text
         attribute etc.

        final String strQuery = "SELECT p.id, p.name, p.scheme " +
                                "FROM Project AS p " +
                                "JOIN p.documents docs GROUP BY docs.project " +
                                "JOIN p.users users";

        return em.createQuery(strQuery, Project.class).getResultList();
        */
    }


    /**
     * Returns a list of all projects whose user id is included
     * in the the projects users list. Currently used to
     * retrieve all projects by users with user role 'annotator'.
     *
     * @param userId
     * @return
     */
    public List<Project> getAllProjectsByUserId(Long userId) {

        final String strQuery = "SELECT * " +
                                "FROM project p " +
                                "WHERE EXISTS(SELECT 1 " +
                                        "FROM users_projects up " +
                                        "WHERE up.users_id = ? AND p.id = up.project_id)";
        
        return em.createNativeQuery(strQuery, Project.class)
                            .setParameter(1, userId)
                            .getResultList();
    }

    /**
     * Returns a list of all projects whose user id is included
     * in the projects projectsManager list. Only used for project
     * manager.
     *
     * @param userId
     * @return
     */
    public List<Project> getAllProjectsAsProjectManagerByUserId(Long userId) {

        final String strQuery = "SELECT * " +
                                "FROM project p " +
                                "WHERE EXISTS(SELECT 1 " +
                                        "FROM PROJECTS_MANAGER pm " +
                                        "WHERE pm.manager_id = ? AND p.id = pm.project_id)";

        return em.createNativeQuery(strQuery, Project.class)
                .setParameter(1, userId)
                .getResultList();
    }
    
}
