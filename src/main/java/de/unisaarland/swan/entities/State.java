/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import java.sql.Timestamp;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 *
 * @author Timo Guehring
 */
@Entity
@Table(uniqueConstraints={@UniqueConstraint(columnNames = { "user_fk", "document_fk" })})
@NamedQueries({
    @NamedQuery(
        name = State.QUERY_FIND_BY_DOC_AND_USER,
        query = "SELECT s " +
                "FROM State s " +
                "WHERE s.document.id = :" + State.PARAM_DOC + " AND s.user.id = :" + State.PARAM_USER
    ),
    @NamedQuery(
        name = State.QUERY_DELETE_BY_USER,
        query = "DELETE " +
                "FROM State s " +
                "WHERE s.user = :" + State.PARAM_USER
    ),
    @NamedQuery(
        name = State.QUERY_DELETE_BY_DOCUMENT,
        query = "DELETE " +
                "FROM State s " +
                "WHERE s.document.id = :" + State.PARAM_DOC
    )
})
public class State extends BaseEntity {

    /**
     * Named query identifier for "find by doc and user".
     */
    public static final String QUERY_FIND_BY_DOC_AND_USER = "State.QUERY_FIND_BY_DOC_AND_USER";
    
    /**
     * Named query identifier for "find by user".
     */
    public static final String QUERY_DELETE_BY_USER = "State.QUERY_DELETE_BY_USER";

    /**
     * Named query identifier for "delete by document".
     */
    public static final String QUERY_DELETE_BY_DOCUMENT = "State.QUERY_DELETE_BY_DOCUMENT";

    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";
    
    /**
     * Query parameter constant for the attribute "document".
     */
    public static final String PARAM_DOC = "doc";
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="document_fk")
    private Document document;
    
    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="user_fk")
    private Users user;
    
    @Column(name = "Completed")
    private boolean completed;
    
    @Column(name = "LastEdit")
    private Timestamp lastEdit;

    
    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Timestamp getLastEdit() {
        return lastEdit;
    }

    public void setLastEdit(Timestamp lastEdit) {
        this.lastEdit = lastEdit;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash += 83 * hash + Objects.hashCode(this.document);
        hash += 83 * hash + Objects.hashCode(this.user);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (obj instanceof State) {
            final State other = (State) obj;
            if (other.getDocument().equals(this.getDocument())
                    && other.getUser().equals(this.getUser())) {
                return true;
            }
        }

        return false;
    }
    
}
