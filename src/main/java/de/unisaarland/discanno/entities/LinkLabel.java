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
 * of links between sections. The label name is unique and is therefore the 
 * primary key.
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
    
    @JsonView({ View.Links.class, View.Schemes.class })
    private String linkLabel;
    
    @JsonView({ View.Links.class, View.Schemes.class })
    @ElementCollection(targetClass = LinkLabelOpts.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "LINKLABEL_OPTIONS")
    private Set<LinkLabelOpts> options = new HashSet<>();
    
    /**
     * The relationship shows to which linksets the linklabel belongs.
     */
    @JsonView({ View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LINKLABEL_LINKSET",
        joinColumns={@JoinColumn(name="LINKLABEL_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LINK_LABEL_SET_ID", referencedColumnName="id")})
    private List<LinkSet> linkSet = new ArrayList();

    
    public String getLinkLabel() {
        return linkLabel;
    }

    public void setLinkLabel(String linkLabel) {
        this.linkLabel = linkLabel;
    }

    public Set<LinkLabelOpts> getOptions() {
        return options;
    }

    public void setOptions(Set<LinkLabelOpts> options) {
        this.options = options;
    }

    public List<LinkSet> getLinkSet() {
        return linkSet;
    }
    
    public void addLinkSet(LinkSet linkSet) {
        this.linkSet.add(linkSet);
    }
    
}
