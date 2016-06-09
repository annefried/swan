/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

/**
 * Responsible controller for the deletion of a scheme. Called upon clicking
 * 'x'-button of a scheme.
 */
angular
    .module('app')
    .controller('schemeDeleteModalController', function ($scope, $rootScope, $http, $sce, $uibModalInstance) {

        $scope.submit = function () {
            $http.delete("swan/scheme/" + $rootScope.currentSchemeId).success(function (response) {
                for (var i = 0; i < $rootScope.tableSchemes.length; i++) {
                    if ($rootScope.tableSchemes[i].id === $rootScope.currentSchemeId) {
                        $rootScope.tableSchemes.splice(i, 1);
                    }
                }
                $uibModalInstance.close();
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });