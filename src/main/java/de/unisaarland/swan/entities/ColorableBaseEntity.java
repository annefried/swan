package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.swan.rest.view.View;

import javax.persistence.*;


/**
 * ColorableBaseEntity is a super class for entities for which colors can be specified.
 *
 * The JsonIdentityInfo annotations prevents infinite recursions.
 *
 * @author Julia Dembowski
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@Inheritance(strategy= InheritanceType.TABLE_PER_CLASS)
public class ColorableBaseEntity extends BaseEntity {

    @JsonView({ View.SchemeByDocId.class,
                View.SchemeById.class,
                View.Annotations.class,
                View.Links.class })
    @Column(name = "Name")
    private String name;

    /**
     * Name of Label Set or Link Type,
     * specified only for Labels and LinkLabels
     */
    @JsonIgnore
    @Transient
    private String nameParentSet;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameParentSet() {
        return nameParentSet;
    }

    public void setNameParentSet(String nameParentSet) { this.nameParentSet = nameParentSet; }

}
