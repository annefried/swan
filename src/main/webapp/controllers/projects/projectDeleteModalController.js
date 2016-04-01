/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('app').controller('projectDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

    $scope.submit = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.deleteProject = function (projId) {
        $http.delete("discanno/project/" + projId).success(function (response) {
            for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                if ($rootScope.tableProjects[i].id === projId) {
                    $rootScope.tableProjects.splice(i, 1);
		    break;
                }
            }
	    for (var i = 0; i < $rootScope.projects.length; i++) {
                if ($rootScope.projects[i].id === projId) {
		    $rootScope.projects.splice(i, 1);
		    break;
		}
	    }
        }).error(function (response) {
            $rootScope.checkResponseStatusCode(response.status);
        });

        $uibModalInstance.close();
    };

});