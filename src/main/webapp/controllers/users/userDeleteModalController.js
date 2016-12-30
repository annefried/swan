/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('userDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance) {

        $scope.deleteUser = function (userId) {
            $http.delete('swan/user/' + userId).success(function () {
                $uibModalInstance.close(userId);
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


