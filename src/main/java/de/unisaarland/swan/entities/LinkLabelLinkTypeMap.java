/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

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
 * The LinkLabelLinkTypeMap maps LinkLabels to its corresponding LinkTypes. This
 * is used to distinguish in the frontend when one Label was chosen or should be
 * removed that the proper Label is selected for the operation when belonging to
 * multiple LabelSets.
 * 
 * @author Timo Guehring
 */
@Entity
public class LinkLabelLinkTypeMap extends BaseEntity {

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER,
                optional = false)
    private LinkLabel label;
    
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LINKLABELLINKTYPEMAP_LINKTYPE",
        joinColumns={@JoinColumn(name="LINKLABELLINKTYPEMAP_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="LINK_TYPE_ID", referencedColumnName="id")})
    private Set<LinkType> linkTypes = new HashSet<>();

    
    public LinkLabel getLabel() {
        return label;
    }

    public void setLabel(LinkLabel label) {
        this.label = label;
    }

    public Set<LinkType> getLinkTypes() {
        return linkTypes;
    }

    public void setLinkTypes(Set<LinkType> linkTypes) {
        this.linkTypes = linkTypes;
    }
    
    public void addLinkTypes(LinkType linkTyp) {
        this.linkTypes.add(linkTyp);
    }
    
}
