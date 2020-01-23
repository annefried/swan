/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml;

import java.util.Set;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Annemarie Friedrich
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class Label {

    @XmlAttribute
    private String labelSetName;

    private Set<String> label;

    public String getlabelSetName() {
        return labelSetName;
    }

    public void setLabelSetName(String labelSetName) {
        this.labelSetName = labelSetName;
    }

    public Set<String> getLabel() {
        return label;
    }

    public void setLabel(Set<String> label) {
        this.label = label;
    }

}
