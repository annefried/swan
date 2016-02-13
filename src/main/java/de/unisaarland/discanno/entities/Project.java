/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 * The Entity Project represents a set of documents and has a unique name.
 * 
 * @author Janna Herrmann
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
public class Project extends BaseEntity {
    
    @Column(name = "Name", unique = true)
    private String name;
    
    @OneToMany(mappedBy = "project",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.EAGER)
    private Set<Document> documents = new HashSet<>();
    
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name="PROJECTS_MANAGER",
        joinColumns={@JoinColumn(name="PROJECT_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="MANAGER_ID", referencedColumnName="id")})
    private Set<Users> projectManager = new HashSet<>();
    
    @ManyToMany(mappedBy = "projects",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    private Set<Users> users = new HashSet<>();
    
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.EAGER)
    @JoinColumn(name="Scheme", nullable = false)
    private Scheme scheme;

    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(Set<Document> documents) {
        this.documents = documents;
    }
    
    public void addDocuments(Document document) {
        this.documents.add(document);
    }
    
    public void removeDocuments(Document document) {
        this.documents.remove(document);
    }

    public Set<Users> getUsers() {
        return users;
    }

    public void setUsers(Set<Users> users) {
        this.users = users;
    }
    
    public void addUsers(Users users) {
        this.users.add(users);
    }

    public Set<Users> getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(Set<Users> projectManager) {
        this.projectManager = projectManager;
    }
    
    public void addProjectManager(Users users) {
        this.projectManager.add(users);
    }
    
    public void removeProjectManager(Users users) {
        this.projectManager.remove(users);
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }
    
}
