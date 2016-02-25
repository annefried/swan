/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.discanno.TimestampAdapter;
import de.unisaarland.discanno.rest.view.View;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

/**
 * The Entity Users represents an user.
 * Note: "User" is a keyword in the database, therefore the entity is named
 * "Users"
 * 
 * @author Timo Guehring
 */
@Entity
@Table(name = "Users")
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIdentityInfo(generator=JSOGGenerator.class)
@NamedQueries({
    @NamedQuery(
            name = Users.QUERY_FIND_BY_EMAIL_AND_PASSWORD,
            query = "SELECT u FROM Users u WHERE u.email = :" + Users.PARAM_EMAIL + " AND u.password = :" + Users.PARAM_PASSWORD),
    @NamedQuery(
            name = Users.QUERY_FIND_BY_SESSION,
            query = "SELECT u FROM Users u WHERE u.session = :" + Users.PARAM_SESSION)
})
public class Users extends BaseEntity {

    /**
     * Named query identifier for "find by email and password".
     */
    public static final String QUERY_FIND_BY_EMAIL_AND_PASSWORD = "Users.QUERY_FIND_BY_EMAIL_AND_PASSWORD";
    
    /**
     * Named query identifier for "find by session".
     */
    public static final String QUERY_FIND_BY_SESSION = "Users.QUERY_FIND_BY_SESSION";
    
    /**
     * Query parameter constant for the attribute "uuid".
     */
    public static final String PARAM_EMAIL = "email";
    
    /**
     * Query parameter constant for the attribute "password".
     */
    public static final String PARAM_PASSWORD = "password";
    
    /**
     * Query parameter constant for the attribute "session".
     */
    public static final String PARAM_SESSION = "session";
    
    
    public static enum RoleType {
        admin, user, projectmanager;
    }
    
    @Column(name = "Prename")
    private String prename;
    
    @Column(name = "Lastname")
    private String lastname;
    
    @Column(name = "EMail", unique = true)
    private String email;
    
    @JsonIgnore
    @Column(name = "Password")
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private RoleType role;
    
    @Column(name = "session")
    private String session;
    
    @XmlJavaTypeAdapter(TimestampAdapter.class)
    @Column(name = "CreateDate")
    private Timestamp createDate;
    
    @JsonView({ View.Users.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name="USERS_PROJECTS",
        joinColumns={@JoinColumn(name="USERS_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="PROJECT_ID", referencedColumnName="id")})
    private Set<Project> projects = new HashSet<>();
    
    @JsonView({ View.Users.class })
    @ManyToMany(mappedBy = "projectManager",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    private Set<Project> managingProjects = new HashSet<>();

    
    public String getPrename() {
        return prename;
    }

    public void setPrename(String prename) {
        this.prename = prename;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    public RoleType getRole() {
        return role;
    }

    @JsonIgnore
    public String getSession() {
        return session;
    }

    @JsonProperty
    public void setSession(String session) {
        this.session = session;
    }
    
    public void setRole(RoleType role) {
        this.role = role;
    }

    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }
    
    public void addProjects(Project project) {
        this.projects.add(project);
    }

    public Set<Project> getManagingProjects() {
        return managingProjects;
    }

    public void setManagingProjects(Set<Project> managingProjects) {
        this.managingProjects = managingProjects;
    }
    
    public void addManagingProjects(Project project) {
        this.managingProjects.add(project);
    }
    
}