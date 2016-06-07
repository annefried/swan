/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import de.unisaarland.discanno.TimestampAdapter;
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
        name = TimeLogging.QUERY_FIND_BY_USER,
        query = "SELECT t FROM TimeLogging t WHERE t.users.id = :" + TimeLogging.PARAM_USER + " ORDER BY t.loggedat DESC")
})
public class TimeLogging extends BaseEntity {

    /**
     * Named query identifier for "find by user".
     */
    public static final String QUERY_FIND_BY_USER = "TimeLogging.QUERY_FIND_BY_USER";
    
    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";
    
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Column(name = "LoggedAt")
    private Timestamp loggedat;
    
    /**
     * Unit: minutes
     */
    @Column(name = "LoggedTime")
    private int loggedtime;
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
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
