package de.unisaarland.swan.entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;

import java.util.ArrayList;
import java.util.List;

/**
 * The entity ColorScheme represents a color scheme for a scheme, storing color information
 * about the scheme's span types, label set, link types, and (link) labels.
 *
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Julia Dembowski
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class ColorScheme extends BaseEntity {

    public static enum ColorMode {
        automatic, shaded, custom;
    }

    @JsonView({ View.SchemeByDocId.class })
    @Enumerated(EnumType.STRING)
    @Column(name = "ColorMode")
    private ColorMode colorMode;

    @JsonView({ })
    @OneToOne(optional=false, mappedBy="colorScheme",
            cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY)
    private Scheme scheme;

    @JsonView({ View.SchemeByDocId.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
            fetch = FetchType.LAZY)
    @JoinTable(name="COLORSCHEME_SPANTYPE",
            joinColumns=@JoinColumn(name="COLORSCHEME_ID"),
            inverseJoinColumns=@JoinColumn(name="COLORENTITYMATCHER_ID"))
    private List<ColorEntityMatcher> spanTypeColors = new ArrayList();

    @JsonView({ View.SchemeByDocId.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
            fetch = FetchType.LAZY)
    @JoinTable(name="COLORSCHEME_LABEL",
            joinColumns=@JoinColumn(name="COLORSCHEME_ID"),
            inverseJoinColumns=@JoinColumn(name="COLORENTITYMATCHER_ID"))
    private List<ColorEntityMatcher> labelColors = new ArrayList();

    @JsonView({ View.SchemeByDocId.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
            fetch = FetchType.LAZY)
    @JoinTable(name="COLORSCHEME_LINKLABEL",
            joinColumns=@JoinColumn(name="COLORSCHEME_ID"),
            inverseJoinColumns=@JoinColumn(name="COLORENTITYMATCHER_ID"))
    private List<ColorEntityMatcher> linkLabelColors = new ArrayList();

    @JsonView({ View.SchemeByDocId.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
            fetch = FetchType.LAZY)
    @JoinTable(name="COLORSCHEME_LABELSET",
            joinColumns=@JoinColumn(name="COLORSCHEME_ID"),
            inverseJoinColumns=@JoinColumn(name="COLORENTITYMATCHER_ID"))
    private List<ColorEntityMatcher> labelSetColors = new ArrayList();

    @JsonView({ View.SchemeByDocId.class })
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
            fetch = FetchType.LAZY)
    @JoinTable(name="COLORSCHEME_LINKTYPE",
            joinColumns=@JoinColumn(name="COLORSCHEME_ID"),
            inverseJoinColumns=@JoinColumn(name="COLORENTITYMATCHER_ID"))
    private List<ColorEntityMatcher> linkTypeColors = new ArrayList();

    public ColorMode getColorMode() {
        return colorMode;
    }

    public void setColorMode(ColorMode colorMode) {
        this.colorMode = colorMode;
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }

    public List<ColorEntityMatcher> getSpanTypeColors() {
        return spanTypeColors;
    }

    public void setSpanTypeColors(List<ColorEntityMatcher> spanTypeColors) {
        this.spanTypeColors = spanTypeColors;
    }

    public List<ColorEntityMatcher> getLabelColors() {
        return labelColors;
    }

    public void setLabelColors(List<ColorEntityMatcher> labelColors) {
        this.labelColors = labelColors;
    }

    public List<ColorEntityMatcher> getLinkLabelColors() {
        return linkLabelColors;
    }

    public void setLinkLabelColors(List<ColorEntityMatcher> linkLabelColors) {
        this.linkLabelColors = linkLabelColors;
    }

    public List<ColorEntityMatcher> getLabelSetColors() {
        return labelSetColors;
    }

    public void setLabelSetColors(List<ColorEntityMatcher> labelSetColors) {
        this.labelSetColors = labelSetColors;
    }

    public List<ColorEntityMatcher> getLinkTypeColors() {
        return linkTypeColors;
    }

    public void setLinkTypeColors(List<ColorEntityMatcher> linkTypeColors) {
        this.linkTypeColors = linkTypeColors;
    }

}