package de.unisaarland.swan.export.model.xml.scheme;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

/**
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class VisualizationElement {

    private de.unisaarland.swan.entities.VisualizationElement.VisState visState;

    private de.unisaarland.swan.entities.VisualizationElement.VisKind visKind;


    public de.unisaarland.swan.entities.VisualizationElement.VisState getVisState() {
        return visState;
    }

    public void setVisState(de.unisaarland.swan.entities.VisualizationElement.VisState visState) {
        this.visState = visState;
    }

    public de.unisaarland.swan.entities.VisualizationElement.VisKind getVisKind() {
        return visKind;
    }

    public void setVisKind(de.unisaarland.swan.entities.VisualizationElement.VisKind visKind) {
        this.visKind = visKind;
    }

}
