/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;
import org.eclipse.persistence.config.QueryHints;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;

/**
 * The Entity Scheme represents a scheme file which was uploaded. A scheme
 * determines how a text should be annotated.
 * 
 * @author Timo Guehring
 */
@Entity
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
                "LEFT JOIN FETCH s.spanTypes " +
                "LEFT JOIN FETCH s.labelSets " +
                "LEFT JOIN FETCH s.linkTypes " +
                "LEFT JOIN FETCH s.projects " +
                "WHERE s.id = :" + Scheme.PARAM_SCHEME_ID,
        hints = {
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.labelSets.appliesToSpanTypes"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.labelSets.labels"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkTypes.startSpanType"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkTypes.endSpanType"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "s.linkTypes.linkLabels")
        }
    ),
    @NamedQuery(
        name = Scheme.QUERY_FIND_BY_DOC_ID,
        query = "SELECT DISTINCT s " +
                "FROM Scheme s " +
                "LEFT JOIN FETCH s.creator " +
                "LEFT JOIN FETCH s.spanTypes " +
                "LEFT JOIN FETCH s.labelSets " +
                "LEFT JOIN FETCH s.linkTypes " +
                "LEFT JOIN FETCH s.projects " +
                    "WHERE EXISTS( " +
                            "SELECT d " +
                            "FROM Document d " +
                            "WHERE d.id = :" + Scheme.PARAM_DOC_ID + " AND d.project.scheme = s)"
    ),
    @NamedQuery(
        name = Scheme.QUERY_SET_CREATOR_NULL,
        query = "UPDATE Scheme s " +
                "SET s.creator = null " +
                "WHERE s.creator = :" + Scheme.PARAM_CREATOR
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
     * Named query identifier for "set creator null".
     */
    public static final String QUERY_SET_CREATOR_NULL = "Scheme.QUERY_SET_CREATOR_NULL";

    /**
     * Query parameter constant for the attribute "id".
     */
    public static final String PARAM_SCHEME_ID = "id";

    /**
     * Query parameter constant for the attribute "doc_id".
     */
    public static final String PARAM_DOC_ID = "doc_id";

    /**
     * Query parameter constant for the attribute "creator".
     */
    public static final String PARAM_CREATOR = "creator";

    @JsonView({ View.Scheme.class, View.Schemes.class })
    @Column(name = "Name", unique = true)
    private String name;

    @JsonView({ View.Scheme.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY,
            optional = true)
    private Users creator;
    
    @JsonView({ View.Scheme.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    @JoinTable(name="SCHEME_VISELEMENTS", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="VISELEMENT_ID"))
    private List<VisualizationElement> visElements = new ArrayList();

    @JsonView({ View.Scheme.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(name="SCHEME_SPANTYPE", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="SPANTYPE"))
    private Set<SpanType> spanTypes = new HashSet();
    
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
    @JoinTable(name="SCHEME_LINKTYPE", 
          joinColumns=@JoinColumn(name="SCHEME_ID"),
          inverseJoinColumns=@JoinColumn(name="LINKTYPE_ID"))
    private List<LinkType> linkTypes = new ArrayList();

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

    public Set<SpanType> getSpanTypes() {
        return spanTypes;
    }

    public void setSpanTypes(Set<SpanType> spanTypes) {
        this.spanTypes = spanTypes;
    }
    
    public void addSpanTypes(SpanType spanType) {
        this.spanTypes.add(spanType);
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

    public List<LinkType> getLinkTypes() {
        return linkTypes;
    }

    public void setLinkTypes(List<LinkType> linkTypes) {
        this.linkTypes = linkTypes;
    }

    public void addLinkType(LinkType linkType) {
        this.linkTypes.add(linkType);
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
