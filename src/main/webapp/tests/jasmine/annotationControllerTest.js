/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 * Created by Timo Guehring on 04.11.16.
 */
'use strict';
describe('Test annotationController', function () {
    beforeEach(angular.mock.module('app'));
    var $controller;
    // TODO outsource this data for common access in TypeScript style
    var users = [
        { id: 0 },
        { id: 1 },
        { id: 3 }
    ];
    var states1 = [
        {
            id: 0,
            completed: true,
            lastEdit: 1463320311345,
            user: users[0]
        },
        {
            id: 1,
            completed: true,
            lastEdit: 1463320311346,
            user: users[2]
        },
        {
            id: 2,
            completed: true,
            lastEdit: 1463320311347,
            user: users[1]
        }
    ];
    var states2 = [
        {
            id: 3,
            completed: false,
            lastEdit: 1463320311345,
            user: users[0]
        },
        {
            id: 4,
            completed: true,
            lastEdit: 1463320311346,
            user: users[1]
        },
        {
            id: 5,
            completed: false,
            lastEdit: 1463320311347,
            user: users[2]
        }
    ];
    var states3 = [
        {
            id: 6,
            completed: false,
            lastEdit: 1463320311345,
            user: users[2]
        },
        {
            id: 7,
            completed: true,
            lastEdit: 1463320311348,
            user: users[1]
        },
        {
            id: 8,
            completed: true,
            lastEdit: 1463320311343,
            user: users[0]
        }
    ];
    var documents = [
        {
            id: 1,
            name: 'Doc1',
            states: states1
        },
        {
            id: 5,
            name: 'John Lock',
            states: states2
        },
        {
            id: 169,
            name: 'Greek History',
            states: states3
        }
    ];
    var proj = {
        users: users,
        documents: documents
    };
    var scheme = {
        "name": "TemporalRelations_v1",
        "visElements": [
            {
                "visState": "hidden",
                "visKind": "timeline"
            },
            {
                "visState": "opened",
                "visKind": "graph"
            }
        ],
        "spanTypes": [
            {
                "name": "Situation"
            }
        ],
        "labelSets": [
            {
                "name": "Type",
                "exclusive": false,
                "appliesToSpanTypes": [
                    {
                        "name": "Situation"
                    }
                ],
                "labels": [
                    {
                        "name": "State"
                    },
                    {
                        "name": "Event"
                    },
                    {
                        "name": "Ongoing Event"
                    },
                    {
                        "name": "Habitual"
                    },
                    {
                        "name": "Generic Habitual"
                    },
                    {
                        "name": "TimeExpression"
                    },
                    {
                        "name": "Generic States"
                    }
                ]
            }
        ],
        "linkTypes": [
            {
                "name": "TLink",
                "startSpanType": {
                    "name": "Situation"
                },
                "endSpanType": {
                    "name": "Situation"
                },
                "linkLabels": [
                    {
                        "name": "after",
                        "options": []
                    },
                    {
                        "name": "before",
                        "options": []
                    },
                    {
                        "name": "overlap-undirected",
                        "options": []
                    },
                    {
                        "name": "overlap-includes",
                        "options": []
                    },
                    {
                        "name": "sequential",
                        "options": []
                    },
                    {
                        "name": "overlap-directed",
                        "options": []
                    }
                ]
            }
        ]
    };
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
            spyOn(schemeService, "getScheme").and.returnValue(scheme);
            spyOn(linkService, "getLinks").and.returnValue([]);
            spyOn(tokenService, "getTokens").and.returnValue([]);
            // this is very hacky
            $rootScope.loadProjectById = {};
            spyOn($rootScope, "loadProjectById").and.returnValue(proj);
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