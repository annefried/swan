/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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
