/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.Project;
import de.unisaarland.swan.entities.SpanType;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import java.util.HashMap;
import java.util.Map;

/**
 * This DAO (Data Access Object) provides all CRUD operations for spantypes.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class SpanTypeDAO extends BaseEntityDAO<SpanType> {
    
    public SpanTypeDAO() {
        super(SpanType.class);
    }

    public SpanType getSpanTypeBySchemeAndSpanTypeId(final Project project, final SpanType spanType) {
        Map<String, Object> params = new HashMap<>();
        params.put(SpanType.PARAM_PROJECT, project);
        params.put(SpanType.PARAM_NAME, spanType.getName());
        return firstResult(
                executeQuery(SpanType.QUERY_FIND_BY_SCHEME_AND_NAME, params));
    }

}
