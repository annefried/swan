package de.unisaarland.swan.export.model.xml.scheme;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class LabelSet {

    private String name;

    private boolean exclusive;

    private Set<SpanType> appliesToSpanTypes = new HashSet<>();

    private List<Label> labels = new ArrayList<>();

    private de.unisaarland.swan.entities.LabelSet.LabelMenuStyle labelMenuStyle;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isExclusive() {
        return exclusive;
    }

    public void setExclusive(boolean exclusive) {
        this.exclusive = exclusive;
    }

    public Set<SpanType> getAppliesToSpanTypes() {
        return appliesToSpanTypes;
    }

    public void setAppliesToSpanTypes(Set<SpanType> appliesToSpanTypes) {
        this.appliesToSpanTypes = appliesToSpanTypes;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }


    public de.unisaarland.swan.entities.LabelSet.LabelMenuStyle getLabelMenuStyle() {
        return labelMenuStyle;
    }

    public void setLabelMenuStyle(de.unisaarland.swan.entities.LabelSet.LabelMenuStyle labelMenuStyle) {
        this.labelMenuStyle = labelMenuStyle;
    }

}
