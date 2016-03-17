/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.business;

import de.unisaarland.discanno.tokenization.model.Line;
import de.unisaarland.discanno.tokenization.TokenizationUtil;
import de.unisaarland.discanno.Utility;
import de.unisaarland.discanno.dao.*;
import de.unisaarland.discanno.entities.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import javax.ejb.EJB;
import javax.ejb.Stateless;

/**
 * This service provides all business logic.
 *
 * @author Timo Guehring
 */
@Stateless
public class Service {
    
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
    LinkSetDAO linkSetDAO;
    
    @EJB
    LabelSetDAO labelSetDAO;
    
    @EJB
    TargetTypeDAO targetTypeDAO;
    
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
        List<Line> lines = TokenizationUtil.tokenize(doc.getText());
        
        return lines;
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
    
    public void process(Annotation entity) {
        
        Users user = (Users) usersDAO.find(entity.getUser().getId(), false);
        entity.setUser(user);
        
        Document doc = (Document) documentDAO.find(entity.getDocument().getId(), false);
        entity.setDocument(doc);
        updateDocument(doc, user);
        
        TargetType targetType = (TargetType) targetTypeDAO.find(entity.getTargetType().getTargetType(), false);
        entity.setTargetType(targetType);
        
        for (LabelLabelSetMap m : entity.getLabelMap()) {
            Label newLabel = (Label) labelDAO.find(m.getLabel().getLabelId(), false);
            
            Set<LabelSet> labelSets = new HashSet<>();
            for (LabelSet ls : m.getLabelSets()) {
                LabelSet newLabelSet = (LabelSet) labelSetDAO.find(ls.getId(), false);
                labelSets.add(newLabelSet);
            }
            
            m.setLabel(newLabel);
            m.setLabelSets(labelSets);
        }
        
    }
    
    public void process(Set<Annotation> annotations) {
        for (Annotation a : annotations)
            process(a);
    }

    public void process(Project entity) {
        
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
    }

    public void process(Scheme entity) {

        Set<Project> projects = new HashSet<>();
        for (Project p : entity.getProjects()) {
            Project proj = (Project) projectDAO.find(p.getId(), false);
            projects.add(proj);
        }
        entity.setProjects(projects);
        
        Map<String, TargetType> ttMap = new HashMap<>();
        Set<TargetType> targetTypes = new HashSet<>();
        for (TargetType t : entity.getTargetTypes()) {
            
            TargetType targetType = (TargetType) targetTypeDAO.find(t.getTargetType(), true);
            
            if (targetType == null) {
                targetTypes.add(t);
                ttMap.put(t.getTargetType(), t);
            } else {
                targetTypes.add(targetType);
                ttMap.put(targetType.getTargetType(), targetType);
            }
        }
        
        if (targetTypes.isEmpty()) {
            throw new IllegalArgumentException("Service: No TargetTypes declared");
        }
        
        entity.setTargetTypes(targetTypes);
        
        List<LabelSet> labelSets = new ArrayList<>();
        Map<String, Label> labelMap = new HashMap<>();
        for (LabelSet ls : entity.getLabelSets()) {
            
            if (ls.getId() == null) {
                labelSets.add(ls);
                
                Set<TargetType> targetTypesLs = new HashSet<>();
                for (TargetType t : ls.getAppliesToTargetTypes()) {
                    targetTypesLs.add(ttMap.get(t.getTargetType()));
                    t.addLabelSets(ls);
                }
                ls.setAppliesToTargetTypes(targetTypesLs);
                
                Set<Label> labels = new HashSet<>();
                for (Label l : ls.getLabels()) {
                    
                    Label label = (Label) labelDAO.find(l.getLabelId(), true);
                    Label label2 = labelMap.get(l.getLabelId());
                    
                    if (label2 != null) {
                        labels.add(label2);
                    } else if (label == null) {
                        labels.add(l);
                        labelMap.put(l.getLabelId(), l);
                    } else {
                        labels.add(label);
                    }
                }
                ls.setLabels(labels);
                
                for (Label l : ls.getLabels()) {
                    l.addLabelSet(ls);
                }
                
            } else {
                LabelSet labelSet = (LabelSet) labelSetDAO.find(ls.getId(), true);

                if (labelSet == null) {
                    labelSets.add(ls);
                } else {
                    labelSets.add(labelSet);
                }
            }
            
        }
        entity.setLabelSets(labelSets);

        List<LinkSet> linkSets = new ArrayList<>();
        Map<String, LinkLabel> linkLabelMap = new HashMap<>();
        for (LinkSet ls : entity.getLinkSets()) {
            
            if (ls.getId() == null) {
                linkSets.add(ls);
                
                TargetType st = ttMap.get(ls.getStartType().getTargetType());
                if (st == null) throw new IllegalArgumentException("Service: start type null");
                ls.setStartType(st);
                
                TargetType et = ttMap.get(ls.getEndType().getTargetType());
                if (et == null) throw new IllegalArgumentException("Service: end type null");
                ls.setEndType(et);
                
                Set<LinkLabel> labels = new HashSet<>();
                for (LinkLabel l : ls.getLinkLabels()) {
                    
                    LinkLabel label = (LinkLabel) linkLabelDAO.find(l.getLinkLabel(), true);
                    LinkLabel label2 = linkLabelMap.get(l.getLinkLabel());
                    
                    if (label2 != null) {
                        labels.add(label2);
                    } else if (label == null) {
                        labels.add(l);
                        linkLabelMap.put(l.getLinkLabel(), l);
                    } else {
                        labels.add(label);
                    }
                }
                ls.setLinkLabels(labels);
                
                for (LinkLabel l : ls.getLinkLabels()) {
                    l.addLinkSet(ls);
                }
                
            } else {
                LinkSet linkSet = (LinkSet) linkSetDAO.find(ls.getId(), true);

                if (linkSet == null) {
                    linkSets.add(ls);
                } else {
                    linkSets.add(linkSet);
                }   
            }
            
        }
        
        entity.setLinkSets(linkSets);
    }
    
    public void process(Document entity) {
        Project project = (Project) projectDAO.find(entity.getProject().getId(), false);
        entity.setProject(project);
        process(entity.getDefaultAnnotations());
    }
    
    // TODO user and doc id handling
    public void process(Link entity) {

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
        
        for (LinkLabelLinkSetMap m : entity.getLabelMap()) {
            LinkLabel newLabel = (LinkLabel) linkLabelDAO.find(m.getLabel().getLinkLabel(), false);
            
            Set<LinkSet> linkSets = new HashSet<>();
            for (LinkSet ls : m.getLinkSets()) {
                LinkSet newLinkSet = (LinkSet) linkSetDAO.find(ls.getId(), false);
                linkSets.add(newLinkSet);
            }
            
            m.setLabel(newLabel);
            m.setLinkSets(linkSets);
        }

    }
    
    public void process(TimeLogging entity) {
        Users user = (Users) usersDAO.find(entity.getUsers().getId(), false);
        entity.setUsers(user);
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
    public void addUserToProject(Long projId, Long userId) throws CloneNotSupportedException {
        
        Project proj = (Project) projectDAO.find(projId, false);
        Users user =  (Users) usersDAO.find(userId, false);
        
        user.getProjects().add(proj);
        proj.addUsers(user);
        
        for (Document d : proj.getDocuments()) {
            d.addStates(getNewState(user, d));
        }
        
        projectDAO.merge(proj);
        
        generateTargets(proj, user);
    }
    
    public void addProjectManagerToProject(Long projId, Long userId) {
        
        Project proj = (Project) projectDAO.find(projId, false);

        Users manager =  (Users) usersDAO.find(userId, false);
        
        manager.getManagingProjects().add(proj);
        proj.addProjectManager(manager);
        
        projectDAO.merge(proj);
    }
    
    /**
     * TODO: There is no real control mechanism that there is not a wrong
     * Label added to the annotation.
     * 
     * @param user
     * @param annoId
     * @param label
     * @return  
     * @throws java.lang.CloneNotSupportedException
     */
    public Annotation addLabelToAnnotation(Long annoId, Label label) throws CloneNotSupportedException {

        Annotation anno = (Annotation) annotationDAO.find(annoId, false);
        updateDocument(anno.getDocument(), anno.getUser());
        
        if (label.getLabelSet().size() != 1 || label.getLabelSet().get(0) == null) {
            throw new IllegalArgumentException("Service: Adding Label to Annotation failed");
        }
        
        Label newLabel = (Label) labelDAO.find(label.getLabelId(), false);
        LabelSet newLabelSet = (LabelSet) labelSetDAO.find(label.getLabelSet().get(0).getId(), false);
        
        // If LabelSet is exclusive check if this LabelSet was added already
        if (newLabelSet.isExclusive()) {
            for (LabelLabelSetMap m : anno.getLabelMap()) {
                // Use an iterator because we may have to delete a LabelSet
                Iterator<LabelSet> iterator = m.getLabelSets().iterator();
                while (iterator.hasNext()) {
                    LabelSet ls = iterator.next();
                    
                    if (ls.equals(newLabelSet)) {
                        // If the size of the LabelSets corresponding to the Label
                        // is 1, we can just change the Label
                        if (m.getLabelSets().size() == 1) {
                            m.setLabel(newLabel);
                            return anno;
                        } else {
                            // Check if the new Label is really different from
                            // the current Label
                            if (m.getLabel().equals(newLabel)) {
                                // The given Label doesn't differ from the current one
                                return anno;
                            } else {
                                // We have to delete the current LabelSet because
                                // it is exclusive and add another LabelLabelSetMap
                                // containing the new Label and LabelSet
                                iterator.remove();
                                addNewLabelLabelSetMapToAnnotation(anno, newLabel, newLabelSet);
                                return anno;
                            }
                        }
                        
                    }
                }
            }
            
            addNewLabelLabelSetMapToAnnotation(anno, newLabel, newLabelSet);
            return anno;
        } else {
            
            for (LabelLabelSetMap m : anno.getLabelMap()) {
                if (m.getLabel().equals(newLabel)) {
                    for (LabelSet ls : m.getLabelSets()) {
                        if (ls.equals(newLabelSet)) {
                            // Already exist
                            return anno;
                        }
                    }

                    m.addLabelSets(newLabelSet);
                    return anno;
                }
            }
        
            // Label does not exist and a LabelLabelSetMap object must be created
            // and added to the label
            addNewLabelLabelSetMapToAnnotation(anno, newLabel, newLabelSet);
            return anno;
        }
        
    }
    
    public Link addLinkLabelToLink(Long linkId, LinkLabel label) {

        Link link = (Link) linkDAO.find(linkId, false);
        updateDocument(link.getDocument(), link.getUser());
        
        if (label.getLinkSet().size() != 1 || label.getLinkSet().get(0) == null) {
            throw new IllegalArgumentException("Service: Adding LinkLabel to Link failed");
        }
        
        LinkLabel newLabel = (LinkLabel) linkLabelDAO.find(label.getLinkLabel(), false);
        LinkSet newLinkSet = (LinkSet) linkSetDAO.find(label.getLinkSet().get(0).getId(), false);
            
        for (LinkLabelLinkSetMap m : link.getLabelMap()) {
            // Use an iterator because we may have to delete a LinkSet
            Iterator<LinkSet> iterator = m.getLinkSets().iterator();
            while (iterator.hasNext()) {
                LinkSet ls = iterator.next();

                if (ls.equals(newLinkSet)) {
                    // If the size of the LinkSets corresponding to the LinkLabel
                    // is 1, we can just change the Label
                    if (m.getLinkSets().size() == 1) {
                        m.setLabel(newLabel);
                        return link;
                    } else {
                        // Check if the new LinkLabel is really different from
                        // the current LinkLabel
                        if (m.getLabel().equals(newLabel)) {
                            // The given LinkLabel doesn't differ from the current one
                            return link;
                        } else {
                            // We have to delete the current LinkSet because
                            // it is exclusive and add another LinkLabelLinkSetMap
                            // containing the new LinkLabel and LinkSet
                            iterator.remove();
                            addNewLinkLabelLinkSetMapToLink(link, newLabel, newLinkSet);
                            return link;
                        }
                    }

                }
            }
        }

        // Label does not exist and a LinkLabelLinkSetMap object must be created
        // and added to the label
        addNewLinkLabelLinkSetMapToLink(link, newLabel, newLinkSet);
        return link;
    }
    
    /**
     * Helper method to add a new Label to an Annotation.
     * 
     * @param anno
     * @param Label
     * @param labelSet 
     */
    private void addNewLabelLabelSetMapToAnnotation(Annotation anno, Label Label, LabelSet labelSet) {
        LabelLabelSetMap map = new LabelLabelSetMap();
        map.setLabel(Label);
        map.addLabelSets(labelSet);
        anno.addLabelMap(map);
    }
    
    /**
     * Helper method to add a new LinkLabel to a Link.
     * 
     * @param link
     * @param newLabel
     * @param newLinkSet 
     */
    private void addNewLinkLabelLinkSetMapToLink(Link link, LinkLabel newLabel, LinkSet newLinkSet) {
        LinkLabelLinkSetMap map = new LinkLabelLinkSetMap();
        map.setLabel(newLabel);
        map.addLinkSets(newLinkSet);
        link.addLabelMap(map);
    }
    
    /**
     * Adds a document to a project and creates the new targets/ default annotations
     * for the existing users.
     * 
     * @param entity
     * @return
     * @throws IllegalArgumentException
     * @throws CloneNotSupportedException 
     */
    public Document addDocumentToProject(Document entity) throws IllegalArgumentException, CloneNotSupportedException {
        
        Project project = (Project) projectDAO.find(entity.getProject().getId(), false);
        entity.setProject(project);
        entity.setStates(new HashSet<State>());
        
        // It is expected that the defaultAnnotations/ targets don't have user ids,
        // so set all attributes to null or empty sets except
        // a.setDocument and a.setTargetType
        for (Annotation a : entity.getDefaultAnnotations()) {
            a.setDocument(entity);
            a.setLabelMap(new HashSet<LabelLabelSetMap>());
            a.setNotSure(false);
            a.setUser(null);
            
            if (a.getTargetType() == null) {
                throw new IllegalArgumentException("Service: no targetype specified!");
            } else {
                TargetType tt = (TargetType) targetTypeDAO.find(a.getTargetType().getTargetType(), false);
                a.setTargetType(tt);
            }
        }
        
        // Add to every Document a new State object initialized with User and
        // Document
        for (Users u : project.getUsers()) {
            State state = getNewState(u, entity);
            entity.addStates(state);
        }
        
        generateTargets(project, entity);
        
        project.addDocuments(entity);

        return entity;
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
     * @param proj
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
    
    public Annotation changeTargetType(Long annoId, TargetType targetType) {

        Annotation anno = (Annotation) annotationDAO.find(annoId, false);
        updateDocument(anno.getDocument(), anno.getUser());
        
        targetType = (TargetType) targetTypeDAO.find(targetType.getTargetType(), false);
        
        anno.setTargetType(targetType);
        
        // Delete all links connected to the Annotation
        List<Link> linkList = linkDAO.getAllLinksByAnnoId(annoId);

        for (Link l : linkList) {
            linkDAO.remove(l);
        }
        
        annotationDAO.merge(anno);
        
        return anno;
    }
    
    /**
     * Sets the state of a document and user to the desired value.
     * 
     * @param docId
     * @param userId
     * @param completed
     * @return a document to merge the updated state object
     */
    public Document markDocumentAsCompletedByDocIdUserId(Long docId, Long userId, boolean completed) {
        
        State state = stateDAO.getStateByDocIdUserId(docId, userId, false);
        state.setCompleted(completed);
        state.setLastEdit(Utility.getCurrentTime());
        
        return state.getDocument();
    }
    
    
    ///////////////////////////////////////////////
    //  REMOVE
    ///////////////////////////////////////////////
    
    public void removeProject(Project entity) {

        // It is necessary to create a ConcurrentModification safe set
        // because removeDocument() deletes the current document from
        // the document set in project to be properly deleted
        CopyOnWriteArraySet<Document> set = Utility.convertSet(entity.getDocuments());
        
        for (Document d : set) {
            removeDocument(d);
        }
        
        projectDAO.remove(entity);

    }
    
    public void removeUserFromProject(Long projId, Long userId) {
        Project proj = (Project) projectDAO.find(projId, false);
        Utility.removeObjectFromSet(proj.getUsers(), userId);
        projectDAO.merge(proj);
    }
    
    public void removeProjectManagerFromProject(Long projId, Long userId) {
        Project proj = (Project) projectDAO.find(projId, false);
        Utility.removeObjectFromSet(proj.getProjectManager(), userId);
        projectDAO.merge(proj);
    }
    
    public void removeDocument(Document entity) {
        
        entity.removeDefaultAnnotations();
        documentDAO.merge(entity);
        
        List<Annotation> annos = annotationDAO.getAllAnnotationsByDocId(entity);
        
        for (Annotation a : annos) {
            removeAnnotation(a);
        }
        
        Project project = entity.getProject();
        
        documentDAO.remove(entity);
        project.removeDocuments(entity);
        projectDAO.merge(project);
    }

    public void removeAnnotation(Annotation entity) {
        
        List<Link> listLink = linkDAO.getAllLinksByAnnoId(entity.getId());
        
        for (Link l : listLink) {
            linkDAO.remove(l);
        }
        
        annotationDAO.remove(entity);
    }
    
    /**
     * Removes a label from an annotation.
     * The Label must exist in the annotation otherwise an
     * IllegalArgumentException will be thrown.
     * 
     * @param anno
     * @param label 
     */
    public void removeLabelFromAnnotation(Annotation anno, Label label) {
        
        if (label.getLabelSet().size() != 1) {
            throw new IllegalArgumentException("Service: LabelSet size in Label is not 1");
        }
        
        LabelSet ls = label.getLabelSet().get(0);
        
        for (LabelLabelSetMap map : anno.getLabelMap()) {
            if (map.getLabel().equals(label)
                    && map.getLabelSets().contains(ls)) {
                anno.removeLabel(map, ls);
                annotationDAO.merge(anno);
                return;
            }
        }

        throw new IllegalArgumentException("Service: Label does not exist in Annotation");
    }
    
    public void removeLabelFromLink(Link link, LinkLabel label) {

        if (label.getLinkSet().size() != 1) {
            throw new IllegalArgumentException("Service: LabelSet size in Label is not 1");
        }
        
        LinkSet ls = label.getLinkSet().get(0);
        
        for (LinkLabelLinkSetMap map : link.getLabelMap()) {
            if (map.getLabel().equals(label)
                    && map.getLinkSets().contains(ls)) {
                link.removeLabel(map, ls);
                linkDAO.merge(link);
                return;
            }
        }

        throw new IllegalArgumentException("Service: LinkLabel does not exist in Link");
    }

    public void removeUser(Users user) {
        
        List<TimeLogging> list = timeLoggingDAO.getAllTimeLoggingByUserId(user.getId());
        
        for (TimeLogging t : list) {
            timeLoggingDAO.remove(t);
        }
        
        List<Annotation> listAnno = annotationDAO.getAllAnnotationsByUserId(user);
        
        for (Annotation a : listAnno) {
            removeAnnotation(a);
        }
        
        List<State> listStates = stateDAO.getAllStatesByUserId(user);
        
        for (State s : listStates) {
            stateDAO.remove(s);
        }
        
        Set<Project> listManagingProjects = user.getManagingProjects();
        
        for (Project p : listManagingProjects) {
            p.removeProjectManager(user);
            projectDAO.merge(p);
        }
        
        usersDAO.merge(user);
        usersDAO.remove(user);
    }
    
    /**
     * Removes a scheme.
     * 
     * @param schemeId
     * @throws UnsupportedOperationException is thrown when the scheme references
     *         projects
     */
    public void removeScheme(Long schemeId) throws UnsupportedOperationException {

        Scheme scheme = (Scheme) schemeDAO.find(schemeId, false);
        Set<Project> projectList = scheme.getProjects();
        
        if (!projectList.isEmpty()) {
            throw new UnsupportedOperationException("Service: The scheme references projects");
        }
    
        schemeDAO.remove(scheme);
    }

}
