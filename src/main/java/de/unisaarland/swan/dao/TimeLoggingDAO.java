/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.TimeLogging;
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
                    TimeLogging.QUERY_FIND_BY_USER,
                    Collections.singletonMap(TimeLogging.PARAM_USER, id));
    }
    
}
