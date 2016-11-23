/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 * Created by Timo Guehring on 06.11.16.
 */
'use strict';

describe('Test rootController', function () {
    beforeEach(angular.mock.module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('Setup tests', function () {
        var controller, $injector, $scope, $rootScope, $window, $http, $timeout;

        // For asynchronous statements and promises
        var $q, deferred;

        beforeEach(
            inject(
                function(_$controller_, $controller,  _$injector_, _$q_, _$rootScope_, _$window_, _$http_, _$timeout_) {
                    $injector = _$injector_;
                    $q = _$q_;
                    deferred = _$q_.defer();
                    $rootScope = _$rootScope_;
                    $scope = $rootScope.$new();
                    $window = _$window_;
                    $http = _$http_;
                    $timeout = _$timeout_;

                    $window.sessionStorage.role = 'annotator';
                    $window.sessionStorage.isAnnotator = 'true';
                    $scope.isUnprivileged = 'true';
                    $window.sessionStorage.uId = '3';

                    controller = $controller('rootController',
                        {
                            $rootScope: $rootScope,
                            $scope: $scope,
                            $window: $window,
                            $http: $http,
                            $timeout: $timeout
                        });
                }));


        /**
         * Test 'checkResponseStatusCode'
         */

        it('Test checkResponseStatusCode with status code: 403', function () {
            expect($controller).toBeDefined();
            expect($rootScope.alerts.length).toEqual(0);

            spyOn($rootScope, 'redirectToLogin');

            $rootScope.checkResponseStatusCode(403);

            expect($rootScope.alerts.length).toEqual(0);
            expect($rootScope.redirectToLogin).toHaveBeenCalled();
        });

        it('Test checkResponseStatusCode with status code: 400', function () {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(400);

            expect($rootScope.alerts.length).toEqual(1);

            var alert = $rootScope.alerts[0];

            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('This action is not allowed.');
        });

        it('Test checkResponseStatusCode with status code: 500', function () {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(500);

            expect($rootScope.alerts.length).toEqual(1);

            var alert = $rootScope.alerts[0];

            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('No server connection or an internal server error occurred.');
        });

        it('Test checkResponseStatusCode with status code: 600', function () {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(600);

            expect($rootScope.alerts.length).toEqual(0);
        });

        it('Test getUser', function () {
            $window.sessionStorage.prename = 'Max';
            $window.sessionStorage.lastname = 'Mustermann';
            $window.sessionStorage.email = 'max@swan.de';

            $scope.getUser();

            expect($scope.prename).toEqual('Max');
            expect($scope.lastname).toEqual('Mustermann');
            expect($scope.email).toEqual('max@swan.de');
            expect($scope.role).toEqual('annotator');
        });

        it('Test logout', function () {
            $window.sessionStorage.prename = 'Max';
            $window.sessionStorage.lastname = 'Mustermann';
            $window.sessionStorage.email = 'max@swan.de';

            $scope.logout();

            expect($window.sessionStorage.uId).toEqual('null');
            expect($window.sessionStorage.prename).toEqual('null');
            expect($window.sessionStorage.lastname).toEqual('null');
            expect($window.sessionStorage.email).toEqual('null');
            expect($window.sessionStorage.role).toEqual('null');
        });


        /**
         * Test 'loadProjects'
         *
         * TODO: Check promise
         */

        it('Test loadProjects as annotator', function () {

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/project/byuser/';
            var response = { projects: [] };

            $httpBackend
                .when('GET', url + '?page=1&userId=' + $window.sessionStorage.uId)
                .respond(200, response);

            $httpBackend
                .expect('GET', url + '?page=1&userId=' + $window.sessionStorage.uId);

            var httpObj = $rootScope.loadProjects(1);

            expect($httpBackend.flush).not.toThrow();
            expect($rootScope.projects.length).toEqual(0);
        });

        it('Test loadProjects as admin', function () {

            $window.sessionStorage.role = 'admin';

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/project/byuser/';
            var response = { projects: [] };

            $httpBackend
                .when('GET', url + '?page=1&userId=' + $window.sessionStorage.uId)
                .respond(200, response);

            $httpBackend
                .expect('GET', url + '?page=1&userId=' + $window.sessionStorage.uId);

            var httpObj = $rootScope.loadProjects(1);

            expect($httpBackend.flush).not.toThrow();
            expect($rootScope.projects.length).toEqual(0);
        });

        it('Test loadProjectById', function () {

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/project/byId/';
            var response = {project: {id: 1, name: 'project1'}};

            $httpBackend
                .when('GET', url + 1)
                .respond(200, response);

            $httpBackend
                .expect('GET', url + 1);

            var httpObj = $rootScope.loadProjectById(1);

            expect($httpBackend.flush).not.toThrow();
            expect($rootScope.currProj).toBeDefined();
            expect($rootScope.currProj.id).toEqual(1);
            expect($rootScope.currProj.name).toEqual('project1');
        });

        it('Test loadProjectsCount', function () {

            var $httpBackend = $injector.get('$httpBackend');
            const url = "swan/project/count/byuser/" + $window.sessionStorage.uId;
            var response = 2;

            $httpBackend
                .when('GET', url)
                .respond(200, response);

            $httpBackend
                .expect('GET', url);

            var httpObj = $rootScope.loadProjectsCount();

            expect($httpBackend.flush).not.toThrow();
            expect($rootScope.numberOfTotalProjects).toEqual(2);
        });


        /**
         * Test 'buildDocuments'
         */

        describe('buildDocuments with 3 documents', function(){

            it('Test buildDocumentsPrivileged with 3 documents', function () {

                var retVal = $scope.buildDocumentsPrivileged(testProject);
                var resultDocs = retVal.documents;
                var projComplAdmin = retVal.projComplAdmin;

                expect(documents.length).toEqual(3);
                expect(testProject.users.length).toEqual(3);
                expect(testProject.documents.length).toEqual(3);

                expect(resultDocs.length).toEqual(3);

                expect(projComplAdmin.length).toEqual(3);
                expect(projComplAdmin[0]).toEqual(2);
                expect(projComplAdmin[1]).toEqual(3);
                expect(projComplAdmin[2]).toEqual(1);

                //test documents
                var doc0 = resultDocs[0];
                expect(doc0.id).toEqual(1);
                expect(doc0.name).toEqual('Doc1');
                expect(doc0.completed).toEqual(3);
                expect(doc0.lastEdit).toEqual(1463320311347);
                expect(doc0.states.length).toEqual(3);
                expect(doc0.states[0]).toEqual(states1[0]);
                expect(doc0.states[1]).toEqual(states1[2]);
                expect(doc0.states[2]).toEqual(states1[1]);

                var doc1 = resultDocs[1];
                expect(doc1.id).toEqual(169);
                expect(doc1.name).toEqual('Greek History');
                expect(doc1.completed).toEqual(2);
                expect(doc1.lastEdit).toEqual(1463320311348);
                expect(doc1.states.length).toEqual(3);
                expect(doc1.states[0]).toEqual(states3[2]);
                expect(doc1.states[1]).toEqual(states3[1]);
                expect(doc1.states[2]).toEqual(states3[0]);

                var doc2 = resultDocs[2];
                expect(doc2.id).toEqual(5);
                expect(doc2.name).toEqual('John Lock');
                expect(doc2.completed).toEqual(1);
                expect(doc2.lastEdit).toEqual(1463320311347);
                expect(doc2.states.length).toEqual(3);
                expect(doc2.states[0]).toEqual(states2[0]);
                expect(doc2.states[1]).toEqual(states2[1]);
                expect(doc2.states[2]).toEqual(states2[2]);

            });

            it('Test buildDocumentsUnprivileged with 3 documents', function () {

                var retVal = $scope.buildDocumentsUnprivileged(testProject);
                var resultDocs = retVal.documents;
                var lastEditedDocument = retVal.lastEditedDocument;
                var projComplUser = retVal.projComplUser;

                expect(documents.length).toEqual(3);
                expect(testProject.users.length).toEqual(3);
                expect(testProject.documents.length).toEqual(3);

                expect(resultDocs.length).toEqual(3);
                expect(lastEditedDocument.id).toEqual(5);
                expect(projComplUser).toEqual(1);

                //test documents
                var doc0 = resultDocs[0];
                expect(doc0.id).toEqual(1);
                expect(doc0.name).toEqual('Doc1');
                expect(doc0.completed).toBeTruthy();
                expect(doc0.lastEdit).toEqual(1463320311346);
                expect(doc0.states.length).toEqual(1);
                expect(doc0.states[0]).toEqual(states1[1]);

                var doc1 = resultDocs[1];
                expect(doc1.id).toEqual(169);
                expect(doc1.name).toEqual('Greek History');
                expect(doc1.completed).toBeFalsy();
                expect(doc1.lastEdit).toEqual(1463320311345);
                expect(doc1.states.length).toEqual(1);
                expect(doc1.states[0]).toEqual(states3[0]);

                var doc2 = resultDocs[2];
                expect(doc2.id).toEqual(5);
                expect(doc2.name).toEqual('John Lock');
                expect(doc2.completed).toBeFalsy();
                expect(doc2.lastEdit).toEqual(1463320311347);
                expect(doc2.states.length).toEqual(1);
                expect(doc2.states[0]).toEqual(states2[2]);

            });
        });

        it('Test buildDocumentsPrivileged with empty documents', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var proj = {
                users: users,
                documents: []
            };

            var retVal = $scope.buildDocumentsPrivileged(proj);
            var documents = retVal.documents;
            var projComplAdmin = retVal.projComplAdmin;

            expect(documents.length).toEqual(0);
            expect(proj.users.length).toEqual(3);
            expect(proj.documents.length).toEqual(0);

            expect(projComplAdmin.length).toEqual(3);
            expect(projComplAdmin[0]).toEqual(0);
            expect(projComplAdmin[1]).toEqual(0);
            expect(projComplAdmin[2]).toEqual(0);
        });

        it('Test buildDocumentsUnprivileged with empty documents', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var proj = {
                users: users,
                documents: []
            };

            var retVal = $scope.buildDocumentsUnprivileged(proj);
            var documents = retVal.documents;
            var lastEditedDocument = retVal.lastEditedDocument;
            var projComplUser = retVal.projComplUser;

            expect(documents.length).toEqual(0);
            expect(proj.users.length).toEqual(3);
            expect(proj.documents.length).toEqual(0);
            expect(lastEditedDocument).toEqual(null);
            expect(projComplUser).toEqual(0);
        });

        it('Test buildDocumentsPrivileged with different states and users length', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var states = [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4}
            ];
            var proj = {
                users: users,
                documents: [
                    {
                        states: states
                    }
                ]
            };

            expect(function () {
                $scope.buildDocumentsPrivileged(proj);
            }).toThrow("rootController: States and users length differs");
        });

        it('Test buildDocumentsUnprivileged with no state matching user id', function () {
            var users: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(1, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];

            var states: Array<State> = [
                new State(0, false, 1463320311345, users[0]),
                new State(1, true, 1463320311348, users[1]),
                new State(2, false, 1463320311343, users[1])
            ];

            var documents = [new Document(0, 'TestDoc', states)];
            var proj = new Project(431, 'TestProj', null, users, documents, [], []);

            expect(function () {
                $scope.buildDocumentsUnprivileged(proj);
            }).toThrow("rootController: No corresponding state object existing");
        });

        it('Test buildDocuments with wrong assigned user', function () {
            var users: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(1, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];
            var unknownUser:User = new User(5, "", "", "", "annotator");

            var states1: Array<State> = [
                new State(0, true, 1463320311345, users[0]),
                new State(1, true, 1463320311346, users[2]),
                new State(2, true, 1463320311347, users[1])
            ];
            var states2: Array<State> = [
                new State(3, false, 1463320311345, users[0]),
                new State(4, true, 1463320311346, users[1]),
                new State(5, false, 1463320311347, unknownUser)
            ];

            var documents = [new Document(0, 'TestDoc1', states1), new Document(1, 'TestDoc2', states2)];
            var proj = new Project(1, 'TestProj', null, users, documents, [], []);

            expect(function () {
                $scope.buildDocumentsPrivileged(proj);
            }).toThrow("rootController: Unknown user");
        });


        /**
         * Test 'buildTableProjects'
         */

        describe("Test buildTableProjects", function () {

            var users1: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(5, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];
            var users2: Array<User> = [new User(3, "", "", "", "annotator")];
            // FIXME project underscore must be wrong
            // Leave this until we changed to enums, this should throw then an error
            var projectManager: Array<User> = [new User(77, "", "", "", "project_manager")];
            var watchingUsers: Array<User> = [new User(77, "", "", "", "project_manager")];

            var scheme1 = new Scheme(56, 'discourse_mode', [], [], [], []);
            var scheme2 = new Scheme(89, 'temp', [], [], [], []);

            var states1: Array<State> = [
                new State(6, false, 1463320311345, users1[2]),
                new State(7, true, 1463320311348, users1[1]),
                new State(8, false, 1463320311343, users1[0])
            ];
            var states2: Array<State> = [new State(6, false, 1463320311345, users2[0])];

            var documents1 = [new Document(43, 'Doc2', states1), new Document(44, 'Food', states1)];
            var documents2 = [new Document(22, 'Kumbaja', states2)];

            var testProjects1 = [
                new Project(431, 'Heavy like Heaven', scheme1, users1, documents1, [], watchingUsers),
                new Project(32, 'Miracle', scheme2, users2, documents2, projectManager, [])
            ];

            it('Test buildTableProjects with invalid user id', function () {
                $window.sessionStorage.uId = '5';
                $rootScope.projects = testProjects1;
                expect(function () {
                    $rootScope.buildTableProjects();
                }).toThrow("rootController: No corresponding state object existing");
            });

            it('Test buildTableProjects with 2 projects as annotator', function () {

                $rootScope.projects = testProjects1;
                $rootScope.buildTableProjects();

                // Test the original projects for changes
                expect($rootScope.projects.length).toEqual(2);

                var proj1O = $rootScope.projects[0];
                expect(proj1O.documents.length).toEqual(documents1.length);
                expect(proj1O.users).toEqual(users1);
                expect(proj1O.scheme).toEqual(scheme1);
                expect(proj1O.projectManager).toEqual([]);
                expect(proj1O.watchingUsers).toEqual(watchingUsers);

                var proj2O = $rootScope.projects[1];
                expect(proj2O.documents.length).toEqual(documents2.length);
                expect(proj2O.users).toEqual(users2);
                expect(proj2O.scheme).toEqual(scheme2);
                expect(proj2O.projectManager).toEqual(projectManager);
                expect(proj2O.watchingUsers).toEqual([]);

                // Test the created projects
                expect($rootScope.tableProjects.length).toEqual(2);

                var proj1 = $rootScope.tableProjects[0];
                expect(proj1.documents.length).toEqual(documents1.length);
                expect(proj1.users).toEqual(users1);
                expect(proj1.completed).toEqual(0);
                expect(proj1.scheme).toEqual(scheme1);
                expect(proj1.numberOfDocuments).toEqual(documents1.length);
                expect(proj1.pms).toEqual([]);

                var proj2 = $rootScope.tableProjects[1];
                expect(proj2.documents.length).toEqual(documents2.length);
                expect(proj2.users).toEqual(users2);
                expect(proj2.completed).toEqual(0);
                expect(proj2.scheme).toEqual(scheme2);
                expect(proj2.numberOfDocuments).toEqual(documents2.length);
                expect(proj2.pms).toEqual(projectManager);

                // Rough check for the documents. The buildDocuments-Tests are more detailed.
                var doc1 = proj1.documents[0];
                expect(doc1.id === 43 || doc1.id === 44).toBeTruthy();
                expect(doc1.name === 'Doc2' || doc1.name === 'Food').toBeTruthy();

                var doc2 = proj2.documents[0];
                expect(doc2.id).toEqual(22);
                expect(doc2.name).toEqual('Kumbaja');
            });

            it('Test buildTableProjects with 2 projects as admin', function () {

                $window.sessionStorage.role = 'admin';
                $window.sessionStorage.uId = '1';
                $window.sessionStorage.isAnnotator = 'false';
                $scope.isUnprivileged = 'false';

                $rootScope.projects = testProjects1;
                $rootScope.buildTableProjects();

                // Test the original projects for changes
                expect($rootScope.projects.length).toEqual(2);

                var proj1O = $rootScope.projects[0];
                expect(proj1O.documents.length).toEqual(documents1.length);
                expect(proj1O.users).toEqual(users1);
                expect(proj1O.scheme).toEqual(scheme1);
                expect(proj1O.projectManager).toEqual([]);
                expect(proj1O.watchingUsers).toEqual(watchingUsers);

                var proj2O = $rootScope.projects[1];
                expect(proj2O.documents.length).toEqual(documents2.length);
                expect(proj2O.users).toEqual(users2);
                expect(proj2O.scheme).toEqual(scheme2);
                expect(proj2O.projectManager).toEqual(projectManager);
                expect(proj2O.watchingUsers).toEqual([]);

                // Test the created projects
                expect($rootScope.tableProjects.length).toEqual(2);

                var proj1 = $rootScope.tableProjects[0];
                expect(proj1.documents.length).toEqual(documents1.length);
                expect(proj1.users).toEqual(users1);
                expect(proj1.completed).toEqual([0,2,0]);
                expect(proj1.scheme).toEqual(scheme1);
                expect(proj1.numberOfDocuments).toEqual(documents1.length);
                expect(proj1.pms).toEqual([]);
                expect(proj1.watchingUsers).toEqual(watchingUsers);
                expect(proj1.isWatching).toBeFalsy();

                var proj2 = $rootScope.tableProjects[1];
                expect(proj2.documents.length).toEqual(documents2.length);
                expect(proj2.users).toEqual(users2);
                expect(proj2.completed).toEqual([0]);
                expect(proj2.scheme).toEqual(scheme2);
                expect(proj2.numberOfDocuments).toEqual(documents2.length);
                expect(proj2.pms).toEqual(projectManager);
                expect(proj2.watchingUsers).toEqual([]);
                expect(proj2.isWatching).toBeFalsy();

                // Rough check for the documents. The buildDocuments-Tests are more detailed.
                var doc1 = proj1.documents[0];
                expect(doc1.id === 43 || doc1.id === 44).toBeTruthy();
                expect(doc1.name === 'Doc2' || doc1.name === 'Food').toBeTruthy();

                var doc2 = proj2.documents[0];
                expect(doc2.id).toEqual(22);
                expect(doc2.name).toEqual('Kumbaja');
            });
        });

        it('Test buildTableProjects with empty documents and projects', function () {

            var users: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(1, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];

            var projEmpty = [];
            $rootScope.projects = projEmpty;
            $rootScope.buildTableProjects();

            expect($rootScope.projects.length).toEqual(0);
            expect($rootScope.tableProjects.length).toEqual(0);

            var projects = [new Project(431, 'Heavy like Heaven', null, users, [], [], [])];

            $rootScope.projects = projects;
            $rootScope.buildTableProjects();

            expect($rootScope.projects.length).toEqual(1);
            expect($rootScope.projects[0].documents).toEqual([]);
            expect($rootScope.projects[0].users).toEqual(users);
            expect($rootScope.projects[0].scheme).toEqual(null);
            expect($rootScope.projects[0].projectManager).toEqual([]);
            expect($rootScope.projects[0].watchingUsers).toEqual([]);

            expect($rootScope.tableProjects.length).toEqual(1);
            expect($rootScope.tableProjects[0].documents).toEqual([]);
            expect($rootScope.tableProjects[0].users).toEqual(users);
            expect($rootScope.tableProjects[0].completed).toEqual(0);
            expect($rootScope.tableProjects[0].scheme).toEqual(null);
            expect($rootScope.tableProjects[0].numberOfDocuments).toEqual(0);
            expect($rootScope.tableProjects[0].pms).toEqual([]);
            expect($rootScope.tableProjects[0].lastEditedDocument).toEqual(null);
        });


        /**
         * Test 'getUserIdIndexMap'
         */

        it('Test getUserIdIndexMap with 3 different users', function () {

            var users1: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(1, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];

            var userIdIndexMap = $rootScope.getUserIdIndexMap(users);

            expect(Object.keys(userIdIndexMap).length).toEqual(3);
            expect(userIdIndexMap[0]).toEqual(0);
            expect(userIdIndexMap[1]).toEqual(1);
            expect(userIdIndexMap[3]).toEqual(2);
        });

        it('Test getUserIdIndexMap with empty users array', function () {
            var users = [ ];

            var userIdIndexMap = $rootScope.getUserIdIndexMap(users);

            expect(Object.keys(userIdIndexMap).length).toEqual(0);
        });


        /**
         * Test 'containsUser'
         */

        it('Test containsUser with 3 different users', function () {

            var users1: Array<User> = [
                new User(0, "", "", "", "annotator"),
                new User(1, "", "", "", "annotator"),
                new User(3, "", "", "", "annotator")
            ];

            var userExists = {id: 0};
            var userNotExists = {id: 4};
            var boolVal = $rootScope.containsUser(users, userExists);

            expect(boolVal).toEqual(true);

            boolVal = $rootScope.containsUser(users, userNotExists);

            expect(boolVal).toEqual(false);
        });

        it('Test containsUser with undefined userList', function () {
            var boolVal = $rootScope.containsUser(undefined, undefined);

            expect(boolVal).toEqual(false);
        });

        it('Test containsUser with empty users array', function () {
            var users = [ ];
            var user = {id: 0};
            var boolVal = $rootScope.containsUser(users, user);

            expect(boolVal).toEqual(false);
        });


        /**
         * Test 'getProjectByProjectId'
         */

        it('Test getProjectByProjectId with 3 different projects', function () {
            var projects = [
                {id: 1},
                {id: 2},
                {id: 3}
            ];
            var idExists = 1;
            var idNotExists = 4;
            var proj = $rootScope.getProjectByProjectId(idExists, projects);

            expect(proj.id).toEqual(idExists);

            expect(function () {
                $rootScope.getProjectByProjectId(idNotExists, projects);
            }).toThrow();
        });

        it('Test getProjectByProjectId with empty projects', function () {
            var projects = [ ];
            var id = 1;

            expect(function () {
                $rootScope.getProjectByProjectId(id, projects);
            }).toThrow();
        });


        /**
         * Test 'getDocumentByDocumentId'
         */

        it('Test getDocumentByDocumentId with 3 different projects', function () {
            var documents = [
                {id: 1},
                {id: 2},
                {id: 3}
            ];

            var idExists = 1;
            var idNotExists = 4;
            var proj = $rootScope.getDocumentByDocumentId(idExists, documents);

            expect(proj.id).toEqual(idExists);

            expect(function () {
                $rootScope.getDocumentByDocumentId(idNotExists, documents);
            }).toThrow();
        });

        it('Test getDocumentByDocumentId with empty projects', function () {
            var documents = [ ];
            var id = 1;

            expect(function () {
                $rootScope.getDocumentByDocumentId(id, documents);
            }).toThrow();
        });


        /**
         * Test 'getSchemeBySchemeId'
         */

        it('Test getSchemeBySchemeId with 3 different projects', function () {
            var schemes = [
                {id: 1},
                {id: 2},
                {id: 3}
            ];

            var idExists = 1;
            var idNotExists = 4;
            var proj = $rootScope.getSchemeBySchemeId(idExists, schemes);

            expect(proj.id).toEqual(idExists);

            expect(function () {
                $rootScope.getSchemeBySchemeId(idNotExists, proj);
            }).toThrow();
        });

        it('Test getSchemeBySchemeId with empty projects', function () {
            var schemes = [ ];
            var id = 1;

            expect(function () {
                $rootScope.getSchemeBySchemeId(id, schemes);
            }).toThrow();
        });


        /**
         * Test 'calcTotalTime'
         */

        it('Test calcTotalTime', function () {
            var timeLogArr = [
                {loggedtime: 1},
                {loggedtime: 300},
                {loggedtime: 45}
            ];
            var result = $rootScope.calcTotalTime(timeLogArr);

            expect(result).toEqual("5h 46min");
        });

        it('Test calcTotalTime with empty time logging', function () {
            var timeLogArr = [ ];
            var result = $rootScope.calcTotalTime(timeLogArr);

            expect(result).toEqual("0h 0min");
        });


        /**
         * Test 'compareDocumentsByLastEdit'
         */

        it('Test compareDocumentsByLastEdit', function () {
            var doc1 = {
                lastEdit: 1461868893089
            };
            var doc2 = {
                lastEdit: 1461868893086
            };

            expect($rootScope.compareDocumentsByLastEdit(doc2, doc1)).toEqual(3);
            expect($rootScope.compareDocumentsByLastEdit(doc1, doc2)).toEqual(-3);
            expect($rootScope.compareDocumentsByLastEdit(doc2, doc2)).toEqual(0);
        });


        /**
         * Test 'initAnnoTool'
         */

        it('Test initAnnoTool', function () {
            $rootScope.initAnnoTool(3, 'DogName', 1, 'ProjName', 'English');
            expect($window.sessionStorage.docId).toEqual('3');
            expect($window.sessionStorage.title).toEqual('DogName');
            expect($window.sessionStorage.projectId).toEqual('1');
            expect($window.sessionStorage.projectName).toEqual('ProjName');
            expect($window.sessionStorage.tokenizationLang).toEqual('English');
        });

    });

});
