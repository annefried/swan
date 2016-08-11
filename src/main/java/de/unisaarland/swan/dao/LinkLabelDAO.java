/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.LinkLabel;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for linklabels.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class LinkLabelDAO extends BaseEntityDAO<LinkLabel> {
    
    public LinkLabelDAO() {
        super(LinkLabel.class);
    }
    
}