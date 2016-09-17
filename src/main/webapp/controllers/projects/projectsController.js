/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('projectsController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$location', 'hotkeys', 'schemeByIdService', '$q',
       function ($scope, $rootScope, $window, $http, $uibModal, $location, hotkeys, schemeByIdService, $q) {

            $rootScope.validateSignedInUser();
    	
            $scope.isUnprivileged = $window.sessionStorage.isAnnotator;
            $rootScope.currUser = {'id': parseInt($window.sessionStorage.uId)};
            
            /**
             * Called at the end of Controller construction.
             * Initializes fields with data from backend.
             */
            $scope.init = function () {
                $scope.loaded = false;
                // Used to determine which projects are currently toggled
                $rootScope.collapsed = {};
                $scope.currentPageNumber = 1;
                var httpNumberProjects = $rootScope.loadProjectsCount();
                var httpProjects = $rootScope.loadProjects();
                var httpSchemes = $scope.loadSchemes();
                // Wait for http requests to be answered
                $q.all([httpNumberProjects, httpProjects, httpSchemes]).then(function () {
                    $scope.loaded = true;
                    $rootScope.buildTableProjects();
                });

                if ($rootScope.tour !== undefined) {
                    $rootScope.tour.resume();
                }
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
             * Used for the toggle '+'-Button.
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
             * Load Schemes from backend
             */
            $scope.loadSchemes = function () {
                var httpSchemes = $http.get("swan/scheme/schemes").success(function (response) {
                    $rootScope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
                }).error(function (response) {
                    $rootScope.checkResponseStatusCode(response.status);
                });
                return httpSchemes;
            };

            /**
             * Get the address to export a project.
             * @param {type} projId the Projects id
             * @returns {String} the address for export
             */
            $scope.exportProject = function (projId) {
                return "swan/project/export/" + projId;
            };

            /**
             * Get the address to export a project.
             * @param {type} projId the Projects id
             * @returns {String} the address for export
             */
            $scope.exportProjectXmi = function (projId) {
                return "swan/project/exportXmi/" + projId;
            };

            /**
             * Redirects to the annotation tool.
             *
             * @param {String} docId The document id to annotate
             * @param {String} docName name
             * @param {String} projectName the Projects name
             * @param {Boolean} completed state of the document
             */
            $scope.openAnnoTool = function (docId, docName, projectName, completed, users) {
                $scope.alertVisible = true;
                $rootScope.initAnnoTool(docId, docName, projectName, completed);
                //Variables in the sessionStorage have to be Strings
                $window.sessionStorage.users = JSON.stringify(users);
                $location.path('/annotation');
            };

            $scope.pageChanged = function () {
                $scope.loaded = false;
                var httpNumberProjects = $rootScope.loadProjectsCount();
                var httpProjects = $rootScope.loadProjects($scope.currentPageNumber);
                // Wait for both http requests to be answered
                $q.all([httpNumberProjects, httpProjects]).then(function () {
                    $scope.loaded = true;
                    $rootScope.buildTableProjects();
                });
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
             * Opens the SchemeViewModal. Called upon clicking the 'Page'-Button.
             * 
             * @param {type} projectId
             */
            $scope.openProjectSchemeModal = function (projectId) {

                const uidObject = {
                    animation: $scope.animationsEnabled,
                    templateUrl: 'templates/schemes/schemeViewModal.html',
                    controller: 'schemeViewModalController'
                };
                var modalInstance = null;
                var proj = null;
                for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                    if ($rootScope.tableProjects[i].id == projectId) {
                        proj = $rootScope.tableProjects[i];
                        break;
                    }
                }

                if (proj == null) {
                    throw "projectsController: Wrong project id";
                }

                if (proj.scheme.name === undefined) {
                    $http.get("swan/scheme/byid/" + proj.scheme.id).success(function (response) {
                        proj.scheme = response.scheme;
                        $rootScope.schemes.push(proj.scheme);
                        $rootScope.currentScheme = proj.scheme;
                        modalInstance = $uibModal.open(uidObject);
                        modalInstance.result.then(function (response) {

                        });
                    }).error(function (response) {
                        $rootScope.checkResponseStatusCode(response.status);
                    });
                } else {
                    $rootScope.currentScheme = proj.scheme;
                    modalInstance = $uibModal.open(uidObject);
                    modalInstance.result.then(function (response) {

                    });
                }

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
            * Called upon clicking the 'x'-Button
            * Opens the DocumenttDeleteModal
            * @param documentId
            * @param projId
            */
            $scope.openDocumentDeleteModal = function (documentId, projId) {
                $rootScope.documentId = documentId;
                $rootScope.projId = projId;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'templates/projects/documentDeleteModal.html',
                    controller: 'documentDeleteModalController'
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
                        'id': null,
                        'name': full.name,
                        'tokenizationLang': full.lang,
                        'documents': [],
                        'scheme': {
                            'id': full.scheme.id
                        }
                    };

                    $http.post('swan/project', JSON.stringify(projectTemplate)).then(function (response) {
                        var template = {
                            'id': response.data,
                            'name': full.name,
                            'tokenizationLang': full.lang,
                            'scheme': projectTemplate.scheme,
                            'users': [],
                            'pms': [],
                            'completed': [],
                            'numberOfDocuments': 0,
                            'documents': []
                        };

                        if ($window.sessionStorage.role != 'projectmanager') {
                            $rootScope.tableProjects.push(template);
                        } else {
                            // TODO create REST interface getUser by Id
                            // Get the current user (there is no REST interface for getUser by ID)
                            $http.get("swan/user/withprojects").success(function (response) {
                                var users = JSOG.parse(JSON.stringify(response)).users;
                                for (var i = 0; i < users.length; i++) {
                                    var u = users[i];
                                    if ($window.sessionStorage.uId == u.id) {
                                        template.pms = [u];
                                        break;
                                    }
                                }
                                
                                // Add project manager to the corresponding project manager list
                                $http.post("swan/project/addManager/" + template.id + "/" + $window.sessionStorage.uId).success(function (response) {
                                    $rootScope.tableProjects.push(template);
                                }).error(function (response) {
                                    $rootScope.checkResponseStatusCode(response.status);
                                });
                                
                            }).error(function (response) {
                                $rootScope.checkResponseStatusCode(response.status);
                            });
                            
                        }
                        $scope.projectToggeled(response.data);

                    }, function () {
                        $rootScope.addAlert({type: 'danger', msg: 'A Project with this name already exists.'});
                    });

                    if ($rootScope.tour !== undefined) {
                        $("#tour-next-button").prop("disabled", false);
                    }
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
                $rootScope.currProj = $rootScope.getProjectByProjectId(projectId, $rootScope.tableProjects);
                $rootScope.currScheme = schemeByIdService.getScheme($rootScope.currProj.scheme.id);

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'templates/projects/documentAddModal.html',
                    controller: 'documentAddModalController'
                });

                modalInstance.result.then(function (result) {

                });

                $scope.toggleAnimation = function () {
                    $scope.animationsEnabled = !$scope.animationsEnabled;
                };

            };

            $scope.init();
        }
    
    ]);



