/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

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
