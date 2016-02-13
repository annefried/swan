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
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
public class LinkLabel implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @JsonView({ View.Links.class, View.Schemes.class })
    @Id
    @Column(name = "LinkLabel")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String linkLabel;
    
    /**
     * The relationship shows to which linksets the linklabel belongs.
     */
    @JsonView({ View.Links.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinTable(
        name="LINKLABEL_LINKSET",
        joinColumns={@JoinColumn(name="LINKLABEL_ID", referencedColumnName="LinkLabel")},
        inverseJoinColumns={@JoinColumn(name="LINK_LABEL_SET_ID", referencedColumnName="id")})
    private List<LinkSet> linkSet = new ArrayList();

    
    public String getLinkLabel() {
        return linkLabel;
    }

    public void setLinkLabel(String linkLabel) {
        this.linkLabel = linkLabel;
    }

    public List<LinkSet> getLinkSet() {
        return linkSet;
    }
    
    public void addLinkSet(LinkSet linkSet) {
        this.linkSet.add(linkSet);
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (linkLabel != null ? linkLabel.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the linkLabelId fields are not set
        if (!(object instanceof LinkLabel)) {
            return false;
        }
        LinkLabel other = (LinkLabel) object;
        if ((this.linkLabel == null && other.linkLabel != null) || (this.linkLabel != null && !this.linkLabel.equals(other.linkLabel))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "de.unisaarland.tempannot.entities.LinkLabel[ id=" + linkLabel + " ]";
    }
    
}
