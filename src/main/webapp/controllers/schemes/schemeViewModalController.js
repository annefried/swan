/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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
            delete scheme.colorScheme;

            UtilityService.deleteIdProperties(scheme.visElements);
            $scope.simplifySpanTypes(scheme.spanTypes);
            $scope.simplifyLabelSets(scheme.labelSets);
            $scope.simplifyLinkTypes(scheme.linkTypes);
        };

        /**
         * Simplifies the given span types so that they do not contain any ids
         * and empty fields.
         *
         * @param spanTypes
         */
        $scope.simplifySpanTypes = function (spanTypes) {
            for (var j = 0; j < spanTypes.length; j++) {
                var curSpanType = spanTypes[j];

                UtilityService.deleteIdProperty(curSpanType);
                delete curSpanType.labelSets;
            }
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
                delete curLinkType.allowUnlabeledLinks;
                delete curLinkType.nameParentSet;

                var startSpanType = curLinkType.startSpanType;
                UtilityService.deleteIdProperty(startSpanType);
                delete startSpanType.nameParentSet;

                var endSpanType = curLinkType.endSpanType;
                UtilityService.deleteIdProperty(endSpanType);
                delete endSpanType.nameParentSet;
                
                for (var k = 0; k < curLinkType.linkLabels.length; k++) {
                    var curLinkLabel = curLinkType.linkLabels[k];
                    UtilityService.deleteIdProperty(curLinkLabel);
                    delete curLinkLabel.nameParentSet;
                }
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
                delete curLabelSet.nameParentSet;

                for (var k = 0; k < curLabelSet.labels.length; k++) {
                    var curLabel = curLabelSet.labels[k];
                    UtilityService.deleteIdProperty(curLabel);
                    delete curLabel.nameParentSet;
                }

                for (var k = 0; k < curLabelSet.appliesToSpanTypes.length; k++) {
                    var curSpanType = curLabelSet.appliesToSpanTypes[k];
                    UtilityService.deleteIdProperty(curSpanType);
                    delete curSpanType.nameParentSet;
                }
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
