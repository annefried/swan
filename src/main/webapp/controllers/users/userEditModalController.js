/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('userEditModalController', function ($rootScope, $scope, $http, $window, $uibModalInstance) {

        // to reset password via e-mail
        $scope.resetUserPassword = function () {
            var user = {'id': $rootScope.toEdit};
            $http.post('swanold/user/reset/', user).success(function (response) {
                $rootScope.addAlert(
                    {
                        type: 'success',
                        msg: 'Password was reset succesfully. An E-Mail will be sent to the user with the new password.'
                    });
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            $uibModalInstance.close();
        };

        // to manually reset password for user
        $scope.changePassword = function (password) {

            $http.put('swanold/user/' + $rootScope.toEdit, password).success(function (response) {
                $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
            }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                    });

            $uibModalInstance.close();
        };

    });