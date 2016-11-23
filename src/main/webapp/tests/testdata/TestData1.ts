/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var user1: User = new User(0, "Wild", "Child1", "wild.child1@gmail.com", "admin");
var user2: User = new User(1, "Wild", "Child2", "wild.child2@gmail.com", "admin");
var user3: User = new User(3, "Wild", "Child3", "wild.child3@gmail.com", "admin");

var users: Array<User> = [user1, user2, user3];

var states1: Array<State> = [new State(0, true, 1463320311345, user1),
                                new State(1, true, 1463320311346, user3),
                                new State(2, true, 1463320311347, user2)];

var states2: Array<State> = [new State(3, false, 1463320311345, user1),
                                new State(4, true, 1463320311346, user2),
                                new State(5, false, 1463320311347, user3)];

var states3: Array<State> = [new State(6, false, 1463320311345, user3),
                                new State(7, true, 1463320311348, user2),
                                new State(8, true, 1463320311343, user1)];

var documents: Array<Document> = [new Document(1, "Doc1", states1),
                                    new Document(5, "John Lock", states2),
                                    new Document(169, "Greek History", states3)];

// Schemes
var testVisElements: Array<VisElement> = [new VisElement("hidden", "timeline"), new VisElement("opened", "graph")];
this.testVisElements = testVisElements;
var testLabels: Array<Label> = [new Label(1, "State"), new Label(2, "Event"), new Label(3, "Ongoing Event"),
                            new Label(4, "Habitual"), new Label(5, "Generic Habitual"), new Label(6, "TimeExpression"),
                            new Label(7, "Generic States")];
this.testLabels = testLabels;
var testLinkLabels: Array<LinkLabel> = [new LinkLabel("after", []), new LinkLabel("before", []),
                                    new LinkLabel("overlap-undirected", []), new LinkLabel("overlap-includes", []),
                                    new LinkLabel("sequential", []), new LinkLabel("overlap-directed", [])];
this.testLinkLabels = testLinkLabels;
var testLabelSets: Array<LabelSet> = [new LabelSet(1, "Type", false, [new SpanType("Situation")], testLabels)];
this.testLabelSets = testLabelSets;
var testLinkTypes: Array<LinkType> = [new LinkType("TLink", new SpanType("Situation"), new SpanType("Situation"), testLinkLabels)];
this.testLinkTypes = testLinkTypes;

var testScheme: Scheme = new Scheme(1, "TemporalRelations_v1", testVisElements, [new SpanType("Situation")], testLabelSets, testLinkTypes);
this.testScheme = testScheme;

// Project
var testProject: Project = new Project(1, "Project1", testScheme, users, documents);
this.testProject = testProject;
