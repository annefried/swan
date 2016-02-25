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
    
}
