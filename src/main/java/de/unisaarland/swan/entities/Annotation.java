/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.swan.rest.view.View;

import java.util.*;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Entity Annotation holds all the information about an annotation
 *
 * @author Timo Guehring
 */
@Entity
@XmlRootElement
@Table(uniqueConstraints={@UniqueConstraint(columnNames = { "user_fk", "document_fk", "spanType_fk", "StartS", "EndS" })})
@NamedQueries({
    @NamedQuery(
        name = Annotation.QUERY_FIND_BY_USER,
        query = "SELECT a " +
                "FROM Annotation a " +
                "WHERE a.user = :" + Annotation.PARAM_USER
    ),
    @NamedQuery(
        name = Annotation.QUERY_FIND_BY_USER_AND_DOC,
        query = "SELECT a1 " +
                "FROM Annotation a1 " +
                "WHERE a1.user.id = :" + Annotation.PARAM_USER + " AND a1.document.id = :" + Annotation.PARAM_DOCUMENT
    ),
    @NamedQuery(
        name = Annotation.QUERY_DELETE_BY_DOCUMENT,
        query = "DELETE " +
                "FROM Annotation a " +
                "WHERE a.document = :" + Annotation.PARAM_DOCUMENT
    ),
    @NamedQuery(
        name = Annotation.QUERY_DELETE_BY_USER,
        query = "DELETE " +
                "FROM Annotation a " +
                "WHERE a.user = :" + Annotation.PARAM_USER
    )
})
public class Annotation extends BaseEntity {

    /**
     * Named query identifier for "find by user".
     */
    public static final String QUERY_FIND_BY_USER = "Annotation.QUERY_FIND_BY_USER";
    
    /**
     * Named query identifier for "find by user and doc".
     */
    public static final String QUERY_FIND_BY_USER_AND_DOC = "Annotation.QUERY_FIND_BY_USER_AND_DOC";

    /**
     * Named query identifier for "delete by document"
     */
    public static final String QUERY_DELETE_BY_DOCUMENT = "Annotation.QUERY_DELETE_BY_DOCUMENT";

    /**
     * Named query identifier for "delete by user"
     */
    public static final String QUERY_DELETE_BY_USER = "Annotation.QUERY_DELETE_BY_USER";

    /**
     * Query parameter constant for the attribute "document".
     */
    public static final String PARAM_DOCUMENT = "document";
    
    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER,
                optional = true)
    @JoinColumn(name="user_fk")
    private Users user;
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinColumn(name = "document_fk")
    private Document document;

    @JsonView({ View.Annotations.class})
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name = "spanType_fk")
    private SpanType spanType;
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="ANNOTATION_LABEL",
        joinColumns={@JoinColumn(name="ANNOTATION_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LABEL_ID", referencedColumnName="id")})
    private Set<Label> labels = new HashSet<>();
    
    /**
     * "start" is a postgres keyword so use "start*" instead
     */
    @Column(name = "StartS")
    private int start;
    
    /**
     * "end" is a postgres keyword so use "end*" instead
     */
    @Column(name = "EndS")
    private int end;
    
    /**
     * The text between start and end.
     */
    @Column(name = "Text", columnDefinition = "TEXT")
    private String text;
    
    @Column(name = "NotSure")
    private boolean notSure;

    
    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public SpanType getSpanType() {
        return spanType;
    }

    public void setSpanType(SpanType spanType) {
        this.spanType = spanType;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Set<Label> getLabels() {
        return labels;
    }

    public void setLabels(Set<Label> labels) {
        this.labels = labels;
    }

    public void addLabel(Label label) {
        this.labels.add(label);
    }
    
    public void removeLabel(Label label) { this.labels.remove(label); }

    public boolean isNotSure() {
        return notSure;
    }

    public void setNotSure(boolean notSure) {
        this.notSure = notSure;
    }
    
    @Override
    public int hashCode() {
        int hash = 7;
        hash = 29 * hash + Objects.hashCode(this.user);
        hash = 29 * hash + Objects.hashCode(this.document);
        hash = 29 * hash + Objects.hashCode(this.spanType);
        hash = 29 * hash + this.start;
        hash = 29 * hash + this.end;
        return hash;
    }
    
    @Override
    public boolean equals(Object o){
        if(!(o instanceof Annotation) ){
            return false;
        }
        Annotation a = (Annotation) o;
        if(a.start == this.start && a.end == this.end && this.user.equals(a)
                && this.document.equals(a) && this.spanType.equals(a)){
            return true;
        }
        return false;
    }

    /**
     * Returns a clone of an annotation without id and empty labelMap.
     * 
     * @return
     * @throws CloneNotSupportedException 
     */
    @Override
    public Object clone() throws CloneNotSupportedException {
        Annotation newAnno = new Annotation();
        newAnno.setStart(this.start);
        newAnno.setEnd(this.end);
        newAnno.setText(this.text);
        newAnno.setNotSure(this.notSure);
        newAnno.setSpanType(this.spanType);
        newAnno.setUser(this.user);
        newAnno.setDocument(this.document);
        newAnno.setLabels(new HashSet<Label>());
        
        return newAnno;
    }

}
