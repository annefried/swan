/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.discanno.rest.view.View;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Entity Annotation holds all the information about an annotation
 * in the text:
 * - the user who annotated the text
 * - the section that is annotated
 * - the labels which belong to the annotation
 *
 * @author Timo Guehring
 */
@Entity
@XmlRootElement
@Table(uniqueConstraints={@UniqueConstraint(columnNames = { "user_fk", "document_fk", "targetType_fk", "StartS", "EndS" })})
@NamedQueries({
    @NamedQuery(
            name = Annotation.QUERY_FIND_BY_DOCUMENT,
            query = "SELECT a FROM Annotation a WHERE a.document = :" + Annotation.PARAM_DOCUMENT),
    @NamedQuery(
            name = Annotation.QUERY_FIND_BY_USER,
            query = "SELECT a FROM Annotation a WHERE a.user = :" + Annotation.PARAM_USER),
    @NamedQuery( // TODO targets
            name = Annotation.QUERY_FIND_BY_USER_AND_DOC,
            query = "SELECT a FROM Annotation a WHERE a.user.id = :" + Annotation.PARAM_USER + " AND a.document.id = :" + Annotation.PARAM_DOCUMENT)
})
public class Annotation extends BaseEntity {
    
    /**
     * Named query identifier for "find by document".
     */
    public static final String QUERY_FIND_BY_DOCUMENT = "Annotation.QUERY_FIND_BY_DOCUMENT";
    
    /**
     * Named query identifier for "find by user".
     */
    public static final String QUERY_FIND_BY_USER = "Annotation.QUERY_FIND_BY_USER";
    
    /**
     * Named query identifier for "find by user and doc".
     */
    public static final String QUERY_FIND_BY_USER_AND_DOC = "Annotation.QUERY_FIND_BY_USER_AND_DOC";
    
    /**
     * Query parameter constant for the attribute "document".
     */
    public static final String PARAM_DOCUMENT = "document";
    
    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name="user_fk")
    private Users user;
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "document_fk")
    private Document document;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "targetType_fk")
    private TargetType targetType;
    
    @JsonView({ View.Annotations.class, View.Links.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    @JoinTable(
        name="ANNOTATION_LABELMAP",
        joinColumns={@JoinColumn(name="ANNOTATION_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="MAP_ID", referencedColumnName="id")})
    private Set<LabelLabelSetMap> labelMap = new HashSet<>();
    
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

    public TargetType getTargetType() {
        return targetType;
    }

    public void setTargetType(TargetType targetType) {
        this.targetType = targetType;
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

    public Set<LabelLabelSetMap> getLabelMap() {
        return labelMap;
    }

    public void setLabelMap(Set<LabelLabelSetMap> labelMap) {
        this.labelMap = labelMap;
    }

    public void addLabelMap(LabelLabelSetMap labelMap) {
        this.labelMap.add(labelMap);
    }
    
    public void removeLabelMap(LabelLabelSetMap labelMap) {
        if (!this.labelMap.remove(labelMap)) {
            throw new IllegalArgumentException("Annotation: LabelLabelSetMap does not exist");
        }
    }
    
    public void removeLabel(LabelLabelSetMap map, LabelSet ls) {
        if (map.getLabelSets().contains(ls)) {
            if (map.getLabelSets().size() == 1) {
                this.labelMap.remove(map);
            } else {
                map.getLabelSets().remove(ls);
            }
        } else {
            throw new IllegalArgumentException("Annotation: LabelSet does not correspond with Label");
        }
    }
    
    public boolean isNotSure() {
        return notSure;
    }

    public void setNotSure(boolean notSure) {
        this.notSure = notSure;
    }
    
    @Override
    public boolean equals(Object o){
        if(!(o instanceof Annotation) ){
            return false;
        }
        Annotation a = (Annotation) o;
        if(a.start == this.start && a.end == this.end && this.user.equals(a)
                && this.document.equals(a) && this.targetType.equals(a)){
            return true;
        }
        return false;
    }

}