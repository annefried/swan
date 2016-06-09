/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app', [])
    .controller('LoginController', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {

        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.login = function (credentials) {
            $http({
                method: 'POST',
                url: 'swan/usermanagment/login',
                data: $.param({email: credentials.username, password: credentials.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (response) {
                $window.sessionStorage.uId = response.user.id;
                $window.sessionStorage.prename = response.user.prename;
                $window.sessionStorage.lastname = response.user.lastname;
                $window.sessionStorage.email = response.user.email;
                $window.sessionStorage.role = response.user.role;
                $window.sessionStorage.isAnnotator = (response.user.role === 'annotator');
                $window.sessionStorage.h = 'false';

                window.location = "/swan/#/dashboard";
            }).error(function (response) {
                $scope.wrong = 'false';
            });

        };
    }
]);
