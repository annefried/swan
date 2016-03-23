'use strict';

/**
 * Called upon clicking 'x'-Button of a Scheme.
 * $rootScope.currentSchemeId : id of Scheme that will be deleted.
 */
angular.module('app').controller('schemeDeleteModalController', function ($scope, $rootScope, $http, $sce, $uibModalInstance) {


    $scope.submit = function () {
        $http.delete("discanno/scheme/" + $rootScope.currentSchemeId).then(function (response) {
            for (var k = 0; k < $rootScope.tableSchemes.length; k++) {
                if ($rootScope.tableSchemes[k].id === $rootScope.currentSchemeId) {
                    $rootScope.tableSchemes.splice(k, 1);
                }
            }
            $uibModalInstance.close();
        }, function (err) {
            $rootScope.checkResponseStatusCode(err.status);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});