/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.Annotation;
import de.unisaarland.swan.entities.Document;
import de.unisaarland.swan.entities.Users;
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

    public List<Annotation> getAllAnnotationsByUserIdDocId(final Long userId, final Long docId) {
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
     * Removes all annotations belonging to a document.
     *
     * @param entity
     */
    public void removeAllAnnotationsByDocId(Document entity) {
        executeUpdate(
                Annotation.QUERY_DELETE_BY_DOCUMENT,
                Collections.singletonMap(Annotation.PARAM_DOCUMENT, entity));
    }

    /**
     * Removes all annotations belonging to a user.
     *
     * @param entity
     */
    public void removeAllAnnotationsByUser(Users entity) {
        executeUpdate(
                Annotation.QUERY_DELETE_BY_USER,
                Collections.singletonMap(Annotation.PARAM_USER, entity));
    }

	/**
	 * Removes all annotations belonging to a user in a document.
	 *
	 * @param userId
	 * @param docId
	 */
	public void removeAllAnnotationsByUserAndDocument(final Long userId, final Long docId) {
		Map<String, Long> map = new HashMap<>();
		map.put(Annotation.PARAM_USER, userId);
		map.put(Annotation.PARAM_DOCUMENT, docId);
		executeUpdate(Annotation.QUERY_DELETE_BY_USER_AND_DOCUMENT, map);
	}

}
