/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml.scheme;

import de.unisaarland.swan.entities.*;
import de.unisaarland.swan.entities.LabelSet;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class LinkType {

    private String name;

    private SpanType startSpanType;

    private SpanType endSpanType;

    private boolean allowUnlabeledLinks;

    private boolean undirected;

    private List<LinkLabel> linkLabels = new ArrayList<>();

    private de.unisaarland.swan.entities.LinkType.LinkLabelMenuStyle linkLabelMenuStyle;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public List<LinkLabel> getLinkLabels() {
        return linkLabels;
    }

    public void setLinkLabels(List<LinkLabel> linkLabels) {
        this.linkLabels = linkLabels;
    }

    public de.unisaarland.swan.entities.LinkType.LinkLabelMenuStyle getLinkLabelMenuStyle() {
        return linkLabelMenuStyle;
    }

    public void setLinkLabelMenuStyle(de.unisaarland.swan.entities.LinkType.LinkLabelMenuStyle linkLabelMenuStyle) {
        this.linkLabelMenuStyle = linkLabelMenuStyle;
    }

}
