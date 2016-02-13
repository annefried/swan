/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Link;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Accress Object) provides all CRUD operations for links.
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
     * Returns all annotations by a specific annotation id. Just for remove
     * purposes.
     * 
     * @param annoId
     * @return 
     */
    public List<Link> getAllLinksByAnnoId(Long annoId) {
        Map<String, Long> params = new HashMap<>();
        params.put(Link.PARAM_ANNOTATION1, annoId);
        params.put(Link.PARAM_ANNOTATION2, annoId);
        return executeQuery(Link.QUERY_FIND_BY_ANNO1_AND_ANNO2, params);
    }
    
    public List<Link> getAllLinksByUserIdDocId(Long userId, Long docId) {
        Map<String, Long> params = new HashMap<>();
        params.put(Link.PARAM_DOC, docId);
        params.put(Link.PARAM_USER, userId);
        return executeQuery(Link.QUERY_FIND_BY_DOC_AND_USER, params);
    }
    
}
