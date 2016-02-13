/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.export.model;

import java.util.HashSet;
import java.util.Set;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class AnnotationSet {
    
    @XmlElement(name = "annotation")
    private Set<Annotation> annotations = new HashSet<>();
    
    
    public Set<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(Set<Annotation> annotations) {
        this.annotations = annotations;
    }
    
}
