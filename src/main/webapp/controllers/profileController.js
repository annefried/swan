/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('profileController', ['$scope', '$rootScope', '$window', '$http', '$uibModal',
    function ($scope, $rootScope, $window, $http, $uibModal) {

        if (($window.sessionStorage.role != 'admin')
            && ($window.sessionStorage.role != 'annotator')
            && ($window.sessionStorage.role != 'projectmanager')) {

            $rootScope.redirectToLogin();
        } else {

            var monthMapNumName = {};
            monthMapNumName[1] = "Jan";
            monthMapNumName[2] = "Feb";
            monthMapNumName[3] = "Mar";
            monthMapNumName[4] = "Apr";
            monthMapNumName[5] = "May";
            monthMapNumName[6] = "Jun";
            monthMapNumName[7] = "Jul";
            monthMapNumName[8] = "Aug";
            monthMapNumName[9] = "Sep";
            monthMapNumName[10] = "Nov";
            monthMapNumName[11] = "Oct";
            monthMapNumName[12] = "Dec";

            var monthMapNameNum = {};
            monthMapNameNum["Jan"] = 1;
            monthMapNameNum["Feb"] = 2;
            monthMapNameNum["Mar"] = 3;
            monthMapNameNum["Apr"] = 4;
            monthMapNameNum["May"] = 5;
            monthMapNameNum["Jun"] = 6;
            monthMapNameNum["Jul"] = 7;
            monthMapNameNum["Aug"] = 8;
            monthMapNameNum["Sep"] = 9;
            monthMapNameNum["Nov"] = 10;
            monthMapNameNum["Oct"] = 11;
            monthMapNameNum["Dec"] = 12;

            $scope.dropDownSelection = "No filter";

            $scope.userId = $window.sessionStorage.uId;

            $scope.init = function () {
                $scope.getUser();
                $scope.getTime();

                if ($rootScope.tour !== undefined) {
                    $rootScope.tour.resume();
                }
            };

            $scope.getUser = function () {
                $scope.prename = $window.sessionStorage.prename;
                $scope.lastname = $window.sessionStorage.lastname;
                $scope.email = $window.sessionStorage.email;
                $scope.role = $window.sessionStorage.role;
            };

            $scope.getTime = function () {
                $scope.tilog = [];
                $http.get("discanno/timelogging/" + $scope.userId).success(function (response) {
                    $scope.tilog = JSOG.parse(JSON.stringify(response)).timelogging;
                    $scope.origTilog = $scope.tilog;
                    $scope.totalTime = $scope.calcTotalTime($scope.origTilog.length - 1);
                    $scope.totalTimeSinceTimeStep = $scope.totalTime;
                    $scope.getTimeSteps();
                }).error(function (response) {
                    $rootScope.checkResponseStatusCode(response.status);
                });
            };

            $scope.getTimeSteps = function () {

                function myObj(name) {
                    this.name = name;
                }
                myObj.prototype.toString = function(){ return this.name; }

                var timeSteps = {};

                for (var i = 0; i < $scope.tilog.length; i++) {
                    var timelog = $scope.tilog[i];
                    var date = new Date(timelog.loggedat);
                    var mon = date.getMonth() + 1;
                    var year = date.getFullYear();
                    timeSteps[new myObj(monthMapNumName[mon] + " " + year)] = monthMapNumName[mon] + " " + year;
                }

                var timeStepsArr = [];

                for (var entry in timeSteps) {
                    timeStepsArr.push(entry.toString());
                }

                $scope.timeSteps = timeStepsArr;
            };

            $scope.calcTotalTime = function (start) {
                var totalTime = 0;
                for (var i = start; i < $scope.origTilog.length && i >= 0; i--) {
                    totalTime += parseInt($scope.origTilog[i].loggedtime);
                }
                var hours = Math.floor(totalTime / 60);
                var minutes = totalTime % 60;
                return "" + hours + "h " + minutes + "min";
            };

            $scope.addTimeLogging = function () {

                var loggedMin = $scope.loggedMinutes === undefined ? 0 : parseInt($scope.loggedMinutes);
                var loggedHours = $scope.loggedHours === undefined ? 0 : parseInt($scope.loggedHours);

                var loggedTime = parseInt(loggedHours) * 60 + parseInt(loggedMin);

                if (parseInt(loggedTime) <= 0
                    || parseInt(loggedTime) > 400) {
                    $rootScope.addAlert({type: 'danger', msg: 'Please log a time between 0 and 400 minutes.'});
                } else {
                    var loggedAt = Date.now();
                    var user_fk = $scope.userId;
                    var json = {
                        "loggedtime": loggedTime,
                        "loggedat": loggedAt,
                        "users": {
                            "id": user_fk
                        },
                        "id": null
                    };
                    var jsonForTable = {
                        'id': undefined,
                        'loggedat': loggedAt,
                        'loggedtime': loggedTime
                    };
                    var jsonStr = JSON.stringify(json);

                    $http.post("discanno/timelogging", jsonStr).success(function (response) {
                        jsonForTable.id = response;
                        $scope.origTilog.push(jsonForTable);
                        $rootScope.addAlert({type: 'success', msg: 'Time logged!'});
                        $scope.totalTime = $scope.calcTotalTime($scope.origTilog.length - 1);
                        $scope.onDropDownTimeStepChange($scope.dropDownSelection);
                        $scope.getTimeSteps();
                    }).error(function (response) {
                        $rootScope.checkResponseStatusCode(response.status);
                    });
                }

            };

            $scope.onDropDownTimeStepChange = function (timeStep) {

                if (timeStep === undefined) {

                } else if (timeStep === "No filter") {
                    $scope.dropDownSelection = "No filter";
                    $scope.tilog = $scope.origTilog;
                    $scope.totalTimeSinceTimeStep = $scope.totalTime;
                } else {
                    $scope.dropDownSelection = timeStep;

                    var mon = timeStep.substring(0, 3);
                    var year = parseInt(timeStep.substring(4, 8));

                    var monInt = monthMapNameNum[mon];

                    var endIdx = $scope.origTilog.length;
                    for (var i = 0; i < $scope.origTilog.length; i++) {
                        var date = new Date($scope.origTilog[i].loggedat);

                        if (date.getFullYear() < year
                                || (date.getFullYear() === year && date.getMonth() + 1 < monInt)) {
                            endIdx = i;
                            break;
                        }
                    }

                    $scope.tilog = $scope.origTilog.slice(0, endIdx);
                    $scope.totalTimeSinceTimeStep = $scope.calcTotalTime(endIdx - 1);
                }

            };

            $scope.openProfileEditModal = function () {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'templates/profileEditModal.html',
                    controller: 'profileEditModalController'
                });

                modalInstance.result.then(function (response) {

                });
                $scope.toggleAnimation = function () {
                    $scope.animationsEnabled = !$scope.animationsEnabled;
                };
            };

            $scope.init();

        }
    }
]);

angular
    .module('app')
    .directive('numbersOnly', function () {
        
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });

angular
    .module('app')
    .controller('profileEditModalController', function ($scope, $rootScope, $window, $http, $uibModalInstance) {
    
        $scope.changePassword = function (password) {

            $http.put('discanno/user/' + $window.sessionStorage.uId, password).success(function (response) {
                $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
            }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                    });

            $uibModalInstance.close();
        };
    
    });
