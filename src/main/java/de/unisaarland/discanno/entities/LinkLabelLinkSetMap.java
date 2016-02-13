/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

/**
 * The LinkLabelLinkSetMap maps LinkLabels to its corresponding LinkSets. This
 * is used to distinguish in the frontend when one Label was chosen or should be
 * removed that the proper Label is selected for the operation when belonging to
 * multiple LabelSets.
 * 
 * @author Timo Guehring
 */
@Entity
public class LinkLabelLinkSetMap extends BaseEntity {

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER,
                optional = false)
    private LinkLabel label;
    
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LINKLABELLINKSETMAP_LINKSET",
        joinColumns={@JoinColumn(name="LINKLABELLINKSETMAP_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LINK_SET_ID", referencedColumnName="id")})
    private Set<LinkSet> linkSets = new HashSet<>();

    
    public LinkLabel getLabel() {
        return label;
    }

    public void setLabel(LinkLabel label) {
        this.label = label;
    }

    public Set<LinkSet> getLinkSets() {
        return linkSets;
    }

    public void setLinkSets(Set<LinkSet> linkSets) {
        this.linkSets = linkSets;
    }
    
    public void addLinkSets(LinkSet linkSet) {
        this.linkSets.add(linkSet);
    }
    
}
