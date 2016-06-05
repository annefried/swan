/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Users;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.Query;

/**
 * This DAO (Data Access Object) provides all CRUD operations for users.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class UsersDAO extends BaseEntityDAO<Users> {
    
    public UsersDAO() {
        super(Users.class);
    }
    
    public Users checkLogin(String session, Users.RoleType role) {

        Users user = getUserBySession(session);
        
        if (user == null
                || user.getRole() == null
                || (!role.equals(user.getRole()) && !( user.getRole().equals(Users.RoleType.admin)|| user.getRole().equals(Users.RoleType.projectmanager)))
                || role.equals(Users.RoleType.projectmanager) && !(user.getRole().equals(Users.RoleType.admin)|| user.getRole().equals(Users.RoleType.projectmanager))) {
            return null;
        }

        return user;
    }
    
    public Users checkLogin(String session) throws SecurityException {
        return checkLogin(session, Users.RoleType.annotator);
    }
    
    public Users getUserByEmailPwd(String email, String password) {
        String str =
                "SELECT u.id, u.email, u.role " +
                "FROM Users u WHERE u.email = ?1 AND u.password = ?2";

        Query query = em.createNativeQuery(str, Users.class);
        query.setParameter(1, email);
        query.setParameter(2, password);
        List<Object> result = query.getResultList();

        return (Users) result.get(0);
    }
    
    public Users getUserBySession(String session) {
        return firstResult(
                    executeQuery(
                        Users.QUERY_FIND_BY_SESSION,
                        Collections.singletonMap(Users.PARAM_SESSION, session)));
    }
    
    /**
     * Returns all users ascending by their email
     * 
     * @return List<Users>
     */
    public List<Users> getAllUsersAscending() {
        return executeQuery(Users.QUERY_GET_ALL_USERS_ASC);
    }
    
}
