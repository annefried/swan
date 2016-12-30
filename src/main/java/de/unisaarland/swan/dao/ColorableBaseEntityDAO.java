/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.ColorableBaseEntity;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for labels.
 *
 * @author Julia Dembowski
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class ColorableBaseEntityDAO extends BaseEntityDAO<ColorableBaseEntity> {

    public ColorableBaseEntityDAO() {
        super(ColorableBaseEntity.class);
    }

}
