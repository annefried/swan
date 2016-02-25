/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Timo Guehring
 */
@XmlType(propOrder={ "from", "to", "labels" })
@XmlAccessorType(XmlAccessType.FIELD)
public class Link {
    
    private Long from;
    
    private Long to;

    @XmlElement(name = "label")
    private LabelSet labels;
    
    
    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }

    public LabelSet getLabels() {
        return labels;
    }

    public void setLabels(LabelSet labels) {
        this.labels = labels;
    }
    
}