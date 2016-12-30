/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.TimeLogging;
import de.unisaarland.swan.entities.Users;

import java.util.Collections;
import java.util.List;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for timelogging.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class TimeLoggingDAO extends BaseEntityDAO<TimeLogging> {
    
    public TimeLoggingDAO() {
        super(TimeLogging.class);
    }
    
    
    public List<TimeLogging> getAllTimeLoggingByUserId(Long id) {
        return executeQuery(
                    TimeLogging.QUERY_FIND_BY_USER_ID,
                    Collections.singletonMap(TimeLogging.PARAM_USER_ID, id));
    }

    /**
     * Removes all timelogging belonging to a user.
     *
     * @param entity
     */
    public void removeAllTimeLoggingByUser(Users entity) {
        executeUpdate(
                TimeLogging.QUERY_DELETE_BY_USER,
                Collections.singletonMap(TimeLogging.PARAM_USER, entity));
    }
    
}
