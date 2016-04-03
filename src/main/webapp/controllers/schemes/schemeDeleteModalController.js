/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

/**
 * Called upon clicking 'x'-Button of a Scheme.
 * $rootScope.currentSchemeId : id of Scheme that will be deleted.
 */
angular.module('app').controller('schemeDeleteModalController', function ($scope, $rootScope, $http, $sce, $uibModalInstance) {


    $scope.submit = function () {
        $http.delete("discanno/scheme/" + $rootScope.currentSchemeId).success(function (response) {
            for (var k = 0; k < $rootScope.tableSchemes.length; k++) {
                if ($rootScope.tableSchemes[k].id === $rootScope.currentSchemeId) {
                    $rootScope.tableSchemes.splice(k, 1);
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