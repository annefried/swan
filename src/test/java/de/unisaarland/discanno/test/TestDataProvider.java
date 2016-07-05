/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.test;

import de.unisaarland.discanno.Utility;
import de.unisaarland.discanno.entities.Annotation;
import de.unisaarland.discanno.entities.Document;
import de.unisaarland.discanno.entities.Label;
import de.unisaarland.discanno.entities.LabelSet;
import de.unisaarland.discanno.entities.LinkLabel;
import de.unisaarland.discanno.entities.LinkSet;
import de.unisaarland.discanno.entities.Project;
import de.unisaarland.discanno.entities.Scheme;
import de.unisaarland.discanno.entities.SpanType;
import de.unisaarland.discanno.entities.Users;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

/**
 *
 * @author Timo Guehring
 */
public class TestDataProvider {
    
    public static final String TEXT_1 = "The Iraqi government has agreed to let U.S. Rep. Tony Hall visit the" + "\n" +
        "country next week to assess a humanitarian crisis that has festered" + "\n" +
        "since the Gulf War of 1990, Hall's office said Monday." + "\n" +
        "The Dayton Democrat, who has traveled to other crisis points including" + "\n" +
        "Sierra Leone and North Korea, will spend three days visiting hospitals" + "\n" +
        "and other facilities to seek understanding why aid has been ineffective" + "\n" +
        "in stemming malnourishment and other medical problems." + "\n" +
        "Iraq has been under economic sanctions since the war ended, which some" + "\n" +
        "say have thwarted the country's ability to recover from the devastation" + "\n" +
        "of the bombing campaign." + "\n" +
        "The Persian Gulf War destroyed much of the country's medical " + "\n" +
        "infrastructure, according to a report by the World Health Organization." + "\n" +
        "In 1996 the WHO found that much of the population existed in a state of" + "\n" +
        "``semi starvation.''" + "\n" +
        "Hall will be only the second member of Congress to travel in Iraq since" + "\n" +
        "the war, according to Hall's office. The last visitor was then-U.S. Rep." + "\n" +
        "Bill Richardson of New Mexico, who went to help a pair of U.S. oilmen in" + "\n" +
        "diplomatic trouble." + "\n" +
        "Hall flies to Amman, Jordan, on Friday, where he'll spend the night" + "\n" +
        "before driving to Iraq. Flights are not permitted into Iraq. Hall is to" + "\n" +
        "return to Washington on April 22." + "\n" +
        "Story Filed By Cox Newspapers";
    
    public static final String TEXT_2 = "Geosesarma ist eine Gattung der Krabben aus der Familie der Sesarmidae.\n"
                + "Sie leben in Südostasien meist in der Nähe von Flüssen und Seen, halten sich\n"
                + "aber vorwiegend an Land auf. Einige Arten werden wegen ihrer auffälligen Färbung \n"
                + "als Vampirkrabben in alle Welt exportiert und können wegen ihrer geringen Größe \n"
                + "auch in kleineren Aquaterrarien gehalten werden.";
    
    private static List<Pair> SECTIONS_1 = new ArrayList<>();
    private static List<Pair> SECTIONS_2 = new ArrayList<>();
    
    static {
        SECTIONS_1 = getSections(TEXT_1);
        SECTIONS_2 = getSections(TEXT_2);
    }
    
    private static class Pair {
        
        public int start;
        public int end;
        public String text;
        
        Pair(int startn, int endn, String textn) {
            start = startn;
            end = endn;
            text = textn;
        }
        
    }
    
    private static List<Pair> getSections(String text) {
        
        List<Pair> listSections = new ArrayList<>();
        
        Scanner scanner = new Scanner(text);

        long i = 0;
        while (scanner.hasNext()) {
            String s = scanner.next();
            if (i % 3 == 0) {
                int start = text.indexOf(s, (int) i);
                
                Pair p = new Pair(start, 
                                    start + s.length(), 
                                    s);
                
                listSections.add(p);
            }
            i++;
        }
        
        return listSections;
    }
    
    public static SpanType getTargetType1() {
        SpanType tt = new SpanType();
        tt.setName("verb");
        return tt;
    }
    
    public static SpanType getTargetType2() {
        SpanType tt = new SpanType();
        tt.setName("passage");
        return tt;
    }
    
    public static SpanType getTargetType3() {
        SpanType tt = new SpanType();
        tt.setName("nomen");
        return tt;
    }
    
    public static Label getLabel1() {
        Label label1 = new Label();
        label1.setName("STATE");
        return label1;
    }
    
    public static Label getLabel2() {
        Label label2 = new Label();
        label2.setName("EVENT");
        return label2;
    }
    
    public static Label getLabel3() {
        Label label3 = new Label();
        label3.setName("GENERIC");
        return label3;
    }
    
    public static Label getLabel4() {
        Label label4 = new Label();
        label4.setName("OTHER");
        return label4;
    }
    
    public static LinkLabel getLinkLabel1() {
        LinkLabel linkLabel1 = new LinkLabel();
        linkLabel1.setName("before");
        return linkLabel1;
    }
    
    public static LabelSet getLabelSet1() {
        
        // -----------1
        List<Label> listLabel1 = new ArrayList();
        listLabel1.add(getLabel1());
        listLabel1.add(getLabel2());
        listLabel1.add(getLabel3());
        listLabel1.add(getLabel4());
        
        LabelSet labelSet1 = new LabelSet();
        labelSet1.setName("LabelSet1");
        labelSet1.setExclusive(true);
        labelSet1.addAppliesToSpanTypes(getTargetType1());
        labelSet1.addAppliesToSpanTypes(getTargetType2());
        labelSet1.setLabels(listLabel1);
        
        return labelSet1;
    }
    
    public static LabelSet getLabelSet2() {
        
        // -----------2
        Label label5 = new Label();
        Label label6 = new Label();
        Label label7 = new Label();
        Label label8 = new Label();
        Label label9 = new Label();
        Label label10 = new Label();
        
        label5.setName("NARRATIVE");
        label6.setName("REPORT");
        label7.setName("INFORMATION");
        label8.setName("DESCRIPTION");
        label9.setName("ARGUMENT/COMMENTARY");
        label10.setName("OTHER");
        
        List<Label> listLabel2 = new ArrayList();
        listLabel2.add(label5);
        listLabel2.add(label6);
        listLabel2.add(label7);
        listLabel2.add(label8);
        listLabel2.add(label9);
        listLabel2.add(label10);

        LabelSet labelSet2 = new LabelSet();
        labelSet2.setName("LabelSet2");
        labelSet2.setExclusive(true);
        labelSet2.addAppliesToSpanTypes(getTargetType2());
        labelSet2.setLabels(listLabel2);
        
        return labelSet2;
    }
    
    public static LabelSet getLabelSet3() {
        
        // -----------3
        Label label11 = new Label();
        Label label12 = new Label();
        Label label13 = new Label();
        Label label14 = new Label();
        
        label11.setName("Actual");
        label12.setName("Modalized");
        label13.setName("Negated");
        label14.setName("OTHER");
        
        List<Label> listLabel3 = new ArrayList();
        listLabel3.add(label11);
        listLabel3.add(label12);
        listLabel3.add(label13);
        listLabel3.add(label14);

        LabelSet labelSet3 = new LabelSet();
        labelSet3.setName("LabelSet3");
        labelSet3.setExclusive(false);
        labelSet3.addAppliesToSpanTypes(getTargetType1());
        labelSet3.setLabels(listLabel3);
        
        return labelSet3;
    }
    
    public static LinkSet getLinkSet1() {
        
        // -----------4
        LinkLabel linkLabel2 = new LinkLabel();
        LinkLabel linkLabel3 = new LinkLabel();
        
        linkLabel2.setName("after");
        linkLabel3.setName("overlap");
        
        List<LinkLabel> listLinkLabel1 = new ArrayList();
        listLinkLabel1.add(getLinkLabel1());
        listLinkLabel1.add(linkLabel2);
        listLinkLabel1.add(linkLabel3);
        
        LinkSet linkSet = new LinkSet();
        linkSet.setAllowUnlabeledLinks(false);
        linkSet.setStartSpanType(getTargetType1());
        linkSet.setEndSpanType(getTargetType1());
        linkSet.setLinkLabels(listLinkLabel1);
        
        return linkSet;
    }
    
    public static Scheme getScheme1() {
        Scheme scheme = new Scheme();
        scheme.setName("Scheme1");
        scheme.addLabelSets(getLabelSet1());
        scheme.addLabelSets(getLabelSet2());
        scheme.addLabelSets(getLabelSet3());
        scheme.addLinkSet(getLinkSet1());
        scheme.addSpanTypes(getTargetType1());
        scheme.addSpanTypes(getTargetType2());
        scheme.addSpanTypes(getTargetType3());

        return scheme;
    }
    
    public static Scheme getSchemeWithNoTargetTypes() {
        Scheme scheme = new Scheme();
        scheme.setName("Broken");
        scheme.addLabelSets(getLabelSet1());
        scheme.addLinkSet(getLinkSet1());
        
        return scheme;
    }
    
    public static Document getDocument1() {
        Document doc = new Document();
        
        doc.setName("Politics1");
        doc.setText(TEXT_1);
        
        return doc;
    }
    
    public static Document getDocument2() {
        Document doc = new Document();
        
        doc.setName("Vampirkrabbe");
        doc.setText(TEXT_2);
        
        return doc;
    }
    
    public static Project getProject1() {
        Project project = new Project();
        project.setName("Project1");
        project.setScheme(getScheme1());
        
        return project;
    }
    
    public static Users getAdmin() {
        // ADMIN USER
        Users user = new Users();
        user.setPrename("John");
        user.setLastname("Locke"); // from Lost
        user.setCreateDate(new Timestamp(new Date().getTime()));
        user.setPassword(Utility.hashPassword("secret"));
        user.setRole(Users.RoleType.admin);
        user.setEmail("admin@web.de");
        return user;
    }
    
    public static Users getUser1() {
        Users user = new Users();
        user.setPrename("Naruto");
        user.setLastname("Uzumaki");
        user.setPassword(Utility.hashPassword("secret"));
        user.setRole(Users.RoleType.annotator);
        user.setEmail("naruto.uzumaki@webanne.de");
        user.setCreateDate(Timestamp.valueOf("2015-01-28 23:10:10"));
        return user;
    }
    
    public static Annotation getAnnotation1() {
        
        Annotation anno = new Annotation();
        int idx = 0;
        
        anno.setSpanType(getTargetType1());
        anno.setStart(SECTIONS_1.get(idx).start);
        anno.setEnd(SECTIONS_1.get(idx).end);
        anno.setText(SECTIONS_1.get(idx).text);
        anno.setNotSure(false);
        
        return anno;
    }
    
    public static Annotation getAnnotation2() {
        
        Annotation anno = new Annotation();
        int idx = 4;
        
        anno.setSpanType(getTargetType2());
        anno.setStart(SECTIONS_1.get(idx).start);
        anno.setEnd(SECTIONS_1.get(idx).end);
        anno.setText(SECTIONS_1.get(idx).text);
        anno.setNotSure(true);
        
        return anno;
    }
    
    public static List<Annotation> getAnnotations() {
        
        List<Annotation> annotations = new ArrayList<>();
        
        {
            int idx = 5;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 6;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType2());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 20;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType2());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 28;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType2());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 42;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType3());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 43;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 67;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 69;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 70;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        {
            int idx = 72;
            Annotation anno = new Annotation();
            anno.setSpanType(getTargetType1());
            anno.setStart(SECTIONS_1.get(idx).start);
            anno.setEnd(SECTIONS_1.get(idx).end);
            anno.setText(SECTIONS_1.get(idx).text);
            anno.setNotSure(false);
            annotations.add(anno);
        }
        
        return annotations;
    }
    
}
