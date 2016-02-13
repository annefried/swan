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
                        url: 'tempannot/usermanagment/login',
                        data: $.param({email: credentials.username, password: credentials.password}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (response) {
                        $window.sessionStorage.uId = response.user.id;
                        console.log($window.sessionStorage.uId);
                        $window.sessionStorage.prename = response.user.prename;
                        $window.sessionStorage.lastname = response.user.lastname;
                        $window.sessionStorage.email = response.user.email;
                        $window.sessionStorage.role = response.user.role;
                        $window.sessionStorage.isUser = (response.user.role == 'user');
                        $window.sessionStorage.h = 'false';

                        window.location = "/discanno/#/dashboard";
                    }).error(function (response) {
                        $scope.wrong = 'false';
                    });

                };
            }]);
