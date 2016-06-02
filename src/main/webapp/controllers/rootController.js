/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('rootController', ['$rootScope', '$scope', '$window', '$http',
	function ($rootScope, $scope, $window, $http) {

        $rootScope.alerts = [
        ];

        $rootScope.addAlert = function (alert) {
            $rootScope.alerts.push(alert);
        };

        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };

        $rootScope.checkResponseStatusCode = function (statusCode) {
            if (statusCode === 403) { // Forbidden
                $rootScope.redirectToLogin();
            } else if (statusCode >= 400 && statusCode < 500) {
                $rootScope.addAlert({type: 'danger', msg: 'This action is not allowed.'});
            } else if (statusCode >= 500 && statusCode < 600) {
                $rootScope.addAlert({type: 'danger', msg: 'No server connection.'});
            }
        };

        $rootScope.redirectToLogin = function () {
            window.location = "/discanno/signin.html";
        };
        
        $rootScope.validateSignedInUser = function () {
        	if ($window.sessionStorage.role != 'admin'
        			&& $window.sessionStorage.role != 'annotator'
	                && $window.sessionStorage.role != 'projectmanager') {
                $rootScope.redirectToLogin();
            }
        };

        $rootScope.validateSignedInUser();
        $rootScope.isUnprivileged = $window.sessionStorage.isAnnotator;

        $scope.logout = function () {
            $http.post('discanno/usermanagment/logout');
            $window.sessionStorage.uId = null;
            $window.sessionStorage.prename = null;
            $window.sessionStorage.lastname = null;
            $window.sessionStorage.email = null;
            $window.sessionStorage.role = null;
        };

        /**
         * Load projects depending on the user role from the backend.
         */
        $rootScope.loadProjects = function () {
        	
        	const url = "discanno/project/byuser/" + $window.sessionStorage.uId;
            
            var httpProjects = $http.get(url).success(function (response) {
            	$rootScope.projects = JSOG.parse(JSON.stringify(response)).projects;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
            
            return httpProjects;
        };

        /**
         * Construct the table of all projects that were loaded.
         */
        $rootScope.buildTableProjects = function () {
            $rootScope.tableProjects = [];
            var currUser = {'id': parseInt($window.sessionStorage.uId)};
            for (var i = 0; i < $rootScope.projects.length; i++) {

                var proj = $rootScope.projects[i];
                var projComplAdmin = new Array(proj.users.length);
                for(var p = 0; p < projComplAdmin.length; p++) projComplAdmin[p] = 0;
                var documents = [];

                const projComplUser = $scope.buildDocuments(proj, documents, projComplAdmin);
                const projCompl = $scope.isUnprivileged === 'true' ? projComplUser : projComplAdmin;
                const template = {
                    'id': proj.id,
                    'name': proj.name,
                    'users': proj.users,
                    'completed': projCompl,
                    'scheme': proj.scheme,
                    'numberOfDocuments': proj.documents.length,
                    'documents': documents,
                    'pms': proj.projectManager,
                    'watchingUsers': proj.watchingUsers,
                    'isWatching': $rootScope.containsUser(proj.watchingUsers, currUser)
                };
                
                $rootScope.tableProjects.push(template);
            }

        };

        $scope.buildDocuments = function (proj, documents, projComplAdmin) {

            // Used to order the states in the same order like the
            // user array and therefore the completed array. Necessary for
            // the progress bars.
            const userIdIndexMap = $rootScope.getUserIdIndexMap(proj.users);
            var projComplUser = 0;

            for (var j = 0; j < proj.documents.length; j++) {

                const doc = proj.documents[j];
                const states = new Array(doc.states.length);

                /** TODO HOTFIX
                 * https://github.com/annefried/discanno/issues/167
                if (doc.states.length !== proj.users.length) {
                    throw "rootController: States and users length differs";
                }
                 */

                for (var i = 0; i < doc.states.length; i++) {
                    const state = doc.states[i];
                    const index = userIdIndexMap[state.user.id];
                    /** TODO HOTFIX
                     * https://github.com/annefried/discanno/issues/167
                    if (index === undefined) {
                        throw "rootController: Unkown user";
                    } else {
                    */
                        states[index] = state;
                    //}
                }

                var docCompl;
                var lastEdit = -1;

                // role: annotator
                if ($scope.isUnprivileged === 'true') {
                    var usrPos = -1;
                    for (var t = 0; t < states.length; t++) {
                        if ($window.sessionStorage.uId == states[t].user.id) {
                            usrPos = t;
                            break;
                        }
                    }

                    if (usrPos === -1) {
                        throw "rootController: Illegal arguments";
                    }

                    if (states[usrPos].completed) {
                        projComplUser++;
                    }
                    docCompl = states[usrPos].completed;
                    lastEdit = states[usrPos].lastEdit;
                }
                // role: admin/ project manager
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

                const docTemplate = {
                    'id': doc.id,
                    'name': doc.name,
                    'states': states,
                    'completed': docCompl,
                    'lastEdit': lastEdit
                };
                documents.push(docTemplate);
            }
            // Sort the documents by their corresponding last edit timestamp
            // So that the latest changed document is the first
            documents.sort($rootScope.compareDocumentsByLastEdit);

            return projComplUser;
        };

        $rootScope.getUserIdIndexMap = function (users) {
            var userIdIndexMap = {};
            for (var k = 0; k < users.length; k++) {
                const user = users[k];
                userIdIndexMap[user.id] = k;
            }
            return userIdIndexMap;
        };

        $rootScope.containsUser = function (userList, user) {
            if (userList !== undefined) {
                for (var i = 0; i < userList.length; i++) {
                    if (userList[i].id == user.id) {
                        return true;
                    }
                }
            }
            return false;
        };

        $rootScope.getProjectByProjectName = function (projName, projects) {
            for (var i = 0; i < projects.length; i++) {
                const proj = projects[i];
                if (proj.name === projName) {
                    return proj;
                }
            }
            throw "rootController: Project not found";
        };
        
        $rootScope.getProjectByProjectId = function (projId, projects) {
            for (var i = 0; i < projects.length; i++) {
                var proj = projects[i];
                if (proj.id === projId) {
                    return proj;
                }
            }
            throw "rootController: Project not found";
        };

        $rootScope.getDocumentByDocumentId = function (docId, project) {
            for (var i = 0; i < project.documents.length; i++) {
                var doc = project.documents[i];
                if (doc.id == docId) {
                    return doc;
                }
            }
            throw "rootController: Document not found";
        };
        
        $rootScope.getSchemeBySchemeId = function (schemeId, schemes) {
            for (var i = 0; i < schemes.length; i++) {
                var scheme = schemes[i];
                if (scheme.id === schemeId) {
                    return scheme;
                }
            }
            throw "rootController: Scheme not found";
        };

        /**
         * 
         * @param {type} timeLogArr
         * @returns {String} String representation of the total logged time
         */
        $rootScope.calcTotalTime = function (timeLogArr) {
            var totalTime = 0;
            for (var i = 0; i < timeLogArr.length; i++) {
                totalTime += parseInt(timeLogArr[i].loggedtime);
            }
            var hours = Math.floor(totalTime / 60);
            var minutes = totalTime % 60;
            return "" + hours + "h " + minutes + "min";
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
         * @param {String} docName name
         * @param {String} projectName the Projects name
         * @param {Boolean} completed state of the document
         */
        $rootScope.initAnnoTool = function (docId, docName, projectName, completed) {
            $window.sessionStorage.docId = docId;
            $window.sessionStorage.title = docName;
            $window.sessionStorage.project = projectName;
            $window.sessionStorage.completed = completed;
        };

    }
]);