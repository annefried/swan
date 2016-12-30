/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var user1 = new User(0, "Wild", "Child1", "wild.child1@gmail.com", "admin");
var user2 = new User(1, "Wild", "Child2", "wild.child2@gmail.com", "admin");
var user3 = new User(3, "Wild", "Child3", "wild.child3@gmail.com", "admin");
var users = [user1, user2, user3];
var states1 = [new State(0, true, 1463320311345, user1),
    new State(1, true, 1463320311346, user3),
    new State(2, true, 1463320311347, user2)];
var states2 = [new State(3, false, 1463320311345, user1),
    new State(4, true, 1463320311346, user2),
    new State(5, false, 1463320311347, user3)];
var states3 = [new State(6, false, 1463320311345, user3),
    new State(7, true, 1463320311348, user2),
    new State(8, true, 1463320311343, user1)];
var documents = [new Document(1, "Doc1", states1),
    new Document(5, "John Lock", states2),
    new Document(169, "Greek History", states3)];
// Schemes
var testVisElements = [new VisElement("hidden", "timeline"), new VisElement("opened", "graph")];
this.testVisElements = testVisElements;
var testLabels = [new Label(1, "State"), new Label(2, "Event"), new Label(3, "Ongoing Event"),
    new Label(4, "Habitual"), new Label(5, "Generic Habitual"), new Label(6, "TimeExpression"),
    new Label(7, "Generic States")];
this.testLabels = testLabels;
var testLinkLabels = [new LinkLabel("after", []), new LinkLabel("before", []),
    new LinkLabel("overlap-undirected", []), new LinkLabel("overlap-includes", []),
    new LinkLabel("sequential", []), new LinkLabel("overlap-directed", [])];
this.testLinkLabels = testLinkLabels;
var testLabelSets = [new LabelSet(1, "Type", false, [new SpanType("Situation")], testLabels)];
this.testLabelSets = testLabelSets;
var testLinkTypes = [new LinkType("TLink", new SpanType("Situation"), new SpanType("Situation"), testLinkLabels)];
this.testLinkTypes = testLinkTypes;
var testScheme = new Scheme(1, "TemporalRelations_v1", testVisElements, [new SpanType("Situation")], testLabelSets, testLinkTypes);
this.testScheme = testScheme;
// Project
var testProject = new Project(1, "Project1", testScheme, users, documents);
this.testProject = testProject;
//# sourceMappingURL=TestData1.js.map