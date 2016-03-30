
'use strict';

angular.module('app').controller('schemeViewModalController', function ($scope, $rootScope, $uibModalInstance) {

    $scope.init = function () {
        $scope.loadScheme();
    };

    $scope.loadScheme = function () {
        // This is a little hack to make a deep copy of the scheme to set the
        // projects undefined
        var scheme = JSON.parse(JSON.stringify($rootScope.currentScheme));
        scheme.projects = undefined;
        for (var j = 0; j < scheme.labelSets.length; j++) {
            var curLabelSet = scheme.labelSets[j];
            for (var k = 0; k < curLabelSet.labels.length; k++) {
                var curLabel = curLabelSet.labels[k];
                curLabel.labelSet = undefined;
            }
        }
        for (var j = 0; j < scheme.linkSets.length; j++) {
            var curLinkSet = scheme.linkSets[j];
            for (var k = 0; k < curLinkSet.linkLabels.length; k++) {
                var curLabel = curLinkSet.linkLabels[k];
                curLabel.linkSet = undefined;
            }
        }
        
        $scope.currentScheme = JSON.stringify(scheme, null, "\t");
    };

    $scope.submit = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});
