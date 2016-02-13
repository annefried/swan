/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

/**
 * This DAO provides extended CRUD operations for the specified entity type.
 *
 * @author Timo Guehring
 * @param <Entity>
 */
public abstract class BaseEntityDAO<Entity> extends AbstractDAO {
    
    /**
     * The entity class.
     */
    protected final Class<Entity> entityClass;
    
    public BaseEntityDAO(Class<Entity> entityClass) {
        this.entityClass = entityClass;
    }
    
    public Entity find(Object id) {
        return em.find(entityClass, id);
    }
    
    public List<Entity> findAll() {
        return findAll(entityClass);
    }
    
    public Entity find(Object id, boolean optional) {
        Entity result = em.find(entityClass, id);
        if (result == null && !optional) {
            throw new NoResultException("AbstractDAO: Could not find " + entityClass.getCanonicalName());
        } else {
            return result;
        }
    }
    
    protected List<Entity> executeQuery(String queryName) {
        return executeQuery(queryName, Collections.EMPTY_MAP);
    }
    
    protected Entity executeQuery(String queryName, Map<String, ?> parameters, boolean nullOptional) {
        List<Entity> entities = executeQuery(queryName, parameters);
        if (entities.isEmpty()) {
            if (nullOptional) {
                return null;
            } else {
                throw new NoResultException("BaseEntityDAO: Could not find " + entityClass.getCanonicalName());
            }
        } else {
            return firstResult(entities);
        }
    }
    
    protected List<Entity> executeQuery(String queryName, Map<String, ?> parameters) {
        TypedQuery<Entity> query = createNamedQuery(queryName, entityClass);
        for (Map.Entry<String, ?> entry : parameters.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        return query.getResultList();
    }
    
}
