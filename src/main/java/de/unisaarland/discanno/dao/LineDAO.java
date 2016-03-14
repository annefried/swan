/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.dao;

import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Line;
import de.unisaarland.discanno.entities.Token;
import java.util.Collections;
import java.util.Comparator;
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

    private static class Comp implements Comparator<Token> {

        @Override
        public int compare(Token t1, Token t2) {
            return Integer.compare(t1.getPos(), t2.getPos());
        }
        
    }
    
    private static Comp COMP = new Comp();
    
    public LineDAO() {
        super(Line.class);
    }
    
    
    
    public List<Line> getAllLinesByDocId(Long docId) {
        List<Line> list = executeQuery(
                    Line.QUERY_FIND_BY_DOCUMENT,
                    Collections.singletonMap(Line.PARAM_DOCUMENT, docId));
        
        for (Line l : list) {
            List<Token> tokenList = l.getTokens();
            tokenList.sort(COMP);
        }
        
        return list;
    }
    
}
