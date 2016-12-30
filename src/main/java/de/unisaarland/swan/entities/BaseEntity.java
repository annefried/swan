/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.swan.rest.view.View;
import java.io.Serializable;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

/**
 *
 * @author Timo Guehring
 */
@MappedSuperclass
public class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Query parameter constant for the attribute "id".
     */
    public static final String PARAM_ID = "id";

    @JsonView({View.Annotations.class,
        View.SchemeByDocId.class,
        View.SchemeById.class,
        View.Schemes.class,
        View.UsersWithProjects.class,
        View.Users.class,
        View.Login.class,
        View.Links.class,
        View.Projects.class,
        View.ProjectsForUser.class})
    @Id
    // this forces the DB to take care of primary key generation per table.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof BaseEntity)) {
            return false;
        }
        BaseEntity other = (BaseEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "de.unisaarland.swan.entities.BaseEntity[ id=" + id + " ]";
    }

}
