'use strict';

angular
        .module('app')
        .controller('annotatorsController', ['$rootScope', '$scope', '$http', '$window', '$uibModal', '$q', 'hotkeys', function ($rootScope, $scope, $http, $window, $uibModal, $q, hotkeys) {
                $scope.isuser = $window.sessionStorage.isUser;
                // Redirect non Admins
                if (($window.sessionStorage.role !== 'admin') && ($window.sessionStorage.role !== 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    // redirect to Login
                    window.location = "/discanno/signin.html";
                } else {

                    // Initialise User View
                    $scope.init = function () {
                        $scope.loaded = false;
                        //Pop Up
                        $scope.animationsEnabled = true;
                        $scope.getUsers();
                    };

                    // Request list of users from backend
                    $scope.getUsers = function () {
                        $http.get("tempannot/user").then(function (response) {
                            var res = JSOG.parse(JSON.stringify(response.data));
                            $scope.users = res.users;
                            for (var i = 0; i < $scope.users.length; i++) {
                                $scope.enhanceUserData($scope.users[i], i);
                            }
                            $scope.loaded = true;
                        });

                    };

                    $scope.isVisible = function (user) {
                        return user.id != $window.sessionStorage.uId;
                    };

                    $scope.enhanceUserData = function (u, i) {
                        var projReq = $http.get("tempannot/project/byuser/" + u.id).then(function (response) {
                            $scope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                        });
                        var timeReq = $http.get("tempannot/timelogging/" + u.id).then(function (response) {
                            $scope.tilog = JSOG.parse(JSON.stringify(response.data)).timelogging;
                        });

                        $q.all([projReq, timeReq]).then(function (ret, ret2) {
                            var dUndone = 0;
                            for (var k = 0; k < $scope.projects.length; k++) {
                                var proj = $scope.projects[k];
                                for (var j = 0; j < proj.documents.length; j++) {
                                    var doc = proj.documents[j];
                                    for (var t = 0; t < proj.users.length; t++) {
                                        var state = doc.states[t]
                                        if (u.id == state.user.id
                                                && !state.completed) {
                                            dUndone++;
                                        }
                                    }
                                }
                            }
                            var loggedTime = 0;
                            for (var jt = 0; jt < $scope.tilog.length; jt++) {
                                loggedTime = loggedTime + 0 + $scope.tilog [jt].loggedtime;
                            }
                            var user = {
                                'id': u.id,
                                'prename': u.prename,
                                'lastname': u.lastname,
                                'role': u.role,
                                'email': u.email,
                                'loggedtime': loggedTime,
                                'undone': dUndone
                            };
                            $scope.users[i] = user;
                            $scope.role = $window.sessionStorage.role;

                        });
                    };


                    $scope.getLoggedTime = function (u) {

                    };


                    $scope.getUndonDocs = function (u) {

                    };


                    // *********************
                    // Callbacks for Buttons
                    // *********************

                    hotkeys.bindTo($scope)
                            .add({
                                combo: '+',
                                description: 'Adding a new User',
                                callback: function () {
                                    $scope.open();
                                }
                            });

                    hotkeys.bindTo($scope)
                            .add({
                                combo: '+',
                                description: 'Adding a new User',
                                callback: function () {
                                    $scope.open();
                                }
                            });

                    hotkeys.bindTo($scope)
                            .add({
                                combo: '+',
                                description: 'Adding a new User',
                                callback: function () {
                                    $scope.open();
                                }
                            });

                    // Function to open modal
                    $scope.openUserAddModal = function (size) {

                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/users/userAddModal.html',
                            controller: 'userAddModalController',
                            size: size
                        });
                        // Callback on Submit
                        modalInstance.result.then(function (response) {
                            $scope.users.push(response);
                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    $scope.openUserDeleteModal = function (userDeleteId) {
                        $rootScope.userDeleteId = userDeleteId;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/users/userDeleteModal.html',
                            controller: 'userDeleteModalController'
                        });

                        modalInstance.result.then(function (response) {
                            for (var i = 0; i < $scope.users.length; i++) {
                                if ($scope.users[i].id === response) {
                                    $scope.users.splice(i, 1);
                                }
                            }
                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    $scope.openUserEditModal = function (userID) {
                        $rootScope.toEdit = userID;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/users/userEditModal.html',
                            controller: 'userEditModalController'
                        });

                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    // Initialise View
                    $scope.init();

                }
            }]);
