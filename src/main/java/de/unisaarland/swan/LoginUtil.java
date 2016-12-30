/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan;

import de.unisaarland.swan.entities.Users;

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
