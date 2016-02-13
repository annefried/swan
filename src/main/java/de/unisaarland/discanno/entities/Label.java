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
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

/**
 * The Entity Label represents a label which can be used for annotations. The
 * label name is unique and is therefore the primary key.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Label implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "LabelId")
    private String labelId;
    
    /**
     * The relationship shows to which labelsets the label belongs.
     */
    @JsonView({ View.Annotations.class, View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name="LABEL_LABELSET",
        joinColumns={@JoinColumn(name="LABEL_ID", referencedColumnName="LabelId")},
        inverseJoinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")})
    private List<LabelSet> labelSet = new ArrayList();

    
    public String getLabelId() {
        return labelId;
    }

    public void setLabelId(String labelId) {
        this.labelId = labelId;
    }
    
    public List<LabelSet> getLabelSet() {
        return labelSet;
    }

    public void addLabelSet(LabelSet labelSet) {
        this.labelSet.add(labelSet);
    }

    @Override
    public int hashCode() {
        int hash = 5;
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
        final Label other = (Label) obj;
        if (!Objects.equals(this.labelId, other.labelId)) {
            return false;
        }
        return true;
    }
    
}
