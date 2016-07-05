/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('schemeViewModalController', function ($scope, $rootScope, $uibModalInstance) {

        $scope.init = function () {
            $scope.loadScheme();
        };

        $scope.loadScheme = function () {

            // This is a little hack to make a deep copy of the scheme to delete some
            // attributes without changing the original reference
            var scheme = JSON.parse(JSON.stringify($rootScope.currentScheme));

            // remove things that we don't want to display
            delete scheme.id;
            delete scheme.creator;
            delete scheme.projects;


            var spanTypesSimple = [];
            for (var j = 0; j < scheme.spanTypes.length; j++) {
                spanTypesSimple.push(scheme.spanTypes[j].name);
            }
            scheme.spanTypes = spanTypesSimple;
            scheme.linkTypes = scheme.linkSets;

            for (var j = 0; j < scheme.labelSets.length; j++) {
                var curLabelSet = scheme.labelSets[j];
                delete curLabelSet.id;
                var spanTypesSimpleOfLabelSet = [];
                for (var i = 0; i < curLabelSet.appliesToSpanTypes.length; i++) {
                    spanTypesSimpleOfLabelSet.push(curLabelSet.appliesToSpanTypes[i].name);
                }
                curLabelSet.appliesToSpanTypes = spanTypesSimpleOfLabelSet;
                // delete curLabelSet.appliesToSpanTypes;

                var labelsSimple = [];
                for (var k = 0; k < curLabelSet.labels.length; k++) {
                    var curLabel = curLabelSet.labels[k];
                    labelsSimple.push(curLabel.name);
                    delete curLabel.labelSet;
                }
                curLabelSet.labels = labelsSimple;
            }
            for (var j = 0; j < scheme.linkSets.length; j++) {
                var curLinkSet = scheme.linkSets[j];
                var linkLabelsSimple = [];
                for (var k = 0; k < curLinkSet.linkLabels.length; k++) {
                    var curLabel = curLinkSet.linkLabels[k];
                	var linkLabel = {
                    	"name": curLabel.name,
                    	"options": curLabel.options
                	};
                	linkLabelsSimple.push(linkLabel);
                }
                curLinkSet.linkLabels = linkLabelsSimple;
                //curLinkSet.startSpanType = curLinkSet.startSpanType;
                //curLinkSet.endSpanType = curLinkSet.endSpanType;
                //delete curLinkSet.startSpanType;
                //delete curLinkSet.endSpanType;
                delete curLinkSet.allowUnlabeledLinks;
                delete curLinkSet.id;
            }

            delete scheme.linkSets;
            //delete scheme.spanTypes;

            $scope.currentScheme = JSON.stringify(scheme, $scope.replacer, "\t");
        };

        $scope.replacer = function (key, value) {
            if (key === "startSpanType" || key === "endSpanType") {
                return value.spanType;
            }
            return value;
        };

        $scope.submit = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();
    });
