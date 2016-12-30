/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('userEditModalController', function ($rootScope, $scope, $http, $window, $uibModalInstance) {

        // to reset password via e-mail
        $scope.resetUserPassword = function () {
            var user = {'id': $rootScope.toEdit};
            $http.post('swan/user/reset/', user).success(function (response) {
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

            $http.put('swan/user/' + $rootScope.toEdit, password).success(function (response) {
                $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
            }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                    });

            $uibModalInstance.close();
        };

    });
