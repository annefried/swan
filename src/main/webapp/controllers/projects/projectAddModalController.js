/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('app').controller('projectAddModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

    $scope.init = function () {
        $scope.loadSchemes();
    };

    $scope.loadSchemes = function () {
        $http.get("discanno/scheme/schemes").success(function (response) {
            $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
        }).error(function (response) {
            $rootScope.checkResponseStatusCode(response.status);
        });
    };
    //if someone misses the "sendScheme" code that was commented here, checkout commit 5c189c3f8652aac

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


