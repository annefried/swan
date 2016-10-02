/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var app;
(function (app_1) {
    var Controllers;
    (function (Controllers) {
        var LoginController = (function () {
            function LoginController($rootScope, $scope, $http, $window) {
                this.rootScope = $rootScope;
                this.scope = $scope;
                this.http = $http;
                this.window = $window;
                this.scope.credentials = {
                    username: '',
                    password: ''
                };
            }
            LoginController.prototype.login = function (credentials) {
                this.http({
                    method: 'POST',
                    url: 'swan/usermanagment/login',
                    data: $.param({ email: credentials.username, password: credentials.password }),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function (response) {
                    window.sessionStorage.uId = response.user.id;
                    window.sessionStorage.prename = response.user.prename;
                    window.sessionStorage.lastname = response.user.lastname;
                    window.sessionStorage.email = response.user.email;
                    window.sessionStorage.role = response.user.role;
                    window.sessionStorage.isAnnotator = (response.user.role === 'annotator');
                    window.sessionStorage.h = 'false';
                    window.location = "/swan/#/dashboard";
                }).error(function (response) {
                    this.scope.wrong = 'false';
                });
            };
            ;
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
        // Define the Angular module for our application.
        var app = angular.module("app", []);
        app.controller("LoginController", ["$rootScope", "$scope", "$http", "$window", LoginController]);
    })(Controllers = app_1.Controllers || (app_1.Controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=signin.js.map