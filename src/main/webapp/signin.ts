/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

module app.Controllers {

    export class LoginController {

        rootScope: ng.IRootScopeService;
        scope: ng.IScope;
        http: ng.IHttpService;
        window: ng.IWindowService;

        constructor($rootScope: ng.IRootScopeService, $scope: ng.IScope, $http: ng.IHttpService, $window: ng.IWindowService) {
            this.rootScope = $rootScope;
            this.scope = $scope;
            this.http = $http;
            this.window = $window;

            this.scope.credentials = {
                username: '',
                password: ''
            }
        }

        public login(credentials): void {
            var loginCtrl = this;
            this.http({
                method: 'POST',
                url: 'swan/usermanagment/login',
                data: $.param({email: credentials.username, password: credentials.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
                loginCtrl.scope.invalidLogin = true;
            });

        };

    }

    // Define the Angular module for our application.
    var app = angular.module("app", []);
    app.controller("LoginController", ["$rootScope", "$scope", "$http", "$window", LoginController]);

}
