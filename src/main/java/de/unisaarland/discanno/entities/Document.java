/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.discanno.rest.view.View;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Entity Document represents a text that should be
 * annotated by users and can be divided in sections.
 * 
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
@NamedQueries({
    @NamedQuery(
        name = Document.QUERY_FIND_BY_ID,
        query = "SELECT DISTINCT d " +
                "FROM Document d " +
                "LEFT JOIN FETCH d.project " +
                "LEFT JOIN FETCH d.states " +
                "LEFT JOIN FETCH d.defaultAnnotations " +
                "WHERE d.id = :" + Document.PARAM_ID
    )
})
public class Document extends BaseEntity {

    /**
     * Named query identifier for "find by id".
     */
    public static final String QUERY_FIND_BY_ID = "Document.QUERY_FIND_BY_ID";

    /**
     * Query parameter constant for the attribute "id".
     */
    public static final String PARAM_ID = "id";

    @JsonView({ View.Documents.class, View.Projects.class })
    @Column(name = "Name")
    private String name;
    
    /**
     * The column definiton "TEXT" determines the database type.
     * From character varying(255) to "text"
     */
    @JsonView({ View.Documents.class })
    @JsonProperty(access = Access.WRITE_ONLY)
    @Column(name = "Text", columnDefinition = "TEXT")
    private String text;
    
    @JsonView({ View.Documents.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                optional = false)
    @JoinColumn(name = "project_fk")
    private Project project;
    
    @JsonView({ View.Documents.class, View.Projects.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                mappedBy = "document",
                fetch = FetchType.LAZY)
    private Set<State> states = new HashSet<>();
    
    /**
     * These are the default annotations/ targets, given by the uploader.
     * They do not have an user id.
     */
    @JsonView({ View.Documents.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.LAZY)
    @JoinTable(
        name="DOCUMENT_DEFAULTANNOTATIONS",
        joinColumns={@JoinColumn(name="DOC_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="DEFANNOTATION_ID", referencedColumnName="id")})
    private Set<Annotation> defaultAnnotations = new HashSet<>();

    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Set<State> getStates() {
        return states;
    }

    public void setStates(Set<State> states) {
        this.states = states;
    }
    
    public void addStates(State state) {
        this.states.add(state);
    }
    
    public void removeState(State state) {
        this.states.remove(state);
    }
    
    public Set<Annotation> getDefaultAnnotations() {
        return defaultAnnotations;
    }

    public void setDefaultAnnotations(Set<Annotation> defaultAnnotations) {
        this.defaultAnnotations = defaultAnnotations;
    }
    
    public void removeDefaultAnnotations() {
        this.defaultAnnotations = new HashSet<>();
    }
    
}
