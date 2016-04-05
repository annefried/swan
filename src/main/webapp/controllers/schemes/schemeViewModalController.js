/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular.module('app').controller('schemeViewModalController', function ($scope, $rootScope, $uibModalInstance) {

    $scope.init = function () {
        $scope.loadScheme();
    };

    $scope.loadScheme = function () {

        // This is a little hack to make a deep copy of the scheme to set the
        // projects undefined
        var scheme = JSON.parse(JSON.stringify($rootScope.currentScheme));

        // remove things that we don't want to display
        delete scheme.id;
        delete scheme.creator;
        delete scheme.projects;


        var targetTypesSimple = new Array();
        for (var j = 0; j < scheme.targetTypes.length; j++) {
            targetTypesSimple.push(scheme.targetTypes[j].targetType);
        }
        scheme.spanTypes = targetTypesSimple;
        scheme.linkTypes = scheme.linkSets;

        for (var j = 0; j < scheme.labelSets.length; j++) {
            var curLabelSet = scheme.labelSets[j];
            delete curLabelSet.id;
            var targetTypesSimple2 = new Array();
            for (var i = 0; i < curLabelSet.appliesToTargetTypes.length; i++) {
                targetTypesSimple2.push(curLabelSet.appliesToTargetTypes[i].targetType);
            }
            curLabelSet.appliesToSpanTypes = targetTypesSimple2;
            delete curLabelSet.appliesToTargetTypes;

            var labelsSimple = new Array();
            for (var k = 0; k < curLabelSet.labels.length; k++) {
                var curLabel = curLabelSet.labels[k];
                labelsSimple.push(curLabel.labelId);
                delete curLabel.labelSet;
            }
            curLabelSet.labels = labelsSimple;
        }
        for (var j = 0; j < scheme.linkSets.length; j++) {
            var curLinkSet = scheme.linkSets[j];
            var linkLabelsSimple = new Array();
            for (var k = 0; k < curLinkSet.linkLabels.length; k++) {
                var curLabel = curLinkSet.linkLabels[k];
                curLabel.linkSet = undefined;
                linkLabelsSimple.push(curLabel.linkLabel);
            }
            curLinkSet.linkLabels = linkLabelsSimple;
            curLinkSet.startSpanType = curLinkSet.startType;
            curLinkSet.endSpanType = curLinkSet.endType;
            delete curLinkSet.startType;
            delete curLinkSet.endType;
            delete curLinkSet.allowUnlabeledLinks;
            delete curLinkSet.id;
        }
        
        delete scheme.linkSets;
        delete scheme.targetTypes;
        function replacer(key, value) {
            if (key === "startSpanType" || key === "endSpanType") {
                return value.targetType;
            }
            return value;
        }


        $scope.currentScheme = JSON.stringify(scheme, replacer
                , "\t");
    };




    $scope.submit = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});
