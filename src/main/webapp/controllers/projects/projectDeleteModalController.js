/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('projectDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

        $scope.submit = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.deleteProject = function (projId) {
            $http.delete("swan/project/" + projId).success(function (response) {

            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            // TODO this should be inside the success function
            // but currently the response takes too much time
            // first this issue has to be fixed:
            // https://github.com/annefried/discanno/issues/190
            for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                if ($rootScope.tableProjects[i].id === projId) {
                    $rootScope.tableProjects.splice(i, 1);
                    break;
                }
            }

            $uibModalInstance.close();
        };

    });