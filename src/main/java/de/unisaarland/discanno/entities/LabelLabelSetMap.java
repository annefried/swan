/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The LabelLabelSetMap maps Labels to its corresponding LabelSets. This is used
 * to distinguish in the frontend when one Label was chosen or should be removed
 * that the proper Label is selected for the operation when belonging to
 * multiple LabelSets.
 *
 * @author Timo Guehring
 */
@Entity
public class LabelLabelSetMap extends BaseEntity {
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER,
                optional = false)
    private Label label;
    
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LABELLABELSETMAP_LABELSET",
        joinColumns={@JoinColumn(name="LABELLABELSETMAP_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")})
    private Set<LabelSet> labelSets = new HashSet<>();

    
    public Label getLabel() {
        return label;
    }

    public void setLabel(Label label) {
        this.label = label;
    }

    public Set<LabelSet> getLabelSets() {
        return labelSets;
    }

    public void setLabelSets(Set<LabelSet> labelSets) {
        this.labelSets = labelSets;
    }
    
    public void addLabelSets(LabelSet labelSet) {
        this.labelSets.add(labelSet);
    }
    
}
