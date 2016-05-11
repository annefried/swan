/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
            $http.delete("discanno/document/" + documentId).success(function (response) {
            	
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

