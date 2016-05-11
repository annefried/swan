/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('profileEditModalController', function ($scope, $rootScope, $window, $http, $uibModalInstance) {
    
        $scope.changePassword = function (password) {

            $http.put('discanno/user/' + $window.sessionStorage.uId, password).success(function (response) {
                $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            $uibModalInstance.close();
        };
    
    });