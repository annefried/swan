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

        $rootScope.itemsPerPage = 5;            // this is a constant, backend and frontend must have the same value
        $rootScope.numberOfTotalProjects = 0;   // init with 0

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
                $rootScope.addAlert({type: 'danger', msg: 'No server connection or an internal server error occurred.'});
            }
        };

        $rootScope.redirectToLogin = function () {
            window.location = "/swan/signin.html";
        };

        $rootScope.validateSignedInUser = function () {
        	if ($window.sessionStorage.role != 'admin'
        			&& $window.sessionStorage.role != 'annotator'
	                && $window.sessionStorage.role != 'projectmanager') {
                $rootScope.redirectToLogin();
            }
        };

        $scope.getUser = function () {
            $scope.prename = $window.sessionStorage.prename;
            $scope.lastname = $window.sessionStorage.lastname;
            $scope.email = $window.sessionStorage.email;
            $scope.role = $window.sessionStorage.role;
        };

        // Explicit call here
        $rootScope.validateSignedInUser();
        $scope.getUser();
        $rootScope.isUnprivileged = $window.sessionStorage.isAnnotator;


        $scope.logout = function () {
            $http.post('swan/usermanagment/logout');
            $window.sessionStorage.uId = null;
            $window.sessionStorage.prename = null;
            $window.sessionStorage.lastname = null;
            $window.sessionStorage.email = null;
            $window.sessionStorage.role = null;
        };

        /**
         * Load projects depending on the user role from the backend.
         */
        $rootScope.loadProjects = function (page) {

        	const url = "swan/project/byuser/";

            var httpProjects = $http.get(url, {params:{userId: $window.sessionStorage.uId, page: page}})
                                    .success(function (response) {
            	$rootScope.projects = JSOG.parse(JSON.stringify(response)).projects;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            return httpProjects;
        };

		/**
		 * Load project from database by project id.
		 */
		$rootScope.loadProjectById = function (id) {

			const url = "swan/project/byId/" + id;

			var httpProject = $http.get(url).success(function (response) {
				$rootScope.currProj = JSOG.parse(JSON.stringify(response)).project;
			}).error(function (response) {
				$rootScope.checkResponseStatusCode(response.status);
			});

			return httpProject;
		};

        $rootScope.loadProjectsCount = function () {

            const url = "swan/project/count/byuser/" + $window.sessionStorage.uId;

            var httpProjects = $http.get(url).success(function (response) {
                $rootScope.numberOfTotalProjects = response;
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

            if ($scope.isUnprivileged === 'true') {
                $rootScope.buildTableProjectsUnprivileged();
            } else {
                $rootScope.buildTableProjectsPrivileged();
            }

        };

        $rootScope.buildTableProjectsPrivileged = function () {

            var currUser = {'id': parseInt($window.sessionStorage.uId)};

            for (var i = 0; i < $rootScope.projects.length; i++) {

                var proj = $rootScope.projects[i];

                const retVal = $scope.buildDocumentsPrivileged(proj);
				const documents = retVal.documents;
				const projComplAdmin = retVal.projComplAdmin;
                const template = {
                    'id': proj.id,
                    'name': proj.name,
                    'tokenizationLang': proj.lang,
                    'users': proj.users,
                    'completed': projComplAdmin,
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

        $rootScope.buildTableProjectsUnprivileged = function () {

            for (var i = 0; i < $rootScope.projects.length; i++) {

                var proj = $rootScope.projects[i];

                const retVal = $scope.buildDocumentsUnprivileged(proj);
				const documents = retVal.documents;
                const lastEditedDocument = retVal.lastEditedDocument;
                const projComplUser = retVal.projComplUser;
                const template = {
                    'id': proj.id,
                    'name': proj.name,
                    'users': proj.users,
                    'completed': projComplUser,
                    'scheme': proj.scheme,
                    'numberOfDocuments': proj.documents.length,
                    'documents': documents,
                    'pms': proj.projectManager,
                    'lastEditedDocument': lastEditedDocument
                };

                $rootScope.tableProjects.push(template);
            }

        };

        $scope.buildDocumentsPrivileged = function (proj) {

			var documents = [];

			var projComplAdmin = new Array(proj.users.length);
			for (var p = 0; p < projComplAdmin.length; p++) {
				projComplAdmin[p] = 0;
			}

            // Used to order the states in the same order as the
            // user array and therefore the completed array. Necessary for
            // the progress bars.
            const userIdIndexMap = $rootScope.getUserIdIndexMap(proj.users);

            for (var j = 0; j < proj.documents.length; j++) {

                const doc = proj.documents[j];
                var docCompl;
                var lastEdit = -1;

                const states = new Array(doc.states.length);
                if (doc.states.length !== proj.users.length) {
                    throw "rootController: States and users length differs";
                }

                for (var i = 0; i < doc.states.length; i++) {
                    const state = doc.states[i];
                    const index = userIdIndexMap[state.user.id];
                    if (index === undefined) {
                        throw "rootController: Unknown user";
                    } else {
                        states[index] = state;
                    }
                }

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

                const docTemplate = {
                    'id': doc.id,
                    'name': doc.name,
                    'states': states,
                    'completed': docCompl,
                    'lastEdit': lastEdit
                };
                documents.push(docTemplate);
            }
            // Sort the documents alphabetically
            documents.sort($rootScope.compareDocumentsByName);

            return {documents: documents, projComplAdmin: projComplAdmin};
        };

        $scope.buildDocumentsUnprivileged = function (proj) {

			var documents = [];

            var projComplUser = 0;
            var lastEditedDocComp = { lastEditedDocument: null, lastEdit: -1 };

            for (var j = 0; j < proj.documents.length; j++) {

                const doc = proj.documents[j];
                var docCompl;
                var lastEdit = -1;

                var stateTarget;
                for (var t = 0; t < doc.states.length; t++) {
                    const state = doc.states[t];
                    if ($window.sessionStorage.uId == state.user.id) {
                        stateTarget = state;
                        docCompl = state.completed;
                        lastEdit = state.lastEdit;
                        if (state.completed) {
                            projComplUser++;
                        }
                        break;
                    }
                }

                if (stateTarget == undefined) {
                    throw "rootController: No corresponding state object existing";
                }

                const docTemplate = {
                    'id': doc.id,
                    'name': doc.name,
                    'states': [stateTarget],
                    'completed': docCompl,
                    'lastEdit': lastEdit
                };
                documents.push(docTemplate);

				if (lastEdit > lastEditedDocComp.lastEdit) {
					lastEditedDocComp = { lastEditedDocument: docTemplate, lastEdit: lastEdit };
				}
            }
            // Sort the documents alphabetically
            documents.sort($rootScope.compareDocumentsByName);

            return {documents: documents, lastEditedDocument: lastEditedDocComp.lastEditedDocument, projComplUser: projComplUser};
        };

		$rootScope.buildDocumentsByAnnotator = function (proj, userId) {
			
			var documents = [];

			for (var j = 0; j < proj.documents.length; j++) {

				const doc = proj.documents[j];
				var docCompl;

				var stateTarget;
				for (var t = 0; t < doc.states.length; t++) {
					const state = doc.states[t];
					if (userId == state.user.id) {
						stateTarget = state;
						docCompl = state.completed;
						break;
					}
				}

				const docTemplate = {
					'id': doc.id,
					'name': doc.name,
					'completed': docCompl,
				};
				documents.push(docTemplate);
			}

			// Sort the documents alphabetically
			documents.sort($rootScope.compareDocumentsByName);
			
			return documents;
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

        $rootScope.getProjectByProjectId = function (projId, projects) {
            for (var i = 0; i < projects.length; i++) {
                var proj = projects[i];
                if (proj.id === projId) {
                    return proj;
                }
            }
            throw "rootController: Project not found";
        };

        $rootScope.getDocumentByDocumentId = function (docId, documents) {
            for (var i = 0; i < documents.length; i++) {
                var doc = documents[i];
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
         * Compares two documents by their lastEdit value. Can be used to
         * sort the documents in a project. (Not currently used.)
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
         * Compares two documents by their name. Used to
         * sort the documents in a project.
         *
         * @param {Document} doc1
         * @param {Document} doc2
         * @returns {Integer} return -1, 0 or 1
         *                  if doc2.name is less, equal or higher
         *                  than doc1.name
         */
        $rootScope.compareDocumentsByName = function (doc1, doc2) {
            const docname1 = doc1.name.toLowerCase();
            const docname2 = doc2.name.toLowerCase();
            if (docname1 < docname2) {
                return -1;
            } else if (docname1 > docname2) {
                return 1;
            } else {
                return 0;
            }
        };

        /**
         * Initialize the annotation tool
         *
         * @param {String} docId the document id to annotate
         * @param {String} docName name
		 * @param {String} projectId the project's id
         * @param {String} projectName the project's name
         * @param {String} tokenizationLang tokenization language of the project
         */
        $rootScope.initAnnoTool = function (docId, docName, projectId, projectName, tokenizationLang) {
            $window.sessionStorage.docId = docId;
            $window.sessionStorage.title = docName;
            $window.sessionStorage.projectId = projectId;
			$window.sessionStorage.projectName = projectName;
            $window.sessionStorage.tokenizationLang = tokenizationLang;
        };

    }
]);
