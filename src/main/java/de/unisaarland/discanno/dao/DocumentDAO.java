/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Document;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Accress Object) provides all CRUD operations for documents.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class DocumentDAO extends BaseEntityDAO<Document> {
    
    public DocumentDAO() {
        super(Document.class);
    }
    
}
