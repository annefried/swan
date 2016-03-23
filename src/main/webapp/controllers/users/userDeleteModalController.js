'use strict';

angular.module('app').controller('userDeleteModalController', function ($scope, $rootScope, $http, $uibModalInstance) {

    $scope.deleteUser = function (userId) {
        $http.delete('discanno/user/' + userId).success(function () {
            $uibModalInstance.close(userId);
        }).error(function (response) {
            $rootScope.checkResponseStatusCode(response.status);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});


