/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Determines in a scheme which VisualizationElements are hidden/ open/ closed
 * e.g. timeline, normal graph or tree view.
 *
 * @author Timo Guehring
 */
@Entity
public class VisualizationElement extends BaseEntity {
    
    public static enum VisState {
        hidden, opened, closed;
    }
    
    public static enum VisKind {
        timeline, graph, tree;
    }
    
    @Enumerated(EnumType.STRING)
    private VisState visState;
    
    @Enumerated(EnumType.STRING)
    private VisKind visKind;

    
    public VisState getVisState() {
        return visState;
    }

    public void setVisState(VisState visState) {
        this.visState = visState;
    }

    public VisKind getVisKind() {
        return visKind;
    }

    public void setVisKind(VisKind visKind) {
        this.visKind = visKind;
    }
    
}
