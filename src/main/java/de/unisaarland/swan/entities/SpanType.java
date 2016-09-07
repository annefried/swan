/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

/**
 * The entity SpanType represents different labels a target could have.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 * 
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class SpanType extends ColorableBaseEntity {
    
    @JsonIgnore
    @ManyToMany(mappedBy = "appliesToSpanTypes",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    private List<LabelSet> labelSets = new ArrayList<>();

    public List<LabelSet> getLabelSets() {
        return labelSets;
    }

    public void setLabelSets(List<LabelSet> labelSets) {
        this.labelSets = labelSets;
    }
    
    public void addLabelSets(LabelSet labelSet) {
        this.labelSets.add(labelSet);
    }
    
}
