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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
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
public class LabelSet extends ColorableBaseEntity {

    public static enum LabelMenuStyle {
        list, dropdown;
    }

    /**
     * Determines whether an annotation refers to several labels or one.
     */
    @JsonView({ View.Scheme.class })
    @Column(name = "Exclusive")
    private boolean exclusive;

    /**
     * Determines whether the labels should be displayed as dropdown menu or list
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "LabelMenuStyle")
    private LabelMenuStyle labelMenuStyle;

    /**
     * Contains the span type which can be annotated with this label.
     */
    @JsonView({ View.Scheme.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(
        name="SPANTYPE_LABELSET",
        joinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="SPANTYPE_ID", referencedColumnName="id")})
    private List<SpanType> appliesToSpanTypes = new ArrayList<>();
    
    @JsonView({ View.Scheme.class })
    @ManyToMany(mappedBy = "labelSet",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    private List<Label> labels = new ArrayList<>();

    public boolean isExclusive() {
        return exclusive;
    }

    public void setExclusive(boolean exclusive) {
        this.exclusive = exclusive;
    }

    public List<SpanType> getAppliesToSpanTypes() {
        return appliesToSpanTypes;
    }

    public void setAppliesToSpanTypes(List<SpanType> appliesToSpanTypes) { this.appliesToSpanTypes = appliesToSpanTypes; }
    
    public void addAppliesToSpanTypes(SpanType spanType) {
        this.appliesToSpanTypes.add(spanType);
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }

    public LabelMenuStyle getLabelMenuStyle() { return labelMenuStyle; }

    public void setLabelMenuStyl(LabelMenuStyle labelMenuStyle) { this.labelMenuStyle = labelMenuStyle; }
    
}
