/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

/**
 * The entity SpanType represents different labels a target could have.
 *
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
@NamedQueries({
    @NamedQuery(
        name = SpanType.QUERY_FIND_BY_SCHEME_AND_NAME,
        query = "SELECT DISTINCT s " +
                "FROM SpanType s " +
                "WHERE s.name = :" + SpanType.PARAM_NAME +
                    " AND EXISTS( " +
                            "SELECT p " +
                            "FROM Project p " +
                            "WHERE p = :" + SpanType.PARAM_PROJECT + " AND s MEMBER OF p.scheme.spanTypes)"
    )
})
public class SpanType extends ColorableBaseEntity {

    /**
     * Named query identifier for "find by scheme and id".
     */
    public static final String QUERY_FIND_BY_SCHEME_AND_NAME = "SpanType.QUERY_FIND_BY_SCHEME_AND_NAME";

    /**
     * Query parameter constant for the attribute "project".
     */
    public static final String PARAM_PROJECT = "project";

    @JsonIgnore
    @ManyToMany(mappedBy = "appliesToSpanTypes",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
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
