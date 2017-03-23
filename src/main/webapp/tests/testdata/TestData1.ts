/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

var testUser1: User = new User(0, "Wild", "Child1", "wild.child1@gmail.com", "admin");
var testUser2: User = new User(1, "Wild", "Child2", "wild.child2@gmail.com", "projectmanager");
var testUser3: User = new User(3, "Wild", "Child3", "wild.child3@gmail.com", "annotator");

var testUsers: Array<User> = [testUser1, testUser2, testUser3];

var testStates1: Array<State> = [new State(0, true, 1463320311345, testUser1),
                                new State(1, true, 1463320311346, testUser3),
                                new State(2, true, 1463320311347, testUser2)];

var testStates2: Array<State> = [new State(3, false, 1463320311345, testUser1),
                                new State(4, true, 1463320311346, testUser2),
                                new State(5, false, 1463320311347, testUser3)];

var testStates3: Array<State> = [new State(6, false, 1463320311345, testUser3),
                                new State(7, true, 1463320311348, testUser2),
                                new State(8, true, 1463320311343, testUser1)];

var testDocuments: Array<DocumentEntity> = [new DocumentEntity(1, "Doc1", testStates1),
                                    new DocumentEntity(5, "John Lock", testStates2),
                                    new DocumentEntity(169, "Greek History", testStates3)];

var testDocumentsUser3: Array<DocumentByAnnotator> = [new DocumentByAnnotator(1, "Doc1", true),
                                                    new DocumentByAnnotator(5, "John Lock", false),
                                                    new DocumentByAnnotator(169, "Greek History", false)];

// Schemes
var testSpanType = new SpanType(1, "Situation");

var testVisElements: Array<VisElement> = [new VisElement("hidden", "timeline"), new VisElement("opened", "graph")];
this.testVisElements = testVisElements;
var testLabels: Array<Label> = [new Label(1, "State"), new Label(2, "Event"), new Label(3, "Ongoing Event"),
                            new Label(4, "Habitual"), new Label(5, "Generic Habitual"), new Label(6, "TimeExpression"),
                            new Label(7, "Generic States")];
this.testLabels = testLabels;
var testLinkLabels: Array<LinkLabel> = [new LinkLabel(1, "after", []), new LinkLabel(2, "before", []),
                                    new LinkLabel(3, "overlap-undirected", []), new LinkLabel(4, "overlap-includes", []),
                                    new LinkLabel(5, "sequential", []), new LinkLabel(6, "overlap-directed", [])];
this.testLinkLabels = testLinkLabels;
var testLabelSets: Array<LabelSet> = [new LabelSet(1, "Type", false, [testSpanType], testLabels)];
this.testLabelSets = testLabelSets;
var testLinkTypes: Array<LinkType> = [new LinkType(2, "TLink", testSpanType, testSpanType, testLinkLabels)];
this.testLinkTypes = testLinkTypes;

var testScheme: Scheme = new Scheme(1, "TemporalRelations_v1", testVisElements, [testSpanType], testLabelSets, testLinkTypes);
this.testScheme = testScheme;

// Project
var testProject: Project = new Project(1, "Project1", testScheme, testUsers, testDocuments);
this.testProject = testProject;

// Text
var testTokens1: Array<Token> = [new Token(0, 4, "Line"), new Token(4, 5, " "), new Token(5, 8, "one"), new Token(8, 9, ",")];
var testTokens2: Array<Token> = [new Token(9, 13, "line"), new Token(13, 14, " "), new Token(14, 17, "two"), new Token(17, 18, ".")];
var testLine1: Line = new Line(9, testTokens1);
var testLine2: Line = new Line(9, testTokens2);
var testTokenData: Array<Line> = [testLine1, testLine2];

// Annotation
var testAnnotationEntity: AnnotationEntity = new AnnotationEntity(3, testSpanType, [testLabels[0]], 5, 17, "one,line two", false);
var testAnnotationEntity2: AnnotationEntity = new AnnotationEntity(4, testSpanType, [testLabels[0]], 0, 4, "Line", false);
var testLink: Link = new Link(1, testUser3, testDocuments[0], testAnnotationEntity, testAnnotationEntity2, [testLinkLabels[0]]);

// AnnotationStructures
var testAnnotationSpanType = new AnnotationSpanType(1, "Situation");
var testAnnotationSpanType2 = new AnnotationSpanType(2, "Action");
var testAnnotation: Annotation = new Annotation(null, testAnnotationEntity.id, testAnnotationSpanType);
var testAnnotation2: Annotation = new Annotation(null, testAnnotationEntity2.id, testAnnotationSpanType);

var testTextWord1: TextWord = new TextWord("Line", 0, 4);
var testTextWord2: TextWord = new TextWord("one", 5, 8);
var testTextWord3: TextWord = new TextWord(",", 8, 9);
var testTextWord4: TextWord = new TextWord("line", 9, 13);
var testTextWord5: TextWord = new TextWord(" ", 13, 14);
var testTextWord6: TextWord = new TextWord("two", 14, 17);
testAnnotation.addWord(testTextWord2);
testAnnotation.addWord(testTextWord3);
testAnnotation.addWord(testTextWord4);
testAnnotation.addWord(testTextWord5);
testAnnotation.addWord(testTextWord6);
testAnnotation2.addWord(testTextWord1);

var testAnnotationLabels: Array<AnnotationLabel> = [new AnnotationLabel(1, "State", [], 1), new AnnotationLabel(2, "Event", [], 1), 
    new AnnotationLabel(3, "Ongoing Event", [], 1), new AnnotationLabel(4, "Habitual", [], 1), 
    new AnnotationLabel(5, "Generic Habitual", [], 1), new AnnotationLabel(6, "TimeExpression", [], 1),
    new AnnotationLabel(7, "Generic States",[], 1)];
var testAnnotationLabelSets: Array<AnnotationLabelSet> = [new AnnotationLabelSet(1, "Type", false, testAnnotationLabels)];
testAnnotationSpanType.addSelectableLabel(testAnnotationLabelSets[0]);

var testAnnotationLinkLabels: Array<AnnotationLabel> = [new AnnotationLabel(1, "after", [], 2), new AnnotationLabel(2, "before", [], 2),
    new AnnotationLabel(3, "overlap-undirected", [], 2), new AnnotationLabel(4, "overlap-includes", [], 2),
    new AnnotationLabel(5, "sequential", [], 2), new AnnotationLabel(6, "overlap-directed", [], 2)];
var testAnnotationLinkTypes: Array<AnnotationLabelSet> = [new AnnotationLabelSet(2, "TLink", true, testAnnotationLinkLabels)];
var testLinkAnnotation: AnnotationLink = new AnnotationLink(1, testAnnotation, testAnnotation2, {2: testAnnotationLinkTypes[0]});

