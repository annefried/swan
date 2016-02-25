/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Users;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Accress Object) provides all CRUD operations for users.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class UsersDAO extends BaseEntityDAO<Users> {
    
    public UsersDAO() {
        super(Users.class);
    }
    
    public Users checkLogin(String session, Users.RoleType role) throws SecurityException {

        Users user = getUserBySession(session);

        if (user == null
                || user.getRole() == null
                || (!role.equals(user.getRole()) && !( user.getRole().equals(Users.RoleType.admin)|| user.getRole().equals(Users.RoleType.projectmanager)))
                || role.equals(Users.RoleType.projectmanager) && !(user.getRole().equals(Users.RoleType.admin)|| user.getRole().equals(Users.RoleType.projectmanager))) {
            throw new SecurityException("User is unauthorized.");
        }

        return user;
    }
    
    public Users checkLogin(String session) throws SecurityException {
        return checkLogin(session, Users.RoleType.user);
    }
    
    public Users getUserByEmailPwd(String email, String password) {
        Map<String, String> params = new HashMap<>();
        params.put(Users.PARAM_EMAIL, email);
        params.put(Users.PARAM_PASSWORD, password);
        return firstResult(
                    executeQuery(Users.QUERY_FIND_BY_EMAIL_AND_PASSWORD, params));
    }
    
    private Users getUserBySession(String session) {
        return firstResult(
                    executeQuery(
                        Users.QUERY_FIND_BY_SESSION,
                        Collections.singletonMap(Users.PARAM_SESSION, session)));
    }
    
}