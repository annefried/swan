/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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

    public ColorableBaseEntityDAO() { super(ColorableBaseEntity.class); }

}
