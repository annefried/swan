/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('projectAddModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

        $scope.init = function () {
            $scope.loadSchemes();
        };

        $scope.loadSchemes = function () {
            $http.get("swan/scheme/schemes").success(function (response) {
                $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        /**
         * Checks whether the project name is already taken.
         * 
         * @param {type} name
         * @returns {Boolean}
         */
        $scope.hasError = function (name) {
            if (name) {
                for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                    var proj = $rootScope.tableProjects[i];
                    if (proj.name === name) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        };

        $scope.submit = function (name, scheme) {
            var combine = {
                'name': name,
                'scheme': scheme
            };
            $uibModalInstance.close(combine);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();

    });