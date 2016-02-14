
'use strict';

angular.module('app').controller('userEditModalController', function ($rootScope, $scope, $http, $window, $uibModalInstance) {

    $scope.editPassword = function (pw) {
        $http.put('tempannot/user/' + $rootScope.toEdit, pw).success(function (response) {
            $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
        }).error(function (response) {
            $rootScope.addAlert({type: 'danger', msg: 'Sorry something went wrong:('});
        });

        $uibModalInstance.close();
    };
});