package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.awt.Color;

/**
 * ColorEntityMatcher is a class used to assign a color to a ColorableBaseEntity.
 *
 * @author Julia Dembowski
 */
@Entity
public class ColorEntityMatcher extends BaseEntity {

    @JsonView({ View.Scheme.class })
    @Pattern(regexp = "#[a-fA-F0-9]{6}")
    @Column(name = "Color")
    private String color;


    @JsonView({ View.Scheme.class })
    @OneToOne(optional=true,
            cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY)
    @JoinColumn(name = "Entity")
    private ColorableBaseEntity entity;




    public String getColor() { return color;}

    public void setColor(String color) { this.color = color; }


    public ColorableBaseEntity getEntity() { return entity; }

    public void setEntity(ColorableBaseEntity entity) { this.entity = entity; }

}