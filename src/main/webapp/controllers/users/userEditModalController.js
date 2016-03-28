
'use strict';

angular.module('app').controller('userEditModalController', function ($rootScope, $scope, $http, $window, $uibModalInstance) {

    $scope.resetUserPassword = function () {
        var user = {'id': $rootScope.toEdit};
        $http.post('discanno/user/reset/', user).success(function (response) {
            $rootScope.addAlert({type: 'success', msg: 'Password was reset succesfully. An E-Mail will be sent to the user with the new password.'});
        }).error(function (response) {
            $rootScope.checkResponseStatusCode(response.status);
        });

        $uibModalInstance.close();
    };
    
});