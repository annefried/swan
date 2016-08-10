/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.Link;
import de.unisaarland.swan.entities.Users;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for links.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class LinkDAO extends BaseEntityDAO<Link> {

    public LinkDAO() {
        super(Link.class);
    }
    
    /**
     * TODO https://github.com/annefried/swan/issues/238
     *
     * Returns all annotations by a specific annotation id. Just for remove
     * purposes.
     * 
     * @param annoId
     * @return 
     */
    public List<Link> getAllLinksByAnnoId(final Long annoId) {
        Map<String, Long> params = new HashMap<>();
        params.put(Link.PARAM_ANNOTATION1, annoId);
        params.put(Link.PARAM_ANNOTATION2, annoId);
        return executeQuery(Link.QUERY_FIND_BY_ANNO1_AND_ANNO2, params);
    }

    public List<Link> getAllLinksByUserIdDocId(final Long userId, final Long docId) {
        Map<String, Long> params = new HashMap<>();
        params.put(Link.PARAM_DOC_ID, docId);
        params.put(Link.PARAM_USER_ID, userId);
        return executeQuery(Link.QUERY_FIND_BY_DOC_AND_USER, params);
    }

    public void removeAllLinksByDocId(final Long docId) {
        executeUpdate(
                Link.QUERY_DELETE_BY_DOC_ID,
                Collections.singletonMap(Link.PARAM_DOC_ID, docId));
    }

    public void removeAllLinksByUser(Users user) {
        executeUpdate(
                Link.QUERY_DELETE_BY_USER,
                Collections.singletonMap(Link.PARAM_USER, user));
    }

}
