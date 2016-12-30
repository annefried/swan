/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml.scheme;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Timo Guehring
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Scheme {

    private String name;

    private List<VisualizationElement> visElements = new ArrayList<>();

    private Set<SpanType> spanTypes = new HashSet<>();

    private List<LabelSet> labelSets = new ArrayList<>();

    private List<LinkType> linkTypes = new ArrayList<>();


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<VisualizationElement> getVisElements() {
        return visElements;
    }

    public void setVisElements(List<VisualizationElement> visElements) {
        this.visElements = visElements;
    }

    public Set<SpanType> getSpanTypes() {
        return spanTypes;
    }

    public void setSpanTypes(Set<SpanType> spanTypes) {
        this.spanTypes = spanTypes;
    }

    public List<LabelSet> getLabelSets() {
        return labelSets;
    }

    public void setLabelSets(List<LabelSet> labelSets) {
        this.labelSets = labelSets;
    }

    public List<LinkType> getLinkTypes() {
        return linkTypes;
    }

    public void setLinkTypes(List<LinkType> linkTypes) {
        this.linkTypes = linkTypes;
    }

}
