/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('profileEditModalController', function ($scope, $rootScope, $window, $http, $uibModalInstance) {
    
        $scope.changePassword = function (password) {

            $http.put('swan/user/' + $window.sessionStorage.uId, password).success(function (response) {
                $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });

            $uibModalInstance.close();
        };
    
    });
