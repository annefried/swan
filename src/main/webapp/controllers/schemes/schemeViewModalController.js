/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('schemeViewModalController', function ($scope, $rootScope, $uibModalInstance, UtilityService) {

        $scope.init = function () {
            $scope.loadScheme();
        };

        $scope.loadScheme = function () {
            // This is a little hack to make a deep copy of the scheme to delete some
            // attributes without changing the original reference
            var scheme = JSOG.parse(angular.toJson($rootScope.currentScheme));
            $scope.simplifyScheme(scheme);
            $scope.currentScheme = JSON.stringify(scheme, null, "\t");
        };

        /**
         * Simplifies the given scheme so that the scheme does not contain an id,
         * creator, projects and the link types and label sets are simplified. We
         * simplify the scheme to remove unnecessary information for the user and
         * make it more readable.
         *
         * @param scheme
         */
        $scope.simplifyScheme = function (scheme) {
            UtilityService.deleteIdProperty(scheme);
            delete scheme.creator;
            delete scheme.projects;

            UtilityService.deleteIdProperties(scheme.visElements);
            $scope.simplifyLabelSets(scheme.labelSets);
            $scope.simplifyLinkTypes(scheme.linkTypes);
        };

        /**
         * Simplifies the given link types so that they do not contain any ids and
         * the link labels are simplified.
         *
         * @param linkTypes
         */
        $scope.simplifyLinkTypes = function (linkTypes) {
            for (var j = 0; j < linkTypes.length; j++) {
                var curLinkType = linkTypes[j];

                UtilityService.deleteIdProperty(curLinkType);
                UtilityService.deleteIdProperties(curLinkType.linkLabels);
                delete curLinkType.allowUnlabeledLinks;
            }
        };

        /**
         * Simplifies the given label sets so that they do not contain any ids and
         * the span types and labels are simplified.
         *
         * @param labelSets
         */
        $scope.simplifyLabelSets = function (labelSets) {
            for (var j = 0; j < labelSets.length; j++) {
                var curLabelSet = labelSets[j];
                UtilityService.deleteIdProperty(curLabelSet);
                UtilityService.deleteIdProperties(curLabelSet.labels);
            }
        };

        $scope.submit = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();
    });
