/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.ColorScheme;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for colorschemes.
 *
 * @author Julia Dembowski
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class ColorSchemeDAO extends BaseEntityDAO<ColorScheme> {

    public ColorSchemeDAO() {
        super(ColorScheme.class);
    }

}
