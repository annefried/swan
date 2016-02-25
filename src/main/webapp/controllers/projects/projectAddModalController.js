'use strict';

angular.module('app').controller('projectAddModalController', function ($scope, $rootScope, $http, $uibModalInstance, hotkeys) {

    $scope.init = function () {
        $scope.loadSchemes();
    };

    $scope.loadSchemes = function () {
        $http.get("tempannot/scheme/schemes").then(function (response) {
            $scope.schemes = JSOG.parse(JSON.stringify(response.data)).schemes;
        }, function (err) {
            $rootScope.addAlert({type: 'danger', msg: 'No connection to server'});
        });
    };
    //if someone misses the "sendScheme" code that was commented here, checkout commit 5c189c3f8652aac

    $scope.submit = function (name, scheme) {
        var combine = {
            'name': name,
            'scheme': scheme
        };
        $uibModalInstance.close(combine);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();

});

