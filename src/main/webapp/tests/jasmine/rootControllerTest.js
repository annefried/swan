/**
 * Created by Timo Guehring on 11.05.16.
 */
'use strict';

describe('rootController', function() {
    beforeEach(module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('test test test', function() {
        var controller, $scope, $rootScope, $window, $http, $timeout;

        beforeEach(inject(function(_$controller_, $controller,  _$rootScope_, _$window_, _$http_, _$timeout_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new;
            $window = _$window_;
            $http = _$http_;
            $timeout = _$timeout_;

            $window.sessionStorage.role = 'annotator';

            controller = $controller('rootController',
                {
                    $rootScope: $rootScope,
                    $scope: $scope,
                    $window: $window,
                    $http: $http,
                    $timeout: $timeout
                });
        }));

        it('Check response status code: 403', function() {
            expect($controller).toBeDefined();
            expect($rootScope.alerts.length).toEqual(0);

            spyOn($rootScope, 'redirectToLogin');

            $rootScope.checkResponseStatusCode(403);

            expect($rootScope.alerts.length).toEqual(0);
            expect($rootScope.redirectToLogin).toHaveBeenCalled();
        });

        it('Check response status code: 400', function() {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(400);

            expect($rootScope.alerts.length).toEqual(1);

            var alert = $rootScope.alerts[0];

            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('This action is not allowed.');
        });

        it('Check response status code: 500', function() {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(500);

            expect($rootScope.alerts.length).toEqual(1);

            var alert = $rootScope.alerts[0];

            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('No server connection.');
            
        });

        it('Check response status code: 600', function() {
            expect($controller).toBeDefined();

            expect($rootScope.alerts.length).toEqual(0);

            $window.sessionStorage.role = 'annotator';
            $rootScope.checkResponseStatusCode(600);

            expect($rootScope.alerts.length).toEqual(0);
        });

    });
});