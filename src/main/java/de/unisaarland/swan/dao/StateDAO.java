/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.State;
import de.unisaarland.swan.entities.Users;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for states.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class StateDAO extends BaseEntityDAO<State> {
    
    public StateDAO() {
        super(State.class);
    }
    

    public State getStateByDocIdUserId(final Long docId, final Long userId, boolean nullOptional) {
        Map<String, Long> params = new HashMap<>();
        params.put(State.PARAM_DOC, docId);
        params.put(State.PARAM_USER, userId);
        return executeQuery(State.QUERY_FIND_BY_DOC_AND_USER, params, nullOptional);
    }

    /**
     * TODO does not work, so that other entity managers and dependencies
     * are updated and do not keep a reference.
     *
     * Removes all states by a user.
     *
     * @param user
     */
    public void removeAllStatesByUser(Users user) {
        executeUpdate(
                State.QUERY_DELETE_BY_USER,
                Collections.singletonMap(State.PARAM_USER, user));
    }

    public void removeAllStatesByDocId(final Long docId) {
        executeUpdate(
                State.QUERY_DELETE_BY_DOCUMENT,
                Collections.singletonMap(State.PARAM_DOC, docId));
    }
    
}
