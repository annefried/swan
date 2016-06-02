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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

/**
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class LinkSet extends BaseEntity {
    
    @JsonView({ View.Scheme.class })
    @Column(name = "Name")
    private String name;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name = "startType_fk", nullable = false)
    private TargetType startType;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name = "endType_fk", nullable = false)
    private TargetType endType;
    
    @Column(name = "AllowUnlabeledLinks")
    private boolean allowUnlabeledLinks;
    
    @JsonView({ View.Scheme.class })
    @ManyToMany(mappedBy = "linkSet",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    private List<LinkLabel> linkLabels = new ArrayList<>();

    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public TargetType getStartType() {
        return startType;
    }

    public void setStartType(TargetType startType) {
        this.startType = startType;
    }

    public TargetType getEndType() {
        return endType;
    }

    public void setEndType(TargetType endType) {
        this.endType = endType;
    }

    public boolean isAllowUnlabeledLinks() {
        return allowUnlabeledLinks;
    }

    public void setAllowUnlabeledLinks(boolean allowUnlabeledLinks) {
        this.allowUnlabeledLinks = allowUnlabeledLinks;
    }

    public List<LinkLabel> getLinkLabels() {
        return linkLabels;
    }

    public void setLinkLabels(List<LinkLabel> linkLabels) {
        this.linkLabels = linkLabels;
    }
    
}
