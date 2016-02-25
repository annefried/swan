'use strict';

angular.module('app').controller('documentAddModalController', function ($scope, $http, $rootScope, $uibModalInstance) {

    $scope.init = function () {
        $scope.textFileMap = {};
        $scope.targetFileMap = {};
    };
    $scope.clearFileMap = function () {
        $scope.textFileMap = {};
    };

    $scope.clearTargetFileMap = function () {
        $scope.targetFileMap = {};
    };

    $scope.sendText = function ($fileContent, $fileName) {
        $scope.textFileMap[$fileName] = $fileContent;
    };
    $scope.sendTargets = function ($fileContent, $fileName) {
        $scope.targetFileMap[$fileName] = $fileContent;
    };

    $scope.submit = function () {
        for (var curFileName in $scope.textFileMap) {
            // Parse Target File
            if ($scope.targetFileMap[curFileName] === undefined) {
                var targets = {
                    targets: []
                };
            } else {
                var targets = JSON.parse($scope.targetFileMap[curFileName]);
            }
            var defaultAnnotations = [];
            // Build Annotations
            for (var i = 0; i < targets.targets.length; i++) {
                var annot = {
                    'id': null,
                    'start': targets.targets[i].begin,
                    'end': targets.targets[i].end,
                    'targetType': {
                        'targetType': targets.targets[i].type
                    },
                    'user': null,
                    'document': null
                };
                defaultAnnotations.push(annot);
            }
            var documentTemplate = {
                'id': null,
                'name': curFileName,
                'text': $scope.textFileMap[curFileName],
                'project': {
                    'id': $rootScope.currentProjectId
                },
                'states': null,
                'defaultAnnotations': defaultAnnotations

            };

            $http.post("tempannot/document/adddoctoproject", JSON.stringify(documentTemplate)).then((function (curFileName) {
                return function (response) {
                    console.log(response);
                    var docTemplate = {
                        'completed': 0,
                        'id': response.data,
                        'name': curFileName
                    };
                    for (var i = 0; i < $rootScope.tableProjects.length; i++) {
                        var curProj = $rootScope.tableProjects[i];
                        if (curProj.id === $rootScope.currentProjectId) {
                            $rootScope.tableProjects[i].numberOfDocuments++;
                            $rootScope.tableProjects[i].documents.push(docTemplate);
                        }
                    }
                }
            })(curFileName));
        }

        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});