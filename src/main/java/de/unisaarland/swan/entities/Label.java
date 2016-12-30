/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;

import javax.persistence.*;

/**
 * The Entity Label represents a label which can be used for annotations.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Label extends ColorableBaseEntity {

    /**
     * The relationship shows to which labelsets the label belongs.
     */
    @JsonView({ View.Annotations.class, View.SchemeByDocId.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(
        name="LABEL_LABELSET",
        joinColumns={@JoinColumn(name="LABEL_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LABEL_SET_ID", referencedColumnName="id")})
    private LabelSet labelSet;

    
    public LabelSet getLabelSet() {
        return labelSet;
    }

    public void setLabelSet(LabelSet labelSet) {
        this.labelSet = labelSet;
    }
    
}
