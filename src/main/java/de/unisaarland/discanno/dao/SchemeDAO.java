/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Scheme;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Accress Object) provides all CRUD operations for schemes.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class SchemeDAO extends BaseEntityDAO<Scheme> {
    
    public SchemeDAO() {
        super(Scheme.class);
    }
    
    
    public Scheme getSchemeByDocId(Long docId) {

        final String strQuery = "SELECT * " +
                                "FROM SCHEME s " +
                                "WHERE EXISTS(SELECT 1 " +
                                            "FROM PROJECT p " +
                                            "WHERE EXISTS(SELECT 1 " +
                                                            "FROM DOCUMENT d " +
                                                            "WHERE d.id = ? AND project_fk = p.id) " +
                                            "AND p.scheme = s.id)";
        
        return (Scheme) em.createNativeQuery(strQuery, Scheme.class)
                            .setParameter(1, docId)
                            .getSingleResult();
    }
    
}
