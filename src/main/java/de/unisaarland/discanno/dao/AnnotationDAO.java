/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Annotation;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Users;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.CreateException;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.NoResultException;

/**
 * This DAO (Data Access Object) provides all CRUD operations for annotations.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class AnnotationDAO extends BaseEntityDAO<Annotation> {
    
    public AnnotationDAO() {
        super(Annotation.class);
    }
    
    
    /**
     * Marks an annotation as "not sure"
     * 
     * @param annoId
     * @param value
     * @return 
     */
    public Annotation setNotSure(Long annoId, boolean value) throws CreateException {
        try {
            Annotation anno = (Annotation) find(annoId, false);
            anno.setNotSure(value);
            return anno;
        } catch(NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public List<Annotation> getAllAnnotationsByUserIdDocId(Long userId, Long docId) {
        Map<String, Long> map = new HashMap<>();
        map.put(Annotation.PARAM_USER, userId);
        map.put(Annotation.PARAM_DOCUMENT, docId);
        return executeQuery(Annotation.QUERY_FIND_BY_USER_AND_DOC, map);
    }
    
    /**
     * Returns all annotations by a specific user id. Just for remove
     * purposes.
     * 
     * @param entity
     * @return 
     */
    public List<Annotation> getAllAnnotationsByUserId(Users entity) {
        return executeQuery(
                    Annotation.QUERY_FIND_BY_USER,
                    Collections.singletonMap(Annotation.PARAM_USER, entity));
    }
    
    /**
     * Returns all annotations by a specific document id. Just for remove
     * purposes.
     * 
     * @param entity
     * @return 
     */
    public List<Annotation> getAllAnnotationsByDocId(Document entity) {
        return executeQuery(
                    Annotation.QUERY_FIND_BY_DOCUMENT,
                    Collections.singletonMap(Annotation.PARAM_DOCUMENT, entity));
    }
    
}
