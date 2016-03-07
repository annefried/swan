/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno;

import de.unisaarland.discanno.entities.Users;

/**
 *
 * @author Timo Guehring
 */
public class LoginUtil {
    
    /**
     * This is a little hack because beforehand the checkLogin in UsersDAO
     * threw the exception. This led always to an stacktrace printing and could
     * not be prevented by a catch clause. The UsersDAO is a bean and therefore
     * the exception was always printed. So the checkLogin in UsersDAO does not
     * throw the exception anymore and this methods checks on the return value
     * and throws the exception depending on it. So the exception can be catched
     * on an upper layer.
     * 
     * @param user 
     */
    public static void check(Users user) {
        if (user == null) {
            throw new SecurityException("User not authorized");
        }
    }
    
}
