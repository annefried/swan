/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export.model;

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
