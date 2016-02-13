angular
        .module('app')
        .controller('dashboardController', ['$rootScope', '$scope', '$window', '$http', '$timeout', function ($rootScope, $scope, $window, $http, $timeout) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {
                    $timeout(function () {
                        $scope.visible = 'true'
                    }, 4000);

                    $rootScope.projectName = "DiscAnno";
                    $rootScope.isuser = ($window.sessionStorage.isUser);

                    $scope.prename = $window.sessionStorage.prename;
                    $scope.lastname = $window.sessionStorage.lastname;
                    $scope.role = $window.sessionStorage.role;

                    this.message = 'Hakuna Matata!';
                }

                $scope.logout = function () {
                    $http.post('tempannot/usermanagment/logout');
                    $window.sessionStorage.uId = null;
                    $window.sessionStorage.prename = null;
                    $window.sessionStorage.lastname = null;
                    $window.sessionStorage.email = null;
                    $window.sessionStorage.role = null;
                };

                $rootScope.alerts = [
                ];

                $rootScope.addAlert = function (alert) {
                    $rootScope.alerts.push(alert);
                };

                $rootScope.closeAlert = function (index) {
                    $rootScope.alerts.splice(index, 1);
                };

            }]);