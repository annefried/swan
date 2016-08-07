package de.unisaarland.swan.export.model.xml.scheme;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Timo Guehring
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class LinkType {

    private String name;

    private SpanType startSpanType;

    private SpanType endSpanType;

    private boolean allowUnlabeledLinks;

    private List<LinkLabel> linkLabels = new ArrayList<>();


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SpanType getStartSpanType() {
        return startSpanType;
    }

    public void setStartSpanType(SpanType startSpanType) {
        this.startSpanType = startSpanType;
    }

    public SpanType getEndSpanType() {
        return endSpanType;
    }

    public void setEndSpanType(SpanType endSpanType) {
        this.endSpanType = endSpanType;
    }

    public boolean isAllowUnlabeledLinks() {
        return allowUnlabeledLinks;
    }

    public void setAllowUnlabeledLinks(boolean allowUnlabeledLinks) {
        this.allowUnlabeledLinks = allowUnlabeledLinks;
    }

    public List<LinkLabel> getLinkLabels() {
        return linkLabels;
    }

    public void setLinkLabels(List<LinkLabel> linkLabels) {
        this.linkLabels = linkLabels;
    }

}
