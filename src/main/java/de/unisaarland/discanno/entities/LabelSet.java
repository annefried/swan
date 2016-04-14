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
import javax.persistence.ManyToMany;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * The LabelSet Entity represents a set of labels as defined in a
 * given scheme. 
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@XmlRootElement
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class LabelSet extends BaseEntity {

    @JsonView({ View.Schemes.class })
    @Column(name = "Name")
    private String name;
    
    /**
     * Determines whether an annotation refers to several labels or one.
     */
    @JsonView({ View.Schemes.class })
    @Column(name = "Exclusive")
    private boolean exclusive;

    /**
     * Contains the targettypes which can be annotated with this label.
     */
    @JsonView({ View.Schemes.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name="TARGETTYPE_LABELSET",
        joinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="TARGETTYPE", referencedColumnName="TargetType")})
    private Set<TargetType> appliesToTargetTypes = new HashSet<>();
    
    @JsonView({ View.Schemes.class })
    @ManyToMany(mappedBy = "labelSet",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    private List<Label> labels = new ArrayList<>();
    
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isExclusive() {
        return exclusive;
    }

    public void setExclusive(boolean exclusive) {
        this.exclusive = exclusive;
    }

    public Set<TargetType> getAppliesToTargetTypes() {
        return appliesToTargetTypes;
    }

    public void setAppliesToTargetTypes(Set<TargetType> appliesToTargetTypes) {
        this.appliesToTargetTypes = appliesToTargetTypes;
    }
    
    public void addAppliesToTargetTypes(TargetType targetType) {
        this.appliesToTargetTypes.add(targetType);
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }
    
}
