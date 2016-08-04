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
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

/**
 * The Entity Label represents a label which can be used for annotations.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Label extends BaseEntity {
    
    private String name;
    
    /**
     * The relationship shows to which labelsets the label belongs.
     */
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name="LABEL_LABELSET",
        joinColumns={@JoinColumn(name="LABEL_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")})
    private List<LabelSet> labelSet = new ArrayList();

    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public List<LabelSet> getLabelSet() {
        return labelSet;
    }

    public void addLabelSet(LabelSet labelSet) {
        this.labelSet.add(labelSet);
    }
    
}
