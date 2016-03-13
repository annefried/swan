angular
        .module('app')
        .controller('profileController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', function ($scope, $rootScope, $window, $http, $uibModal) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'annotator') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {

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
                        $http.get("tempannot/timelogging/" + $scope.userId).then(function (response) {
                            $scope.tilog = JSOG.parse(JSON.stringify(response.data)).timelogging;
                            $scope.calcTotalTime();
                        });
                    };

                    $scope.calcTotalTime = function () {
                        $scope.totalTime = 0;
                        for (var i = 0; i < $scope.tilog.length; i++) {
                            $scope.totalTime += parseInt($scope.tilog[i].loggedtime);
                        }
                        var hours = Math.floor($scope.totalTime / 60);
                        var minutes = $scope.totalTime % 60;
                        $scope.totalTime = "" + hours + "h " + minutes + "min";
                    };

                    $scope.addTimeLogging = function () {

                        var loggedTime = $scope.val;

                        if (parseInt(loggedTime) <= 0 || parseInt(loggedTime) > 400) {
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
                                'loggedat': loggedAt,
                                'loggedtime': loggedTime
                            };
                            var jsonStr = JSON.stringify(json);

                            $http.post("tempannot/timelogging", jsonStr).then(function (response) {
                                if (response.status == 200) {
                                    $scope.tilog.push(jsonForTable);
                                    $rootScope.addAlert({type: 'success', msg: 'Time logged!'});
                                    $scope.calcTotalTime();
                                } else {
                                    $rootScope.addAlert({type: 'danger', msg: 'No server connection'});
                                }
                            });
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

angular.module('app').directive('numbersOnly', function () {
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

angular.module('app').controller('profileEditModalController', function ($scope, $rootScope, $window, $http, $uibModalInstance) {
    
    $scope.changePassword = function (password) {

        $http.put('tempannot/user/' + $window.sessionStorage.uId, password).success(function (response) {
            $rootScope.addAlert({type: 'success', msg: 'Password changed succesfully.'});
        }).error(function (response) {
            $rootScope.addAlert({type: 'danger', msg: 'Sorry something went wrong:('});
        });
        
        $uibModalInstance.close();
    };
    
});
