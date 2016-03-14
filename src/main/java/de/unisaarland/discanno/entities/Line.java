/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.discanno.rest.view.View;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 *
 * @author Timo Guehring
 */
@Entity
//@Table(uniqueConstraints={@UniqueConstraint(columnNames = { "number", "document_fk" })})
@NamedQueries({
    @NamedQuery(
            name = Line.QUERY_FIND_BY_DOCUMENT,
            query = "SELECT l FROM Line l WHERE l.document.id = :" + Line.PARAM_DOCUMENT + " ORDER BY l.number ASC")
})
public class Line extends BaseEntity {
    
    /**
     * Named query identifier for "find by document".
     */
    public static final String QUERY_FIND_BY_DOCUMENT = "Line.QUERY_FIND_BY_DOCUMENT";
    
    /**
     * Query parameter constant for the attribute "document".
     */
    public static final String PARAM_DOCUMENT = "document";
    
    private int number;
    
    @JsonView({ View.Tokens.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                mappedBy = "line")
    private List<Token> tokens = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="document_fk")
    private Document document;

    
    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
    
    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }
    
    public void addTokens(Token token) {
        this.tokens.add(token);
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
    
}
