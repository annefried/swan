/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('documentDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

        $scope.submit = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * Called upon clicking the 'x'-Button in a documents row.
         * 
         * @param {type} documentId the documents id
         * @param {type} projId the projects id
         */
        $scope.deleteDocument = function (documentId, projId) {
            $http.delete("swan/document/" + documentId).success(function (response) {
            	
            	const project = $rootScope.getProjectByProjectId(projId, $rootScope.tableProjects);
            	
            	// Remove document from project
                for (var i = 0; i < project.documents.length; i++) {
                	const doc = project.documents[i];
                    if (doc.id === documentId) {
                    	for (var s = 0; s < doc.states.length; s++) {
                    		const state = doc.states[s];
                    		if (state.completed && project.completed[s] > 0) {
                    			project.completed[s]--;
                    		}
                    	}
                        project.documents.splice(i, 1);
                        break;
                    }
                }
                
                project.numberOfDocuments--;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            $uibModalInstance.close();
        };

    });

