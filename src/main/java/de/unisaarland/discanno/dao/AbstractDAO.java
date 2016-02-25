/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.BaseEntity;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.core.Response;

/**
 * This abstract DAO (Data Access Object) provides CRUD operations for all kinds of entities.
 *
 * @author Timo Guehring
 */
public class AbstractDAO {
    
    @PersistenceContext(unitName = "DiscAnnoPU")
    protected EntityManager em;
    
    /**
     * Create a not yet existing entity.
     * 
     * @param <Entity>
     * @param entity
     * @return the ID of the entity
     */
    public <Entity extends BaseEntity> Response create(Entity entity) {
        em.persist(entity);
        em.flush();
        return Response.ok("" + entity.getId()).build();
    }
    
    /**
     * Apply changes to an existing entity.
     * 
     * @param <Entity>
     * @param entity
     * @return the ID of the entity
     */
    public <Entity extends BaseEntity> Response merge(Entity entity) {
        em.merge(entity);
        em.flush();
        return Response.ok("" + entity.getId()).build();
    }

    /**
     * Remove an existing entity.
     * 
     * @param <Entity>
     * @param entity 
     */
    public <Entity extends BaseEntity> void remove(Entity entity) {
        em.remove(em.merge(entity));
    }
    
    /**
     * Get the first result of a list of entities.
     * 
     * @param <Entity>
     * @param entities
     * @return the first entity, null if list is empty
     */
    protected <Entity> Entity firstResult(List<Entity> entities) {
        if (entities.isEmpty()) {
            return null;
        } else {
            return entities.get(0);
        }
    }
    
    /**
     * 
     * @param <Entity>
     * @param entities
     * @return
     * @throws IllegalArgumentException if list is empty
     */
    protected <Entity> Entity getSingleResult(List<Entity> entities) throws IllegalArgumentException {
        if (entities.isEmpty()) {
            throw new IllegalArgumentException("AbstractDAO: empty result");
        } else {
            return entities.get(0);
        }
    }
    
    /**
     * Find an entity by ID.
     * 
     * @param <Entity>
     * @param id
     * @param entityClass
     * @param optional determines whether an exception is thrown when entity not found
     * @return found entity or throw NoResultException
     */
    protected <Entity> Entity find(Object id, Class<Entity> entityClass, boolean optional) {
        Entity result = em.find(entityClass, id);
        if (result == null && !optional) {
            throw new NoResultException("AbstractDAO: Could not find " + entityClass.getCanonicalName());
        } else {
            return result;
        }
    }
    
    /**
     * Find all entities of a specific type.
     * 
     * @param <Entity>
     * @param entityClass
     * @return a list of entities.
     */
    protected <Entity> List<Entity> findAll(Class<Entity> entityClass) {
        javax.persistence.criteria.CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(entityClass));
        return em.createQuery(cq).getResultList();
    }
    
    /**
     * Create a named query.
     * 
     * @param <Entity>
     * @param queryName
     * @param entityClass
     * @return 
     */
    protected <Entity> TypedQuery<Entity> createNamedQuery(String queryName, Class<Entity> entityClass) {
        return em.createNamedQuery(queryName, entityClass);
    }
    
}
