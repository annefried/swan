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
import org.eclipse.persistence.config.QueryHints;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
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
@NamedQueries({
    @NamedQuery(
        name = Scheme.QUERY_FIND_ALL,
        query = "SELECT DISTINCT s " +
                "FROM Scheme s " +
                "LEFT JOIN FETCH s.projects "
    ),
    @NamedQuery(
        name = Scheme.QUERY_FIND_BY_ID,
        query = "SELECT DISTINCT s " +
                "FROM Scheme s " +
                "LEFT JOIN FETCH s.creator " +
                "LEFT JOIN FETCH s.targetTypes " +
                "LEFT JOIN FETCH s.labelSets " +
                "LEFT JOIN FETCH s.linkSets " +
                "LEFT JOIN FETCH s.projects " +
                "WHERE s.id = :" + Scheme.PARAM_SCHEME_ID,
        hints = {
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.labelSets.appliesToTargetTypes"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.labelSets.labels"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkSets.startType"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkSets.endType"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkSets.linkLabels")
        }
    ),
    @NamedQuery(
        name = Scheme.QUERY_FIND_BY_DOC_ID,
        query = "SELECT DISTINCT s " +
                "FROM Scheme s " +
                "LEFT JOIN FETCH s.creator " +
                "LEFT JOIN FETCH s.targetTypes " +
                "LEFT JOIN FETCH s.labelSets " +
                "LEFT JOIN FETCH s.linkSets " +
                "LEFT JOIN FETCH s.projects " +
                    "WHERE EXISTS( " +
                            "SELECT d " +
                            "FROM Document d " +
                            "WHERE d.id = :" + Scheme.PARAM_DOC_ID + " AND d.project.scheme = s)",
        hints = { }
    )
})
public class Scheme extends BaseEntity {

    /**
     * Named query identifier for "find all".
     */
    public static final String QUERY_FIND_ALL = "Scheme.QUERY_FIND_ALL";

    /**
     * Named query identifier for "find by id".
     */
    public static final String QUERY_FIND_BY_ID = "Scheme.QUERY_FIND_BY_ID";

    /**
     * Named query identifier for "find by doc id".
     */
    public static final String QUERY_FIND_BY_DOC_ID = "Scheme.QUERY_FIND_BY_DOC_ID";

    /**
     * Query parameter constant for the attribute "id".
     */
    public static final String PARAM_SCHEME_ID = "id";

    /**
     * Query parameter constant for the attribute "doc_id".
     */
    public static final String PARAM_DOC_ID = "doc_id";


    @JsonView({ View.Scheme.class, View.Schemes.class })
    @Column(name = "Name", unique = true)
    private String name;

    @JsonView({ View.Scheme.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY,
            optional = true)
    private Users creator;
    
	@JsonView({View.Scheme.class})
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_VISELEMENTS", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="VISELEMENT_ID"))
    private List<VisualizationElement> visElements = new ArrayList();

    @JsonView({ View.Scheme.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(name="SCHEME_TARGETTYPE", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="TARGETTYPE"))
    private Set<TargetType> targetTypes = new HashSet();
    
    @JsonView({ View.Scheme.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(name="SCHEME_LABELSET", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="LABELSET_ID"))
    private List<LabelSet> labelSets = new ArrayList();
    
    @JsonView({ View.Scheme.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(name="SCHEME_LINKSET", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="LINKSET_ID"))
    private List<LinkSet> linkSets = new ArrayList();

    @JsonView({ View.Scheme.class, View.Schemes.class })
    @OneToMany(mappedBy = "scheme",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
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
