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
import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

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
public class LinkLabel extends BaseEntity {

    // horizontal and vertical are necessary options when timeline in the
    // corresponding scheme is selected
    public static enum LinkLabelOpts {
        horizontal, vertical;
    }
    
    @JsonView({ View.Links.class, View.Scheme.class })
    private String name;
    
    @JsonView({ View.Links.class, View.Scheme.class })
    @ElementCollection(targetClass = LinkLabelOpts.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "LINKLABEL_OPTIONS")
    private Set<LinkLabelOpts> options = new HashSet<>();
    
    /**
     * The relationship shows to which linktypes the linklabel belongs.
     */
    @JsonView({ View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LINKLABEL_LINKTYPE",
        joinColumns={@JoinColumn(name="LINKLABEL_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LINK_TYPE_ID", referencedColumnName="id")})
    private List<LinkType> linkType = new ArrayList();

    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<LinkLabelOpts> getOptions() {
        return options;
    }

    public void setOptions(Set<LinkLabelOpts> options) {
        this.options = options;
    }

    public List<LinkType> getLinkType() {
        return linkType;
    }
    
    public void addLinkType(LinkType linkType) {
        this.linkType.add(linkType);
    }
    
}
