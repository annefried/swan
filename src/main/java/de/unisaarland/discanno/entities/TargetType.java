/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.discanno.rest.view.View;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

/**
 * The entity TargetType represents different labels a target could have.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 * 
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class TargetType implements Serializable {
    
    private static final long serialVersionUID = 1L;
    @JsonView({ View.Scheme.class, View.Annotations.class })
    @Id
    @Column(name = "TargetType")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String targetType;
    
    @JsonIgnore
    @ManyToMany(mappedBy = "appliesToTargetTypes",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    private List<LabelSet> labelSets = new ArrayList<>();


    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
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

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (targetType != null ? targetType.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final TargetType other = (TargetType) obj;
        if (!Objects.equals(this.targetType, other.targetType)) {
            return false;
        }
        return true;
    }
    
}
