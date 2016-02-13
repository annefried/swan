/* global JSOG */

'use strict';

angular
        .module('app')
        .controller('projectsController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$location', 'hotkeys', '$q',
            function ($scope, $rootScope, $window, $http, $uibModal, $location, hotkeys, $q) {

                // Redirect if client is not logged in
                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {

                    $scope.isuser = ($window.sessionStorage.isUser);

                    /**
                     * Called at the end of Controller construction.
                     * Initializes fields with data from Server.
                     */
                    $scope.init = function () {
                        $scope.loaded = false;
                        // Used to determine which projects are currently toggled
                        $rootScope.collapsed = {};
                        var httpProjects = $scope.loadProjects();
                        var httpSchemes = $scope.loadSchemes();
                        // Wait for both http requests to be answered
                        $q.all([httpProjects, httpSchemes]).then(function () {
                            $scope.loaded = true;
                            $scope.buildTableProjects(httpSchemes, httpProjects);
                        });
                    };

                    /**
                     * Enables '+'-Hotkey
                     */
                    hotkeys.bindTo($scope).add({
                        combo: '+',
                        description: 'Adding a new Project',
                        callback: function () {
                            $scope.openProjectModal();
                        }
                    });

                    /**
                     * Used for the toggle + Button.
                     * @param {type} id the id of the Project to toggle.
                     * @returns {String} css class.
                     */
                    $scope.computeCssClass = function (id) {

                        // To also make new Document collapsed on default
                        if ($rootScope.collapsed[id] == true) {
                            return "in";
                        }
                    };

                    /**
                     * Returns if a given project is toggled.
                     * @param {type} id the id of the Project.
                     */
                    $scope.projectToggeled = function (id) {
                        if ($scope.toggeled === undefined) {
                            $scope.toggeled = {};
                        }
                        var tog = $scope.toggeled[id];
                        if (tog === undefined) {
                            $scope.toggeled[id] = true;
                        } else if (tog) {
                            $scope.toggeled[id] = false;
                        } else {
                            $scope.toggeled[id] = true;
                        }
                    };

                    /**
                     * Used to determine if the export button should be enabled.
                     * @param {type} id The Id of the Project.
                     * @returns {String} if export is possible
                     */
                    $scope.isExportPossible = function (id) {
                        var index = $scope.getProjectIndexById(id);
                        if ($rootScope.tableProjects[index].documents == undefined
                                || $rootScope.tableProjects[index].documents.length == 0
                                || $rootScope.tableProjects[index].users == undefined
                                || $rootScope.tableProjects[index].users.length == 0) {
                            return 'false';
                        } else {
                            return 'true';
                        }
                    };

                    /**
                     * Returns the index of a project in the table.
                     * @param {type} id the id of the project
                     * @returns {Number} the index
                     */
                    $scope.getProjectIndexById = function (id) {
                        for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                            if ($rootScope.tableProjects[i].id === id) {
                                return i;
                            }
                        }
                    };

                    /**
                     * Load Schemes from Database
                     */
                    $scope.loadSchemes = function () {
                        var httpSchemes = $http.get("tempannot/scheme/schemes").then(function (response) {
                            $scope.schemes = JSOG.parse(JSON.stringify(response.data)).schemes;
                        }, function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                        });
                        return httpSchemes;
                    };
                    /**
                     * Load Projects from Database
                     */
                    $scope.loadProjects = function () {
                        // If User show only assigned projects
                        if ($window.sessionStorage.role !== 'user') {
                            var httpProjects = $http.get("tempannot/project").then(function (response) {
                                $scope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                            }, function (err) {
                                $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                            });
                        } else {
                            var httpProjects = $http.get("tempannot/project/byuser/" + $window.sessionStorage.uId).then(function (response) {
                                $scope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                            }, function (err) {
                                $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                            });
                        }
                        return httpProjects;
                    };
                    /**
                     * Construct the table of all projects that were loaded.
                     */
                    $scope.buildTableProjects = function () {
                        $scope.tableProjects = [];
                        for (var i = 0; i < $scope.projects.length; i++) {
                            var proj = $scope.projects[i];
                            var projComplUser = 0;
                            var projComplAdmin = [];
                            var documents = [];
                            var myProject = $window.sessionStorage.role === 'admin';
                            var projComplAdmin = [];
                            for (var j = 0; j < proj.users.length; j++) {
                                var u = proj.users[j];
                                if (u.id == $window.sessionStorage.uId) {
                                    myProject = true;
                                }
                                if (u.role == 'user') {
                                    projComplAdmin.push(0);
                                } else {
                                    console.log("This should never happen.\nBut it will.");
                                }
                            }
                            for (var j = 0; j < proj.projectManager.length; j++) {
                                var p = proj.projectManager[j];
                                if (p.id == $window.sessionStorage.uId) {
                                    myProject = true;
                                }
                            }

                            if (myProject) {
                                var projComplUser = 0;
                                var documents = [];

                                for (var j = 0; j < proj.documents.length; j++) {
                                    var doc = proj.documents[j];
                                    var states = [];

                                    for (var yi = 0; yi < doc.states.length; yi++) {
                                        var st = doc.states[yi];
                                        if (st.user.role == 'user') {
                                            states.push(st);
                                        }
                                    }

                                    var docCompl;
                                    //role: Annotater
                                    if ($scope.isuser === 'true') {
                                        var usrPos = -1;
                                        for (var t = 0; t < proj.users.length; t++) {
                                            if ($window.sessionStorage.uId == states[t].user.id) {
                                                usrPos = t;
                                            }
                                        }

                                        if (usrPos === -1 || states.length !== proj.users.length) {
                                            console.log("Error");
                                        }

                                        if (states[usrPos].completed) {
                                            projComplUser++;
                                        }
                                        docCompl = states[usrPos].completed;
                                    }
                                    //role: Admin
                                    else {
                                        var docComplAdmin = 0;
                                        for (var t = 0; t < states.length; t++) {
                                            if (states[t].completed) {
                                                projComplAdmin[t]++;
                                                docComplAdmin++;
                                            }
                                        }
                                        docCompl = docComplAdmin;
                                    }
                                    var docTemplate = {
                                        'completed': docCompl,
                                        'id': doc.id,
                                        'name': doc.name
                                    };
                                    documents.push(docTemplate);
                                }
                                var projCompl;
                                if ($scope.isuser === 'true') {
                                    projCompl = projComplUser;
                                } else {
                                    projCompl = projComplAdmin;
                                }

                                var template = {
                                    'id': proj.id,
                                    'name': proj.name,
                                    'users': proj.users,
                                    'completed': projCompl,
                                    'numberOfDocuments': proj.documents.length,
                                    'documents': documents,
                                    'pms': proj.projectManager
                                };
                                $scope.tableProjects.push(template);
                            }
                        }

                        $rootScope.tableProjects = $scope.tableProjects;
                    };
                    /**
                     * Get the Adress to export a project.
                     * @param {type} projId the Projects id
                     * @returns {String} the adress for export
                     */
                    $scope.exportProject = function (projId) {
                        return "tempannot/project/export/" + projId;
                    };
                    /**
                     * Called upon clicking the 'x'-Button in a documents row.
                     * @param {type} documentId the documents id
                     * @param {type} projId the projects id
                     */
                    $scope.deleteDocument = function (documentId, projId) {
                        $http.delete("tempannot/document/" + documentId).then(function (response) {
                            for (var j = 0; j < $rootScope.tableProjects.length; j++) {
                                if ($rootScope.tableProjects[j].id === projId) {
                                    var project = $rootScope.tableProjects[j];
                                    for (var i = 0; i < project.documents.length; i++) {
                                        if (project.documents[i].id === documentId) {
                                            project.documents.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }, function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                        });
                    };

                    /**
                     * Redirects to the AnnotationTool
                     * @param {type} docId The document to annotate
                     * @param {type} title its title
                     * @param {type} projectName the Projects name
                     * @param {type} completed if it is completed
                     */
                    $scope.openAnnoTool = function (docId, title, projectName, completed) {
                        $window.sessionStorage.docId = docId;
                        $window.sessionStorage.title = title;
                        $window.sessionStorage.project = projectName;
                        $window.sessionStorage.completed = completed;
                        $location.path('/annotation');
                    };

                    /******************
                     *******Modals*****
                     *******************/

                    /**
                     * Called upon clicking the 'Pen'-Glyphicon.
                     * Opens the ProjectEditModal.
                     * @param {type} projectId the id of the project
                     * @param {type} projectName the name of the project
                     */
                    $scope.editProject = function (projectId, projectName) {
                        $rootScope.currentProjectIndex = $scope.getProjectIndexById(projectId);
                        $rootScope.currentProjectId = projectId;
                        $rootScope.currentProjectName = projectName;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/projects/projectEditModal.html',
                            controller: 'projectEditModalController'
                        });

                        modalInstance.result.then(function (result) {

                        }, function () {

                        });

                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };

                    };

                    /**
                     * Called upon clicking the 'Page'-Button.
                     * Opens the SchemeViewModal
                     * @param {type} projectId the projects id
                     */
                    $scope.openProjectSchemeModal = function (projectId) {
                        for (var i = 0; i < $scope.projects.length; i++) {
                            if ($scope.projects[i].id === projectId) {
                                $rootScope.currentScheme = $scope.projects[i].scheme;
                            }
                        }
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/schemes/schemeViewModal.html',
                            controller: 'schemeViewModalController'
                        });

                        modalInstance.result.then(function (response) {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    /**
                     * Called upon clicking the 'x'-Button
                     * Opens the ProjectDeleteModal
                     * @param {type} projectId the projects id
                     */
                    $scope.openProjectDeleteModal = function (projectId) {
                        $rootScope.currentProjectIndex = $scope.getProjectIndexById(projectId);
                        $rootScope.currentProjectId = projectId;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/projects/projectDeleteModal.html',
                            controller: 'projectDeleteModalController'
                        });

                        modalInstance.result.then(function (response) {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    /**
                     * Called upon clicking the '+ Project'-Button
                     * Opens the ProjectAddModal
                     */
                    $scope.openProjectAddModal = function () {

                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/projects/projectAddModal.html',
                            controller: 'projectAddModalController'
                        });

                        modalInstance.result.then(function (full) {
                            var projectTemplate = {
                                'name': full.name,
                                'id': null,
                                'documents': [],
                                'scheme': {
                                    'id': full.scheme.id
                                }

                            };
                            $http.post('tempannot/project', JSON.stringify(projectTemplate))
                                    .then(function (response) {
                                        var template = {
                                            'id': response.data,
                                            'name': full.name,
                                            'users': [],
                                            'pms': [],
                                            'completed': [],
                                            'numberOfDocuments': 0,
                                            'documents': []
                                        };


                                        if ($window.sessionStorage.role != 'projectmanager') {

                                            $rootScope.tableProjects.push(template);
                                        } else {
                                            //get the current user (there is not REST interface for getUser by ID)
                                            $http.get("tempannot/user/").then(function (response) {
                                                var users = JSOG.parse(JSON.stringify(response.data)).users;
                                                for (var i = 0; i < users.length; i++) {
                                                    var u = users[i];
                                                    if ($window.sessionStorage.uId == u.id) {
                                                        template.pms = [u];
                                                    }
                                                }
                                                $rootScope.tableProjects.push(template);
                                            }, function () {});

                                            $http.post("tempannot/project/addManager/"
                                                    + template.id
                                                    + "/"
                                                    + $window.sessionStorage.uId);
                                        }

                                    }, function () {
                                        $rootScope.addAlert({type: 'danger', msg: 'A Project with this name already exists.'});
                                    });

                        }, function () {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    /**
                     * Called upon clicking the '+ Document'-Button
                     * Opens the DocumentAddModal.
                     * @param {type} projectId the projects id
                     */
                    $scope.openDocumentAddModal = function (projectId) {
                        var projectIndex = $scope.getProjectIndexById(projectId);
                        $rootScope.collapsed[projectId] = true;
                        $rootScope.currentProjectIndex = projectIndex;
                        $rootScope.currentProjectId = projectId;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/projects/documentAddModal.html',
                            controller: 'documentAddModalController'
                        });

                        modalInstance.result.then(function (result) {

                        }, function () {

                        });

                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };

                    };

                    $scope.init();
                }
            }]);



