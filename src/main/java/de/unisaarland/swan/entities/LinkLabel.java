/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * The Entity LinkLabel represents a label which can be used for annotations
 * of links between sections.
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class LinkLabel extends ColorableBaseEntity {

    // horizontal and vertical are necessary options when timeline in the
    // corresponding scheme is selected
    public static enum LinkLabelOpts {
        horizontal, vertical;
    }

    @JsonView({ View.SchemeByDocId.class, View.SchemeById.class })
    @ElementCollection(targetClass = LinkLabelOpts.class, fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "LINKLABEL_OPTIONS")
    private Set<LinkLabelOpts> options = new HashSet<>();
    
    /**
     * The relationship shows to which linktypes the linklabel belongs.
     */
    @JsonView({ View.Links.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(
        name="LINKLABEL_LINKTYPE",
        joinColumns={@JoinColumn(name="LINKLABEL_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LINK_TYPE_ID", referencedColumnName="id")})
    private LinkType linkType;


    public Set<LinkLabelOpts> getOptions() {
        return options;
    }

    public void setOptions(Set<LinkLabelOpts> options) {
        this.options = options;
    }

    public LinkType getLinkType() {
        return linkType;
    }
    
    public void setLinkType(LinkType linkType) {
        this.linkType = linkType;
    }
    
}
