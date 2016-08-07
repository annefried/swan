/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.dao;

import de.unisaarland.swan.entities.Document;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import java.util.Collections;

/**
 * This DAO (Data Access Object) provides all CRUD operations for documents.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class DocumentDAO extends BaseEntityDAO<Document> {
    
    public DocumentDAO() {
        super(Document.class);
    }

    public Document findDocumentById(Long docId) {
        return firstResult(
                    executeQuery(
                            Document.QUERY_FIND_BY_ID,
                            Collections.singletonMap(Document.PARAM_ID, docId)));
    }
    
}
