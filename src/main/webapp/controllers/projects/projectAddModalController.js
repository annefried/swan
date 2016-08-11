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
            // Available tokenization languages
            $scope.lanaguages = [ "Whitespace", "Characterwise", "Spanish", "English", "German", "French" ];
            $scope.loadSchemes();
            $scope.loadNames();
        };

        $scope.loadSchemes = function () {
            $http.get("swan/scheme/schemes").success(function (response) {
                $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        $scope.loadNames = function () {
            $http.get("swan/project/names").success(function (response) {
                $rootScope.names = JSOG.parse(JSON.stringify(response)).projects;
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
                for (var i = 0; i < $rootScope.names.length; i++) {
                    if (name == $rootScope.names[i]) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        };

        $scope.submit = function (name, scheme, lang) {
            var combine = {
                "name": name,
                "scheme": scheme,
                "lang": lang
            };
            $uibModalInstance.close(combine);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();

    });