angular
        .module('app')
        .controller('dashboardController', ['$rootScope', '$scope', '$window', '$http', '$timeout', function ($rootScope, $scope, $window, $http, $timeout) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'annotator') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {
                    $timeout(function () {
                        $scope.visible = 'true'
                    }, 4000);

                    $rootScope.projectName = "DiscAnno"; // TODO why?
                    $rootScope.isUnprivileged = $window.sessionStorage.isAnnotator;

                    $scope.prename = $window.sessionStorage.prename;
                    $scope.lastname = $window.sessionStorage.lastname;
                    $scope.role = $window.sessionStorage.role;

                    this.message = 'Hakuna Matata!';
                }

                $scope.logout = function () {
                    $http.post('discanno/usermanagment/logout');
                    $window.sessionStorage.uId = null;
                    $window.sessionStorage.prename = null;
                    $window.sessionStorage.lastname = null;
                    $window.sessionStorage.email = null;
                    $window.sessionStorage.role = null;
                };
                
                /**
                 * Load projects from server
                 */
                $rootScope.loadProjects = function () {
                    // If User show only assigned projects
                    if ($window.sessionStorage.role !== 'annotator') {
                        var httpProjects = $http.get("discanno/project").then(function (response) {
                            $rootScope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                        }, function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                        });
                    } else {
                        var httpProjects = $http.get("discanno/project/byuser/" + $window.sessionStorage.uId).then(function (response) {
                            $rootScope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                        }, function (err) {
                            $rootScope.checkResponseStatusCode(err.status);
                        });
                    }
                    return httpProjects;
                };
                    
                /**
                 * Construct the table of all projects that were loaded.
                 */
                $rootScope.buildTableProjects = function () {
                    $rootScope.tableProjects = [];
                    for (var i = 0; i < $rootScope.projects.length; i++) {
                        var proj = $rootScope.projects[i];
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
                            if (u.role == 'annotator') {
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
                                    if (st.user.role == 'annotator') {
                                        states.push(st);
                                    }
                                }

                                var docCompl;
                                var lastEdit = -1;

                                //role: annotator
                                if ($scope.isUnprivileged === 'true') {
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
                                    lastEdit = states[usrPos].lastEdit;
                                }
                                //role: admin
                                else {
                                    var docComplAdmin = 0;
                                    for (var t = 0; t < states.length; t++) {
                                        if (states[t].completed) {
                                            projComplAdmin[t]++;
                                            docComplAdmin++;
                                        }
                                        if (states[t].lastEdit > lastEdit) {
                                            lastEdit = states[t].lastEdit;
                                        }
                                    }
                                    docCompl = docComplAdmin;
                                }
                                var docTemplate = {
                                    'id': doc.id,
                                    'name': doc.name,
                                    'completed': docCompl,
                                    'lastEdit': lastEdit
                                };
                                documents.push(docTemplate);
                            }
                            documents.sort($rootScope.compareDocumentsByLastEdit);

                            var projCompl;
                            if ($scope.isUnprivileged === 'true') {
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
                            $rootScope.tableProjects.push(template);
                        }
                    }

                };
                
                /**
                 * Compares two documents by their lastEdit value. Used to
                 * sort the documents in a project.
                 * 
                 * @param {Document} doc1
                 * @param {Document} doc2
                 * @returns {Integer} return negative val, 0 or positive val
                 *                  if doc2.lastEdit is less, equal or higher
                 *                  than doc1.lastEdit
                 */
                $rootScope.compareDocumentsByLastEdit = function (doc1, doc2) {
                    return doc2.lastEdit - doc1.lastEdit;
                };
                
                /**
                 * Initialize the annotation tool
                 * 
                 * @param {String} docId The document id to annotate
                 * @param {String} document name
                 * @param {String} projectName the Projects name
                 * @param {Boolean} completed state of the document
                 */
                $rootScope.initAnnoTool = function (docId, docName, projectName, completed) {
                    $window.sessionStorage.docId = docId;
                    $window.sessionStorage.title = docName;
                    $window.sessionStorage.project = projectName;
                    $window.sessionStorage.completed = completed;
                };

                $rootScope.alerts = [
                ];

                $rootScope.addAlert = function (alert) {
                    $rootScope.alerts.push(alert);
                };

                $rootScope.closeAlert = function (index) {
                    $rootScope.alerts.splice(index, 1);
                };
                
                $rootScope.checkResponseStatusCode = function (status) {
                    if (status === 403) { // Forbidden
                        window.location = "/discanno/signin.html";
                    } else if (status >= 400 && status < 500) {
                        $rootScope.addAlert({type: 'danger', msg: 'This action is not allowed.'});
                    } else if (status >= 500 && status < 600) {
                        $rootScope.addAlert({type: 'danger', msg: 'No server connection.'});
                    }
                };

            }]);