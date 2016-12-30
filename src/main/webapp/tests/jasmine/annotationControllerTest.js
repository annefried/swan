/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
/**
 * Created by Timo Guehring on 04.11.16.
 */
describe('Test annotationController', function () {
    beforeEach(angular.mock.module('app'));
    var $controller;
    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    describe('Setup tests', function () {
        var controller, $injector, $scope, $rootScope, $window, $http, tokenService, getAnnotationService, linkService, schemeService;
        // For asynchronous statements and promises
        var $q;
        beforeEach(inject(function (_$controller_, $controller, _$injector_, _$q_, _$rootScope_, _$window_, _$http_, _tokenService_, _getAnnotationService_, _linkService_, _schemeService_) {
            $injector = _$injector_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $window = _$window_;
            $http = _$http_;
            tokenService = _tokenService_;
            getAnnotationService = _getAnnotationService_;
            linkService = _linkService_;
            schemeService = _schemeService_;
            $window.sessionStorage.role = 'annotator';
            $window.sessionStorage.isAnnotator = 'true';
            $window.sessionStorage.docId = '3';
            $window.sessionStorage.docId = '4';
            spyOn(getAnnotationService, "getAnnotations").and.returnValue([]);
            spyOn(schemeService, "getScheme").and.returnValue(testScheme);
            spyOn(linkService, "getLinks").and.returnValue([]);
            spyOn(tokenService, "getTokens").and.returnValue([]);
            // this is very hacky
            $rootScope.loadProjectById = {};
            spyOn($rootScope, "loadProjectById").and.returnValue(testProject);
            controller = $controller('annotationController', {
                $scope: $scope,
                $window: $window,
                $rootScope: $rootScope,
                $http: $http,
                tokenService: tokenService,
                getAnnotationService: getAnnotationService,
                textService: linkService,
                schemeService: schemeService,
                $q: $q
            });
        }));
        it('Empty test', function () {
            expect($controller).toBeDefined();
        });
    });
});
//# sourceMappingURL=annotationControllerTest.js.map