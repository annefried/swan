/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml.scheme;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class LinkLabel {

    private String name;

    private Set<de.unisaarland.swan.entities.LinkLabel.LinkLabelOpts> options
                    = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<de.unisaarland.swan.entities.LinkLabel.LinkLabelOpts> getOptions() {
        return options;
    }

    public void setOptions(Set<de.unisaarland.swan.entities.LinkLabel.LinkLabelOpts> options) {
        this.options = options;
    }

}
