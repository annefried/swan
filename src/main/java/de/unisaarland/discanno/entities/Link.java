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
import javax.persistence.*;

/**
 *
 * @author Timo Guehring
 */
@Entity
@NamedQueries({
    @NamedQuery(
        name = Link.QUERY_FIND_BY_DOC_AND_USER,
        query = "SELECT l " +
                "FROM Link l " +
                "WHERE l.document.id = :" + Link.PARAM_DOC_ID + " AND l.user.id = :" + Link.PARAM_USER_ID
    ),
    @NamedQuery(
        name = Link.QUERY_FIND_BY_ANNO1_AND_ANNO2,
        query = "SELECT l " +
                "FROM Link l " +
                "WHERE l.annotation1.id = :" + Link.PARAM_ANNOTATION1 + " " +
                    "OR l.annotation2.id = :" + Link.PARAM_ANNOTATION2
    ),
    @NamedQuery(
        name = Link.QUERY_DELETE_BY_DOC_ID,
        query = "DELETE " +
                "FROM Link l " +
                "WHERE l.document.id = :" + Link.PARAM_DOC_ID
    )
})
public class Link extends BaseEntity {
    
    /**
     * Named query identifier for "find by doc and user".
     */
    public static final String QUERY_FIND_BY_DOC_AND_USER = "Link.QUERY_FIND_BY_DOC_AND_USER";
    
    /**
     * Named query identifier for "find by user".
     */
    public static final String QUERY_FIND_BY_ANNO1_AND_ANNO2 = "Link.QUERY_FIND_BY_ANNO1_AND_ANNO2";

    /**
     * Named query identifier for "delete by doc id"
     */
    public static final String QUERY_DELETE_BY_DOC_ID = "Link.QUERY_DELETE_BY_DOC_ID";
    
    /**
     * Query parameter constant for the attribute "user.id".
     */
    public static final String PARAM_USER_ID = "user_id";
    
    /**
     * Query parameter constant for the attribute "document.id".
     */
    public static final String PARAM_DOC_ID = "doc_id";
    
    /**
     * Query parameter constant for the attribute "annotation1".
     */
    public static final String PARAM_ANNOTATION1 = "annotation1";
    
    /**
     * Query parameter constant for the attribute "annotation2".
     */
    public static final String PARAM_ANNOTATION2 = "annotation2";
    
    @JsonView({ View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="user_fk")
    private Users user;
    
    @JsonView({ View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "document_fk")
    private Document document;
    
    @JsonView({ View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="annotation1_fk")
    private Annotation annotation1;
    
    @JsonView({ View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="annotation2_fk")
    private Annotation annotation2;
    
    @JsonView({ View.Links.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }) 
    @JoinTable(name="LINK_LABELMAP", 
          joinColumns=@JoinColumn(name="LINK_ID"),
          inverseJoinColumns=@JoinColumn(name="MAP_ID"))
    private Set<LinkLabelLinkTypeMap> labelMap = new HashSet<>();

    
    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }
    
    public Annotation getAnnotation1() {
        return annotation1;
    }

    public void setAnnotation1(Annotation annotation1) {
        this.annotation1 = annotation1;
    }

    public Annotation getAnnotation2() {
        return annotation2;
    }

    public void setAnnotation2(Annotation annotation2) {
        this.annotation2 = annotation2;
    }

    public Set<LinkLabelLinkTypeMap> getLabelMap() {
        return labelMap;
    }

    public void setLabelMap(Set<LinkLabelLinkTypeMap> labelMap) {
        this.labelMap = labelMap;
    }

    public void addLabelMap(LinkLabelLinkTypeMap labelMap) {
        this.labelMap.add(labelMap);
    }
    
    public void removeLabelMap(LinkLabelLinkTypeMap labelMap) {
        if (!this.labelMap.remove(labelMap)) {
            throw new IllegalArgumentException("Link: LinkLabelLinkTypeMap does not exist");
        }
    }
    
    public void removeLabel(LinkLabelLinkTypeMap map, LinkType lt) {
        if (map.getLinkTypes().contains(lt)) {
            if (map.getLinkTypes().size() == 1) {
                this.labelMap.remove(map);
            } else {
                map.getLinkTypes().remove(lt);
            }
        } else {
            throw new IllegalArgumentException("Link: LinkType does not correspond with LinkLabel");
        }
    }
    
}
