/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('app').controller('documentDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

    $scope.submit = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    /**
     * Called upon clicking the 'x'-Button in a documents row.
     * @param {type} documentId the documents id
     * @param {type} projId the projects id
     */
    $scope.deleteDocument = function (documentId, projId) {
        $http.delete("discanno/document/" + documentId).then(function (response) {
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
            $rootScope.checkResponseStatusCode(err.status);
        });
        
        $uibModalInstance.close();
    };

});

