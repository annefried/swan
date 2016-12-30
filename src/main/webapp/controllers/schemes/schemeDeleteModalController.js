/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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
