/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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
                for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                    if ($rootScope.tableProjects[i].id === projId) {
                        $rootScope.tableProjects.splice(i, 1);
                        break;
                    }
                }
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            $uibModalInstance.close();
        };

    });
