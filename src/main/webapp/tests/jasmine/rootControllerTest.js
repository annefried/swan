/**
 * Created by Timo Guehring on 11.05.16.
 */
'use strict';

describe('Test rootController', function () {
    beforeEach(module('app'));

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
            $scope = $rootScope.$new;
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
            expect(alert.msg).toEqual('No server connection.');
            
        });

        it('Test checkResponseStatusCode with status code: 600', function () {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(600);

            expect($rootScope.alerts.length).toEqual(0);
        });


        /**
         * Test 'loadProjects'
         *
         * TODO: Check promise
         */

        it('Test loadProjects as annotator', function () {

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'discanno/project/byuser/' + $window.sessionStorage.uId;
            var response = { projects: [] };

            $httpBackend
                .when('GET', url)
                .respond(200, response);

            $httpBackend
                .expect('GET', url);

            var httpObj = $rootScope.loadProjects();

            expect($httpBackend.flush).not.toThrow();
            //expect(httpObj.projects.length).toEqual(0);
        });

        it('Test loadProjects as admin', function () {

            $window.sessionStorage.role = 'admin';

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'discanno/project';
            var response = { projects: [] };

            $httpBackend
                .when('GET', url)
                .respond(200, response);

            $httpBackend
                .expect('GET', url);

            var httpObj = $rootScope.loadProjects();

            expect($httpBackend.flush).not.toThrow();
            //expect(httpObj.projects.length).toEqual(0);
        });


        /**
         * Test 'buildDocuments'
         */

        it('Test buildDocuments with 3 documents', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var states1 = [
                {
                    id: 0,
                    completed: true,
                    lastEdit: 1463320311345,
                    user: users[0]
                },
                {
                    id: 1,
                    completed: true,
                    lastEdit: 1463320311346, // user 3
                    user: users[2]
                },
                {
                    id: 2,
                    completed: true,
                    lastEdit: 1463320311347,
                    user: users[1]
                }
            ];
            var states2 = [
                {
                    id: 3,
                    completed: false,
                    lastEdit: 1463320311345,
                    user: users[0]
                },
                {
                    id: 4,
                    completed: true,
                    lastEdit: 1463320311346,
                    user: users[1]
                },
                {
                    id: 5,
                    completed: false,
                    lastEdit: 1463320311347, // user 3
                    user: users[2]
                }
            ];
            var states3 = [
                {
                    id: 6,
                    completed: false,
                    lastEdit: 1463320311345, // user 3
                    user: users[2]
                },
                {
                    id: 7,
                    completed: true,
                    lastEdit: 1463320311348,
                    user: users[1]
                },
                {
                    id: 8,
                    completed: false,
                    lastEdit: 1463320311343,
                    user: users[0]
                }
            ];
            var documents = [
                {
                    id: 1,              // second
                    name: 'Doc1',
                    states: states1
                },
                {
                    id: 5,              // first
                    name: 'John Lock',
                    states: states2
                },
                {
                    id: 169,            // third
                    name: 'Greek History',
                    states: states3
                }
            ];
            var proj = {
                users: users,
                documents: documents
            };
            var resultDocs = [];
            var projComplAdmin = new Array(3);

            var projComplUser = $scope.buildDocuments(proj, resultDocs, projComplAdmin);

            expect(documents.length).toEqual(3);
            expect(proj.users.length).toEqual(3);
            expect(proj.documents.length).toEqual(3);
            expect(resultDocs.length).toEqual(3);
            expect(projComplUser).toEqual(1);

            // Test documents
            var doc0 = resultDocs[0];
            expect(doc0.id).toEqual(5);
            expect(doc0.name).toEqual('John Lock');
            expect(doc0.completed).toBeFalsy();
            expect(doc0.lastEdit).toEqual(1463320311347);
            expect(doc0.states.length).toEqual(3);
            expect(doc0.states[0]).toEqual(states2[0]);
            expect(doc0.states[1]).toEqual(states2[1]);
            expect(doc0.states[2]).toEqual(states2[2]);

            var doc1 = resultDocs[1];
            expect(doc1.id).toEqual(1);
            expect(doc1.name).toEqual('Doc1');
            expect(doc1.completed).toBeTruthy();
            expect(doc1.lastEdit).toEqual(1463320311346);
            expect(doc1.states.length).toEqual(3);
            expect(doc1.states[0]).toEqual(states1[0]);
            expect(doc1.states[1]).toEqual(states1[2]);
            expect(doc1.states[2]).toEqual(states1[1]);

            var doc2 = resultDocs[2];
            expect(doc2.id).toEqual(169);
            expect(doc2.name).toEqual('Greek History');
            expect(doc2.completed).toBeFalsy();
            expect(doc2.lastEdit).toEqual(1463320311345);
            expect(doc2.states.length).toEqual(3);
            expect(doc2.states[0]).toEqual(states3[2]);
            expect(doc2.states[1]).toEqual(states3[1]);
            expect(doc2.states[2]).toEqual(states3[0]);
        });
        
        it('Test buildDocuments with empty documents', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var proj = {
                users: users,
                documents: []
            };
            var documents = [];
            var projComplAdmin = [];

            var projComplUser = $scope.buildDocuments(proj, documents, projComplAdmin);

            expect(documents.length).toEqual(0);
            expect(proj.users.length).toEqual(3);
            expect(proj.documents.length).toEqual(0);
            expect(projComplUser).toEqual(0);
            expect(projComplAdmin.length).toEqual(0);
        });

        it('Test buildDocuments with different states and users length', function () {
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
            var documents = [];
            var projComplAdmin = [];

            expect(function () {
                $scope.buildDocuments(proj, documents, projComplAdmin);
            }).toThrow("rootController: States and users length differs");
        });

        it('Test buildDocuments with wrong assigned user', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
            ];
            var unknownUser = {id: 5};
            var states1 = [
                {
                    id: 0,
                    completed: true,
                    lastEdit: 1463320311345,
                    user: users[0]
                },
                {
                    id: 1,
                    completed: true,
                    lastEdit: 1463320311346,
                    user: users[2]
                },
                {
                    id: 2,
                    completed: true,
                    lastEdit: 1463320311347,
                    user: users[1]
                }
            ];
            var states2 = [
                {
                    id: 3,
                    completed: false,
                    lastEdit: 1463320311345,
                    user: users[0]
                },
                {
                    id: 4,
                    completed: true,
                    lastEdit: 1463320311346,
                    user: users[1]
                },
                {
                    id: 5,
                    completed: false,
                    lastEdit: 1463320311347,
                    user: unknownUser
                }
            ];
            var proj = {
                users: users,
                documents: [
                    {
                        states: states1
                    },
                    {
                        states: states2
                    }
                ]
            };
            var documents = [];
            var projComplAdmin = [];

            expect(function () {
                $scope.buildDocuments(proj, documents, projComplAdmin);
            }).toThrow("rootController: Unknown user");
        });


        /**
         * Test 'buildTableProjects'
         */

        describe("Test buildTableProjects", function () {

            var users1 = [
                {
                    id: 0,
                    role: 'annotator'
                },
                {
                    id: 1,
                    role: 'annotator'
                },
                {
                    id: 3,
                    role: 'annotator'
                }
            ];
            var users2 = [
                {
                    id: 5,
                    role: 'annotator'
                }
            ];
            var projectManager = [
                {
                    id: 77,
                    role: 'project_manager'
                }
            ];
            var watchingUsers = [
                projectManager[0]
            ];
            var scheme1 = {
                id: 56,
                name: 'discourse_mode'
            };
            var scheme2 = {
                id: 89,
                name: 'temp'
            };
            var states1 = [
                {
                    id: 6,
                    completed: false,
                    lastEdit: 1463320311345,
                    user: users1[2]
                },
                {
                    id: 7,
                    completed: true,
                    lastEdit: 1463320311348,
                    user: users1[1]
                },
                {
                    id: 8,
                    completed: false,
                    lastEdit: 1463320311343,
                    user: users1[0]
                }
            ];
            var states2 = [
                {
                    id: 6,
                    completed: false,
                    lastEdit: 1463320311345,
                    user: users2[0]
                }
            ];
            var documents1 = [
                {
                    id: 43,
                    name: 'Doc2',
                    states: states1
                },
                {
                    id: 44,
                    name: 'Food',
                    states: states1
                }
            ];
            var documents2 = [
                {
                    id: 22,
                    name: 'Kumbaja',
                    states: states2
                }
            ];
            var proj = [
                {
                    id: 431,
                    name: 'Heavy like Heaven',
                    users: users1,
                    scheme: scheme1,
                    documents: documents1,
                    projectManager: [],
                    watchingUsers: watchingUsers
                },
                {
                    id: 32,
                    name: 'Miracle',
                    users: users2,
                    scheme: scheme2,
                    documents: documents2,
                    projectManager: projectManager,
                    watchingUsers: []
                }
            ];

            it('Test buildTableProjects with 2 projects as annotator', function () {

                $rootScope.projects = proj;
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
                expect($rootScope.tableProjects.length).toEqual(1);

                var proj1 = $rootScope.tableProjects[0];
                expect(proj1.documents.length).toEqual(documents1.length);
                expect(proj1.users).toEqual(users1);
                expect(proj1.completed).toEqual(0);
                expect(proj1.scheme).toEqual(scheme1);
                expect(proj1.numberOfDocuments).toEqual(documents1.length);
                expect(proj1.pms).toEqual([]);
                expect(proj1.watchingUsers).toEqual(watchingUsers);
                expect(proj1.isWatching).toBeFalsy();

                // Rough check for the documents. The buildDocuments-Tests are more detailed.
                var doc1 = proj1.documents[0];
                expect(doc1.id === 43 || doc1.id === 44).toBeTruthy();
                expect(doc1.name === 'Doc2' || doc1.name === 'Food').toBeTruthy();
            });

            it('Test buildTableProjects with 2 projects as admin', function () {

                $window.sessionStorage.role = 'admin';
                $window.sessionStorage.isAnnotator = 'false';
                $scope.isUnprivileged = 'false';

                $rootScope.projects = proj;
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
            var users = [
                {
                    id: 0,
                    role: 'annotator'
                },
                {
                    id: 1,
                    role: 'annotator'
                },
                {
                    id: 3,
                    role: 'annotator'
                }
            ];

            var projEmpty = [];
            $rootScope.projects = projEmpty;
            $rootScope.buildTableProjects();

            expect($rootScope.projects.length).toEqual(0);
            expect($rootScope.tableProjects.length).toEqual(0);

            var proj = [
                {
                    id: 431,
                    name: 'Heavy like Heaven',
                    users: users,
                    scheme: {},
                    documents: [],
                    projectManager: [],
                    watchingUsers: []
                }
            ];
            $rootScope.projects = proj;
            $rootScope.buildTableProjects();

            expect($rootScope.projects.length).toEqual(1);
            expect($rootScope.projects[0].documents).toEqual([]);
            expect($rootScope.projects[0].users).toEqual(users);
            expect($rootScope.projects[0].scheme).toEqual({});
            expect($rootScope.projects[0].projectManager).toEqual([]);
            expect($rootScope.projects[0].watchingUsers).toEqual([]);

            expect($rootScope.tableProjects.length).toEqual(1);
            expect($rootScope.tableProjects[0].documents).toEqual([]);
            expect($rootScope.tableProjects[0].users).toEqual(users);
            expect($rootScope.tableProjects[0].completed).toEqual(0);
            expect($rootScope.tableProjects[0].scheme).toEqual({});
            expect($rootScope.tableProjects[0].numberOfDocuments).toEqual(0);
            expect($rootScope.tableProjects[0].pms).toEqual([]);
            expect($rootScope.tableProjects[0].watchingUsers).toEqual([]);
            expect($rootScope.tableProjects[0].isWatching).toBeFalsy();
        });

        it('Test buildTableProjects with with wrong user role', function () {
            var users = [
                {
                    id: 0,
                    role: 'annotator'
                },
                {
                    id: 1,
                    role: 'annotator'
                },
                {
                    id: 3,
                    role: 'admin'
                }
            ];

            var proj = [
                {
                    id: 431,
                    name: 'Heavy like Heaven',
                    users: users,
                    scheme: {},
                    documents: [],
                    projectManager: [],
                    watchingUsers: []
                }
            ];
            $rootScope.projects = proj;

            expect(function () {
                $rootScope.buildTableProjects();
            }).toThrow("rootController: Assigned user with id 3 has not role 'annotator'");
        });


        /**
         * Test 'getUserIdIndexMap'
         */

        it('Test getUserIdIndexMap with 3 different users', function () {
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
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
            var users = [
                {id: 0},
                {id: 1},
                {id: 3}
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
         * Test 'getProjectByProjectName'
         */

        it('Test getProjectByProjectName with 3 different projects', function () {
            var projects = [
                {name: 'DiscourseModeProj'},
                {name: 'GreekProj'},
                {name: 'Proj1'}
            ];
            var nameExists = 'Proj1';
            var nameNotExists = 'Proj2';
            var proj = $rootScope.getProjectByProjectName(nameExists, projects);

            expect(proj.name).toEqual(nameExists);

            expect(function () {
                $rootScope.getProjectByProjectName(nameNotExists, projects);
            }).toThrow();
        });

        it('Test getProjectByProjectName with empty projects', function () {
            var projects = [ ];
            var name = 'Proj1';

            expect(function () {
                $rootScope.getProjectByProjectName(name, projects);
            }).toThrow();
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

            var project = {documents: documents};

            var idExists = 1;
            var idNotExists = 4;
            var proj = $rootScope.getDocumentByDocumentId(idExists, project);

            expect(proj.id).toEqual(idExists);

            expect(function () {
                $rootScope.getDocumentByDocumentId(idNotExists, project);
            }).toThrow();
        });

        it('Test getDocumentByDocumentId with empty projects', function () {
            var documents = [ ];
            var project = {documents: documents};
            var id = 1;

            expect(function () {
                $rootScope.getDocumentByDocumentId(id, project);
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
                $rootScope.getSchemeBySchemeId(idNotExists, project);
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
            $rootScope.initAnnoTool(3, 'DogName', 'ProjName', true);
            expect($window.sessionStorage.docId).toEqual('3');
            expect($window.sessionStorage.title).toEqual('DogName');
            expect($window.sessionStorage.project).toEqual('ProjName');
            expect($window.sessionStorage.completed).toEqual('true');
        });

    });
});