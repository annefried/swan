
'use strict';

angular
        .module('app')
        .controller('schemesController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$location', '$q', function ($scope, $rootScope, $window, $http, $uibModal, $location, $q) {

                // Redirect if client is not logged in
                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {

                    /**
                     * Called at the end of Controller construction.
                     * Initializes fields with data from Server.
                     */
                    $scope.init = function () {
                        $scope.loaded = false;
                        var httpProjects = $scope.loadProjects();
                        var httpSchemes = $scope.loadSchemes();
                        $q.all([httpSchemes, httpProjects]).then(function () {
                            $scope.loaded = true;
                            $scope.buildTableSchemes();
                        });
                    };

                    /**
                     * Request list of all Projects.
                     * @returns http-Object of query
                     */
                    $scope.loadProjects = function () {
                        var httpProjects = $http.get("tempannot/project").then(function (response) {
                            $scope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                        }, function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                        });
                        return httpProjects;
                    };


                    /**
                     * Request list of all Schemes.
                     * @returns http-Object of query
                     */
                    $scope.loadSchemes = function () {
                        var httpSchemes = $http.get("tempannot/scheme/schemes").success(function (response) {
                            $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
                        }).error(function (response) {
                            $rootScope.addAlert({type: 'danger', msg: 'No connection to server'});
                        });
                        return httpSchemes;
                    };

                    /**
                     * Construct displayed table from Scheme and Project information.
                     */
                    $scope.buildTableSchemes = function () {
                        this.tableSchemes = [];
                        $rootScope.schemesTable = {};
                        $scope.schemeCounter = 0;

                        for (var i = 0; i < $scope.schemes.length; i++) {
                            var scheme = this.schemes[i];
                            $rootScope.schemesTable[scheme.name] = scheme;
                            var newProjects = [];
                            for (var j = 0; j < $scope.projects.length; j++) {
                                if ($scope.projects[j].scheme.name === scheme.name) {
                                    newProjects.push($scope.projects[j]);
                                }
                            }
                            var schemePreview = {
                                'id': scheme.id,
                                'projects': newProjects,
                                'tableIndex': $scope.schemeCounter,
                                'name': scheme.name,
                                'labelSetCount': scheme.labelSets.length,
                                'linkSetCount': scheme.linkSets.length
                            };
                            this.tableSchemes.push(schemePreview);

                        }

                        $rootScope.tableSchemes = this.tableSchemes;
                    };

                    /******************
                     *******Modals*****
                     *******************/

                    /**
                     * Called upon clicking 'x'-Button of a Scheme.
                     * Opens Modal, asking the user to confirm her action.
                     * @param {int} id of Scheme that will be deleted.
                     */
                    $scope.openSchemeDeleteModal = function (id) {
                        $rootScope.currentSchemeId = id;
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/schemes/schemeDeleteModal.html',
                            controller: 'schemeDeleteModalController'
                        });

                        modalInstance.result.then(function (response) {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };

                    };

                    /**
                     * Called upon clicking '+ Scheme'-Button.
                     * Opens the Scheme-Builder Modal.
                     */
                    $scope.openUploadSchemeModal = function () {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/schemes/schemeUploadModal.html',
                            controller: 'schemeUploadModalController',
                            size: 'lg'
                        });

                        modalInstance.result.then(function (response) {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    /**
                     * Called upon clicking the 'Page'-Glyphicon.
                     * Opens the Scheme-View Modal.
                     * @param {type} name
                     */
                    $scope.openSchemeViewModal = function (name) {
                        $rootScope.currentScheme = $rootScope.schemesTable[name];
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'templates/schemes/schemeViewModal.html',
                            controller: 'schemeViewModalController'
                        });

                        modalInstance.result.then(function (response) {

                        });
                        $scope.toggleAnimation = function () {
                            $scope.animationsEnabled = !$scope.animationsEnabled;
                        };
                    };

                    $scope.init();
                }
            }]);



