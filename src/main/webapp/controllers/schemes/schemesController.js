/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('schemesController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$location', '$q',
    function ($scope, $rootScope, $window, $http, $uibModal, $location, $q) {

    	$rootScope.validateSignedInUser();

        /**
         * Called at the end of Controller construction.
         * Initializes fields with data from Server.
         */
        $scope.init = function () {
            $scope.loaded = false;
            var httpProjects = $scope.loadProjects2();
            var httpSchemes = $scope.loadSchemes();
            $q.all([httpSchemes, httpProjects]).then(function () {
                $scope.loaded = true;
                $scope.buildTableSchemes();
            });

            if ($rootScope.tour !== undefined) {
                $rootScope.tour.resume();
            }
        };

        /**
         * Request list of all schemes.
         * @returns http-Object of query
         */
        $scope.loadSchemes = function () {
            var httpSchemes = $http.get("discanno/scheme/schemes").success(function (response) {
                $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
            }).error(function (response) {
                if (response == "") {
                    $rootScope.redirectToLogin();
                }
            });
            return httpSchemes;
        };

        /**
         * TODO refactor
         *
         * Request list of all Projects.
         * @returns http-Object of query
         */
        $scope.loadProjects2 = function () {
            const url = "discanno/project/byuser/" + $window.sessionStorage.uId;
            
            var httpProjects = $http.get(url).success(function (response) {
                $scope.projects = JSOG.parse(JSON.stringify(response)).projects;
            }).error(function (response) {
                if (response == "") {
                    $rootScope.redirectToLogin();
                }
            });
            return httpProjects;
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
                    'name': scheme.name,
                    'creator': scheme.creator,
                    'projects': newProjects,
                    'tableIndex': $scope.schemeCounter,
                    'labelSetCount': scheme.labelSets.length,
                    'linkSetCount': scheme.linkSets.length
                };
                this.tableSchemes.push(schemePreview);

            }

            $rootScope.tableSchemes = this.tableSchemes;
        };

        $scope.isDeletingPossible = function (scheme) {
            return scheme.projects.length < 1
                && ($window.sessionStorage.role == 'admin'
                    || ($window.sessionStorage.role == 'projectmanager'
                        && scheme.creator != null
                        && scheme.creator.id == $window.sessionStorage.uId));
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
]);



