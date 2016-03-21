/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Timo Guehring
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder={ "annotations", "links" })
public class Document {

    private AnnotationSet annotations;
    
    private LinkSet links;
    
    public AnnotationSet getAnnotations() {
        return annotations;
    }

    public void setAnnotations(AnnotationSet annotations) {
        this.annotations = annotations;
    }

    public LinkSet getLinks() {
        return links;
    }

    public void setLinks(LinkSet links) {
        this.links = links;
    }


}
