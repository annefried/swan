/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder={ "id", "start", "end", "text", "targetType", "labels" })
public class Annotation {
    
    private Long id;
    
    private int start;
    
    private int end;
    
    private String text;
    
    private String targetType;
    
    private LabelSet labels;

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LabelSet getLabels() {
        return labels;
    }

    public void setLabels(LabelSet labels) {
        this.labels = labels;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }
    
}