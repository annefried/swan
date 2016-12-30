/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.business;

import de.unisaarland.swan.tokenization.model.Line;
import de.unisaarland.swan.tokenization.TokenizationUtil;
import de.unisaarland.swan.Utility;
import de.unisaarland.swan.dao.*;
import de.unisaarland.swan.email.EmailProvider;
import de.unisaarland.swan.entities.*;
import edu.stanford.nlp.ling.CoreLabel;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import javax.ejb.CreateException;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionRolledbackLocalException;
import javax.persistence.NoResultException;
import javax.ws.rs.core.Response;

/**
 * This service provides all business logic.
 *
 * @author Timo Guehring
 */
@Stateless
public class Service {
    
    // Determines which kind of user can create another user with the allowed role
    private static EnumMap<Users.RoleType, List<Users.RoleType>>
            userPermissionMap = new EnumMap<>(Users.RoleType.class);
    
    static {
        userPermissionMap.put(Users.RoleType.admin,
                Arrays.asList(Users.RoleType.admin, Users.RoleType.projectmanager, Users.RoleType.annotator));
        userPermissionMap.put(Users.RoleType.projectmanager,
                Arrays.asList(Users.RoleType.annotator));
    }
    
    @EJB
    ProjectDAO projectDAO;
    
    @EJB
    AnnotationDAO annotationDAO;
    
    @EJB
    DocumentDAO documentDAO;
    
    @EJB
    LabelDAO labelDAO;
    
    @EJB
    LinkDAO linkDAO;
    
    @EJB
    TimeLoggingDAO timeLoggingDAO;
    
    @EJB
    StateDAO stateDAO;
    
    @EJB
    UsersDAO usersDAO;
    
    @EJB
    SchemeDAO schemeDAO;
    
    @EJB
    LinkLabelDAO linkLabelDAO;
    
    @EJB
    LinkTypeDAO linkTypeDAO;
    
    @EJB
    LabelSetDAO labelSetDAO;
    
    @EJB
    SpanTypeDAO spanTypeDAO;
    
    @EJB
    EmailProvider emailProvider;
    
    /**
     * Creates a new state object and sets given user and document.
     * 
     * @param u User
     * @param d Document
     * @return 
     */
    private State getNewState(Users u, Document d) {
        State state = new State();
        state.setCompleted(false);
        state.setDocument(d);
        state.setUser(u);
        state.setLastEdit(Utility.getCurrentTime());
        return state;
    }
    
    /**
     * Updates the lastEdit field of state in a document.
     * 
     * @param d Document
     * @param u User
     */
    private void updateDocument(Document d, Users u) {
        for (State s : d.getStates()) {
            if (s.getUser().getId().equals(u.getId())) {
                s.setLastEdit(Utility.getCurrentTime());
                stateDAO.merge(s);
                return;
            }
        }
    }

    /**
     * Tokenizes the given document and returns them.
     * 
     * @param docId
     * @return 
     */
    public List<Line> getTokensByDocId(Long docId) {
        
        Document doc = (Document) documentDAO.find(docId, true);
        String lang = doc.getProject().getTokenizationLang().toString();
        List<Line> lines = TokenizationUtil.tokenize(doc.getText(), lang);
        
        return lines;
    }
    
    public Response edit(Annotation entity) throws CreateException {
        try {
            Annotation annoOrig = annotationDAO.find(entity.getId(), false);
            annoOrig.setStart(entity.getStart());
            annoOrig.setEnd(entity.getEnd());
            annoOrig.setText(entity.getText());
            return annotationDAO.merge(annoOrig);
        } catch (NullPointerException | NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    ///////////////////////////////////////////////
    //  PROCESS
    //
    //  The process methods lookup existing entities
    //  and replace the looked up instance to avoid
    //  duplicate key errors while persisting
    //  entities with the same key and values but
    //  different instances.
    ///////////////////////////////////////////////
    
    public void process(Annotation entity) throws CreateException {
        
        try {
            Users user = (Users) usersDAO.find(entity.getUser().getId(), false);
            entity.setUser(user);

            Document doc = (Document) documentDAO.find(entity.getDocument().getId(), false);
            entity.setDocument(doc);
            updateDocument(doc, user);

            SpanType spanType = (SpanType) spanTypeDAO.find(entity.getSpanType().getId(), false);
            entity.setSpanType(spanType);

            Set<Label> labels = new HashSet<>();
            for (Label l : entity.getLabels()) {
                Label newLabel = (Label) labelDAO.find(l.getId(), false);
                labels.add(newLabel);
            }
            entity.setLabels(labels);

        } catch (NullPointerException | NoResultException e) {
            throw new CreateException(e.getMessage());
        }
        
    }
    
    public void process(Set<Annotation> annotations) throws CreateException {
        for (Annotation a : annotations)
            process(a);
    }

    public void process(Project entity) throws CreateException {
        try {
            Set<Document> docSet = new HashSet<>();
            for (Document d : entity.getDocuments()) {
                Document doc = (Document) documentDAO.find(d.getId(), false);
                docSet.add(doc);
            }
            entity.setDocuments(docSet);

            Set<Users> userSet = new HashSet<>();
            for (Users u : entity.getUsers()) {
                Users user = (Users) usersDAO.find(u.getId(), false);
                userSet.add(user);
            }
            entity.setUsers(userSet);

            Set<Users> projectManagerSet = new HashSet<>();
            for (Users u : entity.getProjectManager()) {
                Users user = (Users) usersDAO.find(u.getId(), false);
                projectManagerSet.add(user);
            }
            entity.setProjectManager(projectManagerSet);

            Scheme scheme = (Scheme) schemeDAO.find(entity.getScheme().getId(), false);
            entity.setScheme(scheme);
            scheme.addProjects(entity);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }

    public void process(Scheme entity) throws CreateException {
        
        try {
            if (entity.getCreator() != null
                    && entity.getCreator().getId() != null) {
                Users user = usersDAO.find(entity.getCreator().getId(), true);
                entity.setCreator(user);
            }

            Set<Project> projects = new HashSet<>();
            for (Project p : entity.getProjects()) {
                Project proj = (Project) projectDAO.find(p.getId(), false);
                projects.add(proj);
            }
            entity.setProjects(projects);

            Map<String, SpanType> spanTypeMap = new HashMap<>();
            List<SpanType> spanTypes = new ArrayList<>();
            for (SpanType t : entity.getSpanTypes()) {
                spanTypes.add(t);
                spanTypeMap.put(t.getName(), t);
            }

            if (spanTypes.isEmpty()) {
                throw new CreateException("Service: No span types declared.");
            }

            entity.setSpanTypes(spanTypes);

            Map<String, LabelSet> labelSetMap = new HashMap<>();
            Map<String, Map<String, Label>> labelSetLabelMap = new HashMap<>();

            List<LabelSet> labelSets = new ArrayList<>();
            for (LabelSet ls : entity.getLabelSets()) {
                labelSets.add(ls);
                labelSetMap.put(ls.getName(), ls);
                labelSetLabelMap.put(ls.getName(), new HashMap<String, Label>());

                List<SpanType> spanTypesLs = new ArrayList<>();
                for (SpanType t : ls.getAppliesToSpanTypes()) {
                    spanTypesLs.add(spanTypeMap.get(t.getName()));
                    t.addLabelSets(ls);
                }
                ls.setAppliesToSpanTypes(spanTypesLs);

                for (Label l : ls.getLabels()) {
                    labelSetLabelMap.get(ls.getName()).put(l.getName(), l);
                    l.setLabelSet(ls);
                }
            }
            entity.setLabelSets(labelSets);

            Map<String, LinkType> linkTypeMap = new HashMap<>();
            Map<String, Map<String, LinkLabel>> linkTypeLabelMap = new HashMap<>();

            List<LinkType> linkTypes = new ArrayList<>();
            for (LinkType lt : entity.getLinkTypes()) {
                linkTypes.add(lt);
                linkTypeMap.put(lt.getName(), lt);
                linkTypeLabelMap.put(lt.getName(), new HashMap<String, LinkLabel>());

                SpanType st = spanTypeMap.get(lt.getStartSpanType().getName());
                if (st == null) throw new CreateException("Service: start span type null.");
                lt.setStartSpanType(st);

                SpanType et = spanTypeMap.get(lt.getEndSpanType().getName());
                if (et == null) throw new CreateException("Service: end span type null.");
                lt.setEndSpanType(et);
                
                for (LinkLabel ll : lt.getLinkLabels()) {
                    linkTypeLabelMap.get(lt.getName()).put(ll.getName(), ll);
                    ll.setLinkType(lt);
                }
            }

            entity.setLinkTypes(linkTypes);

            ColorScheme colorScheme = entity.getColorScheme();

            List<ColorEntityMatcher> spanTypeColors = new ArrayList<>();
            for (ColorEntityMatcher spanTypeCEM : colorScheme.getSpanTypeColors()) {
                SpanType st = spanTypeMap.get(spanTypeCEM.getEntity().getName());
                spanTypeCEM.setEntity(st);
                spanTypeColors.add(spanTypeCEM);
            }
            colorScheme.setSpanTypeColors(spanTypeColors);

            List<ColorEntityMatcher> labelSetColors = new ArrayList<>();
            for (ColorEntityMatcher labelSetCEM : colorScheme.getLabelSetColors()) {
                LabelSet ls = labelSetMap.get(labelSetCEM.getEntity().getName());
                labelSetCEM.setEntity(ls);
                labelSetColors.add(labelSetCEM);
            }
            colorScheme.setLabelSetColors(labelSetColors);

            List<ColorEntityMatcher> linkTypeColors = new ArrayList<>();
            for (ColorEntityMatcher linkTypeCEM : colorScheme.getLinkTypeColors()) {
                LinkType lt = linkTypeMap.get(linkTypeCEM.getEntity().getName());
                linkTypeCEM.setEntity(lt);
                linkTypeColors.add(linkTypeCEM);
            }
            colorScheme.setLinkTypeColors(linkTypeColors);

            List<ColorEntityMatcher> labelColors = new ArrayList<>();
            for (ColorEntityMatcher labelCEM : colorScheme.getLabelColors()) {
                ColorableBaseEntity cbe = labelCEM.getEntity();
                String nameLabelSet = cbe.getNameParentSet();
                Label l = labelSetLabelMap.get(nameLabelSet).get(cbe.getName());
                labelCEM.setEntity(l);
                labelColors.add(labelCEM);
            }
            colorScheme.setLabelColors(labelColors);

            List<ColorEntityMatcher> linkLabelColors = new ArrayList<>();
            for (ColorEntityMatcher linkLabelCEM : colorScheme.getLinkLabelColors()) {
                String nameLinkType = linkLabelCEM.getEntity().getNameParentSet();
                LinkLabel ll = linkTypeLabelMap.get(nameLinkType).get(linkLabelCEM.getEntity().getName());
                linkLabelCEM.setEntity(ll);
                linkLabelColors.add(linkLabelCEM);
            }
            colorScheme.setLinkLabelColors(linkLabelColors);

            entity.setColorScheme(colorScheme);

        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void process(Document entity) throws CreateException {
        Project project = (Project) projectDAO.find(entity.getProject().getId(), false);
        entity.setProject(project);
        process(entity.getDefaultAnnotations());
    }
    
    // TODO user and doc id handling
    public void process(Link entity) throws CreateException {
        try {
            Users user = (Users) usersDAO.find(entity.getUser().getId(), false);
            entity.setUser(user);

            Document doc = (Document) documentDAO.find(entity.getDocument().getId(), false);
            entity.setDocument(doc);
            updateDocument(doc, user);

            // Annotation 1
            Annotation anno1 = entity.getAnnotation1();
            if (anno1.getId() == null) { // does not exist already
                process(anno1);
            } else {
                anno1 = (Annotation) annotationDAO.find(entity.getAnnotation1().getId(), false);
            }
            entity.setAnnotation1(anno1);

            // Annotation 2
            Annotation anno2 = entity.getAnnotation2();
            if (anno2.getId() == null) { // does not exist already
                process(anno2);
            } else {
                anno2 = (Annotation) annotationDAO.find(entity.getAnnotation2().getId(), true);
            }
            entity.setAnnotation2(anno2);

            Set<LinkLabel> linkLabels = new HashSet<>();
            for (LinkLabel l : entity.getLinkLabels()) {
                LinkLabel newLabel = (LinkLabel) linkLabelDAO.find(l.getId(), false);
                linkLabels.add(newLabel);
            }
            entity.setLinkLabels(linkLabels);

        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void process(Users currUser, Users newUser) throws CreateException {
        
        // Check user roles
        List<Users.RoleType> allowedRoles = userPermissionMap.get(currUser.getRole());
        if (!allowedRoles.contains(newUser.getRole())) {
            throw new CreateException("Service: The requested user role is not allowed.");
        }
        
        Set<Project> proSet = new HashSet<>();
        for (Project p : newUser.getProjects()) {
            Project proj = (Project) projectDAO.find(p.getId(), false);
            proSet.add(proj);
        }
        newUser.setProjects(proSet);
        newUser.setCreateDate(Utility.getCurrentTime());
        newUser.setPassword(
                Utility.hashPassword(
                        newUser.getPassword()));
    }
    
    public void process(TimeLogging entity) throws CreateException {
        try {
            Users user = (Users) usersDAO.find(entity.getUsers().getId(), false);
            entity.setUsers(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }


    ///////////////////////////////////////////////
    //  GET
    ///////////////////////////////////////////////

    public List<Project> getProjectsByUser(Users user, Integer page) {

        List<Project> list = null;

        switch (user.getRole()) {
            case admin:
                list = projectDAO.getProjectsForAdmin(page);
                break;
            case projectmanager:
                list = projectDAO.getProjectsForProjectManagerByUser(user, page);
                break;
            case annotator:
                list = projectDAO.getProjectsForUser(user, page);
                break;
        }

        return list;
    }

    public Long getProjectCountsByUser(final Long userId) {

        Users user = (Users) usersDAO.find(userId, false);

        switch (user.getRole()) {
            case admin:
                return projectDAO.getNumberOfProjectsAsAdmin();
            case projectmanager:
                return projectDAO.getNumberOfProjectsAsProjectManager(user);
            case annotator:
                return projectDAO.getNumberOfProjectsAsUser(user);
            default:
                throw new IllegalStateException();
        }
    }
    
    
    ///////////////////////////////////////////////
    //  CHANGE, SET AND ADD
    //
    //  The change, set and add methods change one
    //  or more values of an entity and return the
    //  instance to be merged.
    ///////////////////////////////////////////////
    
    /**
     * Adds a user to a project and creates the targets/ default annotations
     * for this specific user.
     * 
     * @param projId
     * @param userId
     * @throws CloneNotSupportedException 
     */
    public void addUserToProject(Long projId, Long userId) throws CloneNotSupportedException, CreateException {
        
        try {
            Project proj = (Project) projectDAO.getProjectToAddUser(projId);
            Users user =  (Users) usersDAO.find(userId, false);

            user.getProjects().add(proj);
            proj.addUsers(user);

            for (Document d : proj.getDocuments()) {
                d.addStates(getNewState(user, d));
            }

            projectDAO.merge(proj);

            generateTargets(proj, user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void addProjectManagerToProject(Long projId, Long userId) throws CreateException {
        try {
            Project proj = (Project) projectDAO.find(projId, false);
            Users manager =  (Users) usersDAO.find(userId, false);

            manager.addManagingProjects(proj);
            proj.addProjectManager(manager);

            projectDAO.merge(proj);
            usersDAO.merge(manager);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void addWatchingUserToProject(Long projId, Long userId) throws CreateException {
        try {
            Project proj = (Project) projectDAO.find(projId, false);
            Users watchingUser =  (Users) usersDAO.find(userId, false);

            watchingUser.addWatchingProjects(proj);
            proj.addWatchingUsers(watchingUser);

            projectDAO.merge(proj);
            usersDAO.merge(watchingUser);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    /**
     * TODO: There is no real control mechanism that there is not a wrong
     * Label added to the annotation.
     * 
     * @param annoId
     * @param label
     * @return  
     * @throws javax.ejb.CreateException
     */
    public Annotation addLabelToAnnotation(Long annoId, Label label) throws CreateException {

        try {
            Annotation anno = (Annotation) annotationDAO.find(annoId, false);
            updateDocument(anno.getDocument(), anno.getUser());

            if (label.getLabelSet() == null) {
                throw new CreateException("Service: Adding Label to Annotation failed");
            }

            Label newLabel = (Label) labelDAO.find(label.getId(), false);
            LabelSet newLabelSet = (LabelSet) labelSetDAO.find(label.getLabelSet().getId(), false);

            // If LabelSet is exclusive check if this LabelSet was added already
            if (newLabelSet.isExclusive()) {
                Iterator<Label> iterator = anno.getLabels().iterator();
                while (iterator.hasNext()) {
                    Label l = iterator.next();

                    if (l.equals(newLabel)) {
                        // The given Label doesn't differ from the current one
                        return anno;
                    }

                    LabelSet ls = l.getLabelSet();
                    if (ls.equals(newLabelSet)) {
                        iterator.remove();

                        anno.addLabel(newLabel);
                        return anno;
                    }
                }
            }

            anno.addLabel(newLabel);
            return anno;

        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
        
    }
    
    public Link addLinkLabelToLink(Long linkId, LinkLabel label) throws CreateException {

        Link link = (Link) linkDAO.find(linkId, false);

        updateDocument(link.getDocument(), link.getUser());
        
        if (label.getLinkType() == null) {
            throw new CreateException("Service: Adding LinkLabel to Link failed.");
        }
        
        try {
            LinkLabel newLabel = (LinkLabel) linkLabelDAO.find(label.getId(), false);
            LinkType newLinkType = (LinkType) linkTypeDAO.find(newLabel.getLinkType().getId(), false);

            Iterator<LinkLabel> iterator = link.getLinkLabels().iterator();
            while (iterator.hasNext()) {
                LinkLabel l = iterator.next();

                if (l.equals(newLabel)) {
                    // The given LinkLabel doesn't differ from the current one
                    return link;
                }

                LinkType lt = l.getLinkType();
                if (lt.equals(newLinkType)) {
                    // current LinkLabel needs to be removed
                    iterator.remove();

                    link.addLabel(newLabel);
                    return link;
                }
            }

            link.addLabel(newLabel);
            return link;

        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
        
    }
    
    private void checkTargets(Document entity) throws CreateException {

        String lang = entity.getProject().getTokenizationLang().toString();
        HashMap<String, HashMap<Integer, CoreLabel>> maps = TokenizationUtil.getTokenMap(entity.getText(), lang);
        HashMap<Integer, CoreLabel> mapStart = maps.get("start");
        HashMap<Integer, CoreLabel> mapEnd = maps.get("end");
        
        // It is expected that the defaultAnnotations/ targets don't have user ids,
        // so set all attributes to null or empty sets except
        for (Annotation a : entity.getDefaultAnnotations()) {
            a.setDocument(entity);
            a.setLabels(new HashSet<Label>());
            a.setNotSure(false);
            a.setUser(null);
            
            if (a.getSpanType() == null) {
                throw new CreateException("Service: No span type specified!");
            } else {
                SpanType tt = (SpanType) spanTypeDAO.getSpanTypeBySchemeAndSpanTypeId(entity.getProject(), a.getSpanType());
                a.setSpanType(tt);
            }
            if (mapStart.get(a.getStart()) == null) {
                throw new CreateException(
                        "Service: start position did not match with tokens (Target: start was " + a.getStart() + ")");
            } else if (mapEnd.get(a.getEnd()) == null) {
                throw new CreateException(
                        "Service: end  position did not match with tokens (Target: end was " + a.getEnd() + ")");
            }
        }
    }
    
    /**
     * Adds a document to a project and creates the new targets/ default annotations
     * for the existing users.
     * 
     * @param entity
     * @return
     * @throws javax.ejb.CreateException
     * @throws CloneNotSupportedException 
     */
    public Document addDocumentToProject(Document entity) throws CreateException, CloneNotSupportedException {
        
        try {
            Project project = (Project) projectDAO.find(entity.getProject().getId(), false);
            entity.setProject(project);
            entity.setStates(new HashSet<State>());

            checkTargets(entity);

            // Add to every Document a new State object initialized with User and
            // Document
            for (Users u : project.getUsers()) {
                State state = getNewState(u, entity);
                entity.addStates(state);
            }

            generateTargets(project, entity);

            project.addDocuments(entity);

            return entity;
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    /**
     * Generates the default annotations for every user and document. Wrapper method.
     * 
     * @param proj
     * @param doc
     * @throws CloneNotSupportedException 
     */
    private void generateTargets(Project proj, Document doc) throws CloneNotSupportedException {
        for (Users u : proj.getUsers()) {
            generateTargets(doc, u);
        }
    }
    
    /**
     * Generates the default annotations for every user and document. Wrapper method.
     * 
     * @param proj
     * @param user
     * @throws CloneNotSupportedException 
     */
    private void generateTargets(Project proj, Users user) throws CloneNotSupportedException {
        for (Document doc : proj.getDocuments()) {
            generateTargets(doc, user);
        }
    }
    
    /**
     * Generates the default annotations for one user and one document.
     * 
     * @param user
     * @param doc
     * @throws CloneNotSupportedException 
     */
    private void generateTargets(Document doc, Users user) throws CloneNotSupportedException {
        for (Annotation a : doc.getDefaultAnnotations()) {
            Annotation newAnno = (Annotation) a.clone();
            newAnno.setUser(user);
            annotationDAO.create(newAnno);
        }
    }
    
    public Annotation changeSpanType(Long annoId, SpanType spanType) throws CreateException {

        try {
            Annotation anno = (Annotation) annotationDAO.find(annoId, false);
            updateDocument(anno.getDocument(), anno.getUser());

            spanType = (SpanType) spanTypeDAO.find(spanType.getId(), false);

            anno.setSpanType(spanType);

            // Delete all links connected to the Annotation
            List<Link> linkList = linkDAO.getAllLinksByAnnoId(annoId);

            for (Link l : linkList) {
                linkDAO.remove(l);
            }

            annotationDAO.merge(anno);

            return anno;
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    /**
     * Sets the state of a document and user to the desired value.
     * 
     * @param docId
     * @param userId
     * @param completed
     * @return a document to merge the updated state object
     */
    public Document markDocumentAsCompletedByDocIdUserId(Long docId, Long userId, boolean completed) throws CreateException {
        try {
            State state = stateDAO.getStateByDocIdUserId(docId, userId, false);
            state.setCompleted(completed);
            state.setLastEdit(Utility.getCurrentTime());
            return state.getDocument();
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public Response resetUserPassword(Users entity) throws CreateException {
        try {
            Users user = usersDAO.find(entity.getId(), false);
            String newPwd = Utility.getRandomString(14);
            String hashedPwd = Utility.hashPassword(newPwd);

            emailProvider.sendPasswordResetNotification(user, newPwd);

            user.setPassword(hashedPwd);
            return usersDAO.merge(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }

    public void reimportProject(InputStream is) throws CreateException {
        try {

        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    ///////////////////////////////////////////////
    //  REMOVE
    ///////////////////////////////////////////////
    
    public void removeProject(final Long projId) throws CreateException {

        Project entity = projectDAO.getProjectToDelete(projId);

        // It is necessary to create a ConcurrentModification safe set
        // because removeDocument() deletes the current document from
        // the document set in project to be properly deleted
        try {
            CopyOnWriteArraySet<Document> set = Utility.convertSet(entity.getDocuments());
            for (Document d : set) {
                removeDocument(d);
            }

            Scheme scheme = entity.getScheme();
            scheme.getProjects().remove(entity);

            schemeDAO.merge(scheme);
            projectDAO.remove(entity);
        } catch (NullPointerException e) {
            throw new CreateException("The project to be deleted does not exist.");
        }
    }
    
    public void removeUserFromProject(Long projId, Long userId) throws CreateException {
        try {
            Project proj = (Project) projectDAO.find(projId, false);
            Users user = (Users) usersDAO.find(userId, false);

            proj.removeUsers(user);
            user.removeProject(proj);

            removeStatesFromProject(proj, user);

            projectDAO.merge(proj);
            usersDAO.merge(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void removeProjectManagerFromProject(Long projId, Long userId) throws CreateException {
        try {
            Project proj = (Project) projectDAO.find(projId, false);
            Users user = (Users) usersDAO.find(userId, false);

            proj.removeProjectManager(user);
            user.removeManagingProjects(proj);

            projectDAO.merge(proj);
            usersDAO.merge(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void removeWatchingUserFromProject(Long projId, Long userId) throws CreateException {
        try {
            Project proj = (Project) projectDAO.find(projId, false);
            Users user = (Users) usersDAO.find(userId, false);

            Utility.removeObjectFromSet(proj.getWatchingUsers(), userId);
            Utility.removeObjectFromSet(user.getWatchingProjects(), projId);

            projectDAO.merge(proj);
            usersDAO.merge(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    public void removeDocument(Document entity) throws CreateException {
        try {
            entity.removeDefaultAnnotations();
            documentDAO.merge(entity);

            linkDAO.removeAllLinksByDocId(entity.getId());
            annotationDAO.removeAllAnnotationsByDocId(entity);
            stateDAO.removeAllStatesByDocId(entity.getId());

            Project project = entity.getProject();

            documentDAO.remove(entity);
            project.removeDocuments(entity);
            projectDAO.merge(project);
        } catch (NoResultException | TransactionRolledbackLocalException e) {
            throw new CreateException(e.getMessage());
        }
    }

    public void removeAnnotation(Annotation entity) throws CreateException {
        try {
            List<Link> listLink = linkDAO.getAllLinksByAnnoId(entity.getId());

            for (Link l : listLink) {
                linkDAO.remove(l);
            }

            annotationDAO.remove(entity);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    /**
     * Removes a label from an annotation.
     * The Label must exist in the annotation otherwise an
     * IllegalArgumentException will be thrown.
     * 
     * @param anno
     * @param label 
     */
    public void removeLabelFromAnnotation(Annotation anno, Label label) throws CreateException {

        Set<Label> labels = anno.getLabels();

        if (!labels.contains(label)) {
            throw new CreateException("Service: Label does not exist in Annotation.");
        }

        anno.removeLabel(label);
        annotationDAO.merge(anno);
        return;
    }
    
    public void removeLabelFromLink(Link link, LinkLabel label) throws CreateException {

        Set<LinkLabel> labels = link.getLinkLabels();

        if (!labels.contains(label)) {
            throw new CreateException("Service: LinkLabel does not exist in Link.");
        }

        link.removeLabel(label);
        linkDAO.merge(link);
        return;
    }

    public void removeUser(Users user) throws CreateException {
        try {
            timeLoggingDAO.removeAllTimeLoggingByUser(user);
            linkDAO.removeAllLinksByUser(user);
            annotationDAO.removeAllAnnotationsByUser(user);
            //stateDAO.removeAllStatesByUser(user); // TODO does not work

            Set<Project> setManagingProjects = user.getManagingProjects();
            for (Project p : setManagingProjects) {
                p.removeProjectManager(user);
                projectDAO.merge(p);
            }

            Set<Project> setWatchingUsers = user.getWatchingProjects();
            for (Project p : setWatchingUsers) {
                p.removeWatchingUser(user);
                projectDAO.merge(p);
            }

            Set<Project> setUsers = user.getProjects();
            for (Project p : setUsers) {
                removeStatesFromProject(p, user);
                p.removeUsers(user);
                projectDAO.merge(user);
            }

            schemeDAO.setCreatorInSchemeNull(user);

            usersDAO.merge(user);
            usersDAO.remove(user);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }
    
    /**
     * Removes a scheme.
     * 
     * @param schemeId
     * @throws CreateException is thrown when the scheme references projects
     */
    public void removeScheme(Long schemeId) throws CreateException {

        try {
            Scheme scheme = (Scheme) schemeDAO.find(schemeId, false);
            Set<Project> projectList = scheme.getProjects();

            if (!projectList.isEmpty()) {
                throw new CreateException("Service: The scheme references projects.");
            }

            schemeDAO.remove(scheme);
        } catch (NoResultException e) {
            throw new CreateException(e.getMessage());
        }
    }

    private void removeStatesFromProject(Project proj, Users user) {
        for (Document d : proj.getDocuments()) {
            State state = null;
            for (State s : d.getStates()) {
                if (s.getUser().equals(user)) {
                    state = s;
                    break;
                }
            }

            stateDAO.remove(state);
            d.removeState(state);
            documentDAO.merge(d);
        }
    }

}
