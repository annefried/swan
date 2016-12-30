/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('userAddModalController', function ($scope, $rootScope, $http, $window, $uibModalInstance) {

        // Initialize User View
        $scope.init = function () {
            $scope.role = $window.sessionStorage.role;
            $scope.availableRoles = [{name: "Annotator", value: "annotator"}];
            if ($scope.role === "admin") {
                $scope.availableRoles.push({value: "admin", name: "Admin"});
                $scope.availableRoles.push({name: "Project manager", value: "projectmanager"});
            }

        };

        // Called on submit
        $scope.createUser = function (prename, lastname, password, email, role) {

            // TODO: use ui-validate before allowing to add user?
            $http.get("swan/user").success(function (response) {

                // update the list of users
                var res = JSOG.parse(JSON.stringify(response));
                $scope.users = res.users;

                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].email === email) {
                        $rootScope.addAlert({type: 'danger', msg: 'A user with this email address exists already.'});
                        // user exists, do not send adding request
                        return;
                    }
                }

                // create new user
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

                $http.post('swan/user', JSON.stringify(jsonTemplate)).then(function (response) {
                    user.id = response.data;
                    $uibModalInstance.close(user);
                }, function () {
                    $rootScope.addAlert({type: 'danger', msg: 'A user with this email address exists already.'});
                });

            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        // Initialize View
        $scope.init();
    });
