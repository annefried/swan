'use strict';

angular.module('app').controller('userAddModalController', function ($scope, $rootScope, $http, $uibModalInstance) {

    // Called on submit
    $scope.createUser = function (prename, lastname, password, email, role) {

        var jsonTemplate = {
            "id": null,
            "prename": prename,
            "lastname": lastname,
            "password": password,
            "createdate": null,
            "email": email,
            "role": role
        };

        var user = {
            'prename': prename,
            'lastname': lastname,
            'role': role,
            'email': email,
            'loggedtime': 0,
            'undone': 0
        };

        $http.post('discanno/user', JSON.stringify(jsonTemplate))
                .then(function (response) {
                    user.id = response.data;
                    $uibModalInstance.close(user);
                });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});