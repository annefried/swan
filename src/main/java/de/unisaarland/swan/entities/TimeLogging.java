/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonView;
import de.unisaarland.swan.TimestampAdapter;
import de.unisaarland.swan.rest.view.View;

import java.sql.Timestamp;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

/**
 * The Entity TimeLogging represents the time logging for a specific user.
 * 
 * @author Timo Guehring
 */
@Entity
@NamedQueries({
    @NamedQuery(
        name = TimeLogging.QUERY_FIND_BY_USER_ID,
        query = "SELECT t " +
                "FROM TimeLogging t " +
                "WHERE t.users.id = :" + TimeLogging.PARAM_USER_ID + " " +
                "ORDER BY t.loggedat DESC"
    ),
    @NamedQuery(
        name = TimeLogging.QUERY_DELETE_BY_USER,
        query = "DELETE " +
                "FROM TimeLogging t " +
                "WHERE t.users = :" + TimeLogging.PARAM_USER
    )
})
public class TimeLogging extends BaseEntity {

    /**
     * Named query identifier for "find by user id".
     */
    public static final String QUERY_FIND_BY_USER_ID = "TimeLogging.QUERY_FIND_BY_USER_ID";

    /**
     * Named query identifier for "find by user to delete".
     */
    public static final String QUERY_DELETE_BY_USER = "TimeLogging.QUERY_DELETE_BY_USER";

    /**
     * Query parameter constant for the attribute "user id".
     */
    public static final String PARAM_USER_ID = "user_id";

    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";

    @JsonView({ View.Timelogging.class })
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Column(name = "LoggedAt")
    private Timestamp loggedat;
    
    /**
     * Unit: minutes
     */
    @JsonView({ View.Timelogging.class })
    @Column(name = "LoggedTime")
    private int loggedtime;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY)
    @JoinColumn(name = "user_fk", nullable = false)
    private Users users;

    
    public Timestamp getLoggedat() {
        return loggedat;
    }

    public void setLoggedat(Timestamp loggedat) {
        this.loggedat = loggedat;
    }

    public int getLoggedtime() {
        return loggedtime;
    }

    public void setLoggedtime(int loggedtime) {
        this.loggedtime = loggedtime;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }
    
}
