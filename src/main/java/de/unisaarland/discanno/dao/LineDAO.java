/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Line;
import java.util.Collections;
import java.util.List;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

/**
 * This DAO (Data Access Object) provides all CRUD operations for lines.
 *
 * @author Timo Guehring
 */
@Stateless
@TransactionAttribute(TransactionAttributeType.MANDATORY)
public class LineDAO extends BaseEntityDAO<Line> {

    public LineDAO() {
        super(Line.class);
    }
    
    public List<Line> getAllLinesByDocId(Long docId) {
        return executeQuery(
                    Line.QUERY_FIND_BY_DOCUMENT,
                    Collections.singletonMap(Line.PARAM_DOCUMENT, docId));
    }
    
}
