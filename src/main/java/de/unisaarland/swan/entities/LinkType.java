/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

/**
 * 
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class LinkType extends ColorableBaseEntity {

    public static enum LinkLabelMenuStyle {
        list, dropdown;
    }
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name = "startSpanType_fk", nullable = false)
    private SpanType startSpanType;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name = "endSpanType_fk", nullable = false)
    private SpanType endSpanType;
    
    @Column(name = "AllowUnlabeledLinks")
    private boolean allowUnlabeledLinks;

    /**
     * Determines whether the linkLabels should be displayed as dropdown menu or list
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "LinkLabelMenuStyle")
    private LinkLabelMenuStyle linkLabelMenuStyle;

    /**
     * Determines whether the linkType is undirected or not
     */
    @Column(name = "Undirected")
    private boolean undirected;
    
    @JsonView({ View.Scheme.class })
    @ManyToMany(mappedBy = "linkType",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    private List<LinkLabel> linkLabels = new ArrayList<>();
    
    public SpanType getStartSpanType() {
        return startSpanType;
    }

    public void setStartSpanType(SpanType startSpanType) {
        this.startSpanType = startSpanType;
    }

    public SpanType getEndSpanType() {
        return endSpanType;
    }

    public void setEndSpanType(SpanType endSpanType) {
        this.endSpanType = endSpanType;
    }

    public boolean isAllowUnlabeledLinks() {
        return allowUnlabeledLinks;
    }

    public void setAllowUnlabeledLinks(boolean allowUnlabeledLinks) {
        this.allowUnlabeledLinks = allowUnlabeledLinks;
    }

    public boolean isUndirected() { return undirected; }

    public void setUndirected(boolean undirected) { this.undirected = undirected; }

    public LinkLabelMenuStyle getLinkLabelMenuStyle() { return linkLabelMenuStyle; }

    public void setLinkLabelMenuStyle(LinkLabelMenuStyle linkLabelMenuStyle) { this.linkLabelMenuStyle = linkLabelMenuStyle; }

    public List<LinkLabel> getLinkLabels() {
        return linkLabels;
    }

    public void setLinkLabels(List<LinkLabel> linkLabels) {
        this.linkLabels = linkLabels;
    }
    
}
