/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.swan.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonView;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import de.unisaarland.swan.rest.view.View;
import org.eclipse.persistence.config.QueryHints;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * The Entity Project represents a set of documents and has a unique name.
 *
 * @author Timo Guehring
 */
@Entity
@JsonIdentityInfo(generator=JSOGGenerator.class)
@NamedQueries({
    @NamedQuery(
        name = Project.QUERY_COUNT_AS_ADMIN,
        query = "SELECT COUNT(p.id) " +
                "FROM Project p"
    ),
    @NamedQuery(
        name = Project.QUERY_COUNT_AS_PROJECT_MANAGER,
        query = "SELECT COUNT(p.id) " +
                "FROM Project p " +
                "WHERE :" + Project.PARAM_USER + " MEMBER OF p.projectManager"
    ),
    @NamedQuery(
        name = Project.QUERY_COUNT_AS_USER,
        query = "SELECT COUNT(p.id) " +
                "FROM Project p " +
                "WHERE :" + Project.PARAM_USER + " MEMBER OF p.users"
    ),
    @NamedQuery(
        name = Project.QUERY_FIND_FOR_ADMIN,
        query = "SELECT DISTINCT p " +
                "FROM Project p " +
                "ORDER BY p.id DESC",
        hints = {
            // TODO evaluate QueryHints.LOAD_GROUP_ATTRIBUTE
            // I did not see any effect
            @QueryHint(name = QueryHints.BATCH, value = "p.documents"),
            @QueryHint(name = QueryHints.BATCH, value = "p.documents.states"),
            @QueryHint(name = QueryHints.BATCH, value = "p.projectManager"),
            @QueryHint(name = QueryHints.BATCH, value = "p.watchingUsers"),
            @QueryHint(name = QueryHints.BATCH, value = "p.users"),
            @QueryHint(name = QueryHints.BATCH, value = "p.scheme"),
            @QueryHint(name = QueryHints.READ_ONLY, value = "true")
        }
    ),
    @NamedQuery(
        name = Project.QUERY_FIND_PROJECTS_FOR_PROJECT_MANAGER,
        query = "SELECT DISTINCT p " +
                "FROM Project p " +
                "WHERE :" + Project.PARAM_USER + " MEMBER OF p.projectManager " +
                "ORDER BY p.id DESC",
        hints = {
            @QueryHint(name = QueryHints.BATCH, value = "p.documents"),
            @QueryHint(name = QueryHints.BATCH, value = "p.documents.states"),
            @QueryHint(name = QueryHints.BATCH, value = "p.projectManager"),
            @QueryHint(name = QueryHints.BATCH, value = "p.watchingUsers"),
            @QueryHint(name = QueryHints.BATCH, value = "p.users"),
            @QueryHint(name = QueryHints.BATCH, value = "p.scheme"),
            @QueryHint(name = QueryHints.READ_ONLY, value = "true")
        }
    ),
    @NamedQuery(    // No need to fetch watchingUsers, users and scheme
        name = Project.QUERY_FIND_PROJECTS_FOR_USER,
        query = "SELECT DISTINCT p " +
                "FROM Project p " +
                "WHERE :" + Project.PARAM_USER + " MEMBER OF p.users " +
                "ORDER BY p.id DESC",
        hints = {
            @QueryHint(name = QueryHints.BATCH, value = "p.documents"),
            @QueryHint(name = QueryHints.BATCH, value = "p.documents.states"),
            @QueryHint(name = QueryHints.BATCH, value = "p.projectManager"),
            @QueryHint(name = QueryHints.READ_ONLY, value = "true")
        }
    ),
    @NamedQuery(
        name = Project.QUERY_FIND_PROJECT_TO_DELETE,
        query = "SELECT p " +
                "FROM Project p " +
                "LEFT JOIN FETCH p.documents " +
                "LEFT JOIN FETCH p.scheme " +
                "WHERE p.id = :" + Project.PARAM_ID,
        hints = {
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "p.documents.states"),
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "p.documents.defaultAnnotations")
        }
    ),
    @NamedQuery(
        name = Project.QUERY_FIND_PROJECT_TO_ADD_USER,
        query = "SELECT p " +
                "FROM Project p " +
                "LEFT JOIN FETCH p.documents " +
                "WHERE p.id = :" + Project.PARAM_ID,
        hints = {
            @QueryHint(name = QueryHints.LEFT_FETCH, value = "p.documents.defaultAnnotations")
        }
    ),
    @NamedQuery(
        name = Project.QUERY_FIND_ALL_PROJECT_NAMES,
        query = "SELECT p.name " +
                "FROM Project p"
    )
})
public class Project extends BaseEntity {

    public static final String ITEMS_PER_PAGE = "" + 5;

    /**
     * Named query identifier for "count as admin".
     */
    public static final String QUERY_COUNT_AS_ADMIN = "Project.QUERY_COUNT_AS_ADMIN";

    /**
     * Named query identifier for "count as project manager".
     */
    public static final String QUERY_COUNT_AS_PROJECT_MANAGER = "Project.QUERY_COUNT_AS_PROJECT_MANAGER";

    /**
     * Named query identifier for "count as user".
     */
    public static final String QUERY_COUNT_AS_USER = "Project.QUERY_COUNT_AS_USER";

    /**
     * Named query identifier for "find for admin".
     */
    public static final String QUERY_FIND_FOR_ADMIN = "Project.QUERY_FIND_FOR_ADMIN";

    /**
     * Named query identifier for "find projects by user".
     */
    public static final String QUERY_FIND_PROJECTS_FOR_USER = "Project.QUERY_FIND_PROJECTS_FOR_USER";

    /**
     * Named query identifier for "find projects by project manager".
     */
    public static final String QUERY_FIND_PROJECTS_FOR_PROJECT_MANAGER = "Project.QUERY_FIND_PROJECTS_FOR_PROJECT_MANAGER";

    /**
     * Named query identifier for "find project to delete"
     */
    public static final String QUERY_FIND_PROJECT_TO_DELETE = "Project.QUERY_FIND_PROJECT_TO_DELETE";

    /**
     * Named query identifier for "find project to add user"
     */
    public static final String QUERY_FIND_PROJECT_TO_ADD_USER = "Project.QUERY_FIND_PROJECT_TO_ADD_USER";

    /**
     * Named query identifier for "find all project names"
     */
    public static final String QUERY_FIND_ALL_PROJECT_NAMES = "Project.QUERY_FIND_ALL_PROJECT_NAMES";

    /**
     * Query parameter constant for the attribute "user".
     */
    public static final String PARAM_USER = "user";

    public static enum TokenizationLang {
        Whitespace, Characterwise, Spanish, English, German, French;
    }

    @JsonView({ View.Projects.class,
                View.ProjectsForUser.class,
                View.Documents.class,
                View.Schemes.class })
    @Column(name = "Name", unique = true)
    private String name;

    @NotNull
	@JsonView({ View.Projects.class, View.ProjectsForUser.class })
    @Enumerated(EnumType.STRING)
    private TokenizationLang tokenizationLang;

    @JsonView({ View.Projects.class, View.ProjectsForUser.class })
    @OneToMany(mappedBy = "project",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },
                fetch = FetchType.LAZY)
    private Set<Document> documents = new HashSet<>();

    @JsonView({ View.Projects.class, View.ProjectsForUser.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinTable(
        name="PROJECTS_MANAGER",
        joinColumns={@JoinColumn(name="PROJECT_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="MANAGER_ID", referencedColumnName="id")})
    private Set<Users> projectManager = new HashSet<>();

    @JsonView({ View.Projects.class })
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch = FetchType.LAZY)
    @JoinTable(
        name="PROJECTS_WATCHINGUSERS",
        joinColumns={@JoinColumn(name="PROJECT_ID", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="WATCHINGUSER_ID", referencedColumnName="id")})
    private Set<Users> watchingUsers = new HashSet<>();

    @JsonView({ View.Projects.class })
    @ManyToMany(mappedBy = "projects",
                cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    private Set<Users> users = new HashSet<>();

    @JsonView({ View.Projects.class })
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE },
                fetch = FetchType.LAZY)
    @JoinColumn(name="Scheme", nullable = false)
    private Scheme scheme;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TokenizationLang getTokenizationLang() {
        return tokenizationLang;
    }

    public void setTokenizationLang(TokenizationLang tokenizationLang) {
        this.tokenizationLang = tokenizationLang;
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

    public void removeUsers(Users users) {
        this.users.remove(users);
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

    public Set<Users> getWatchingUsers() {
        return watchingUsers;
    }

    public void setWatchingUsers(Set<Users> watchingUsers) {
        this.watchingUsers = watchingUsers;
    }

    public void addWatchingUsers(Users user) {
        this.watchingUsers.add(user);
    }

    public void removeWatchingUser(Users user) {
        this.watchingUsers.remove(user);
    }

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
    }

}
