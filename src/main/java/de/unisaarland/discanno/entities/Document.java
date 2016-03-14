/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.discanno.rest.view.View;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 * The Entity Document represents a text that should be
 * annotated by users and can be divided in sections.
 * 
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Document extends BaseEntity {
    
    @JsonView({ View.Documents.class })
    @Column(name = "Name")
    private String name;
    
    /**
     * The column definiton "TEXT" determines the database type.
     * From character varying(255) to "text"
     */
    @JsonView({ View.Documents.class })
    @Column(name = "Text", columnDefinition = "TEXT")
    private String text;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                optional = false)
    @JoinColumn(name = "project_fk")
    private Project project;
    
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                mappedBy = "document")
    private Set<State> states = new HashSet<>();
    
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                mappedBy = "document")
    private List<Line> lines = new ArrayList<>();
    
    /**
     * These are the default annotations/ targets, given by the uploader.
     * They do not have an user id.
     */
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE }, fetch = FetchType.EAGER)
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
    
    public Set<Annotation> getDefaultAnnotations() {
        return defaultAnnotations;
    }

    public void setDefaultAnnotations(Set<Annotation> defaultAnnotations) {
        this.defaultAnnotations = defaultAnnotations;
    }
    
    public void removeDefaultAnnotations() {
        this.defaultAnnotations = new HashSet<>();
    }

    public List<Line> getLines() {
        return lines;
    }

    public void setLines(List<Line> lines) {
        this.lines = lines;
    }
    
}
