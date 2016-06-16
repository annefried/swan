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
import java.util.Collections;
import java.util.List;

/**
 * This DAO (Data Access Object) provides all CRUD operations for schemes.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class SchemeDAO extends BaseEntityDAO<Scheme> {
    
    public SchemeDAO() {
        super(Scheme.class);
    }

    @Override
    public List<Scheme> findAll() {
        return executeQuery(Scheme.QUERY_FIND_ALL);
    }

    public Scheme find(final Long schemeId) {
        return firstResult(
                    executeQuery(
                        Scheme.QUERY_FIND_BY_ID,
                        Collections.singletonMap(Scheme.PARAM_SCHEME_ID, schemeId)));
    }

    public Scheme getSchemeByDocId(final Long docId) {
        return firstResult(
                executeQuery(
                        Scheme.QUERY_FIND_BY_DOC_ID,
                        Collections.singletonMap(Scheme.PARAM_DOC_ID, docId)));
    }
    
}
