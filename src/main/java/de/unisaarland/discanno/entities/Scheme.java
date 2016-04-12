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
import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Entity Scheme represents a scheme file which was uploaded. A scheme
 * determines how a text should be annotated.
 * 
 * @author Timo Guehring
 */
@Entity
@XmlRootElement
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Scheme extends BaseEntity {

    @Column(name = "Name", unique = true)
    private String name;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.EAGER,
            optional = true)
    private Users creator;
    
    @JsonView({View.Schemes.class})
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_VISELEMENTS", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="VISELEMENT_ID"))
    private List<VisualizationElement> visElements = new ArrayList();
    
    @JsonView({View.Schemes.class})
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_TARGETTYPE", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="TARGETTYPE"))
    private Set<TargetType> targetTypes = new HashSet();
    
    @JsonView({View.Schemes.class})
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_LABELSET", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="LABELSET_ID"))
    private List<LabelSet> labelSets = new ArrayList();
    
    @JsonView({View.Schemes.class})
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_LINKSET", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="LINKSET_ID"))
    private List<LinkSet> linkSets = new ArrayList();
    
    @OneToMany(mappedBy = "scheme",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    private Set<Project> projects = new HashSet();
    
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Users getCreator() {
        return creator;
    }

    public void setCreator(Users creator) {
        this.creator = creator;
    }

    public List<VisualizationElement> getVisElements() {
        return visElements;
    }

    public void setVisElements(List<VisualizationElement> visElements) {
        this.visElements = visElements;
    }

    public Set<TargetType> getTargetTypes() {
        return targetTypes;
    }

    public void setTargetTypes(Set<TargetType> targetTypes) {
        this.targetTypes = targetTypes;
    }
    
    public void addTargetTypes(TargetType targetType) {
        this.targetTypes.add(targetType);
    }

    public List<LabelSet> getLabelSets() {
        return labelSets;
    }

    public void setLabelSets(List<LabelSet> labelSets) {
        this.labelSets = labelSets;
    }
    
    public void addLabelSets(LabelSet labelSet) {
        this.labelSets.add(labelSet);
    }

    public List<LinkSet> getLinkSets() {
        return linkSets;
    }

    public void setLinkSets(List<LinkSet> linksets) {
        this.linkSets = linksets;
    }

    public void addLinkSet(LinkSet linkset) {
        this.linkSets.add(linkset);
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    public void addProjects(Project project) {
        this.projects.add(project);
    }
    
}
