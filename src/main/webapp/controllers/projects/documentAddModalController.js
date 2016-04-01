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

	/**
	 * Validates the uploaded targets. Checks whether all specified target types
	 * are defined in the corresponding scheme.
	 * 
	 * @param {type} targets
	 * @param {type} projectId
	 * @param {type} currFileName
	 * @returns {undefined}
	 */
    $scope.validateTargets = function (targets, projectId, currFileName) {
        var scheme = null;
		for (var i = 0; i < $rootScope.projects.length; i++) {
			var curProj = $rootScope.projects[i];
			if (curProj.id === projectId) {
			    scheme = $rootScope.projects[i].scheme;
			    break;
			}
        }		    
		for (var i = 0; i < $rootScope.schemes.length; i++) {
            var currScheme = $rootScope.schemes[i];
			if (currScheme.id === scheme.id) {
			    scheme = currScheme;
			    break;
			} 
		}
		var tTypeMap = {}; // for linear access
		for (var i = 0; i < scheme.targetTypes.length; i++) {
		    var tType = scheme.targetTypes[i].targetType;
		    tTypeMap[tType] = tType;
		}
		for (var i = 0; i < targets.targets.length; i++) {
		    var target = targets.targets[i];
			if (tTypeMap[target.type] === undefined) {
			    throw "Target type \'" + target.type.toString() + "\'" +
						" in file \'" + currFileName + "\'" +
						" not defined in scheme.";
			}
		} 
    };

    $scope.submit = function () {
		try {
			for (var curFileName in $scope.textFileMap) {
			    // Parse Target File
			    if ($scope.targetFileMap[curFileName] === undefined) {
					var targets = {
					    targets: []
					};
			    } else {
					var targets = JSON.parse($scope.targetFileMap[curFileName]);
			    }

			    // Validate targets
			    $scope.validateTargets(targets, $rootScope.currentProjectId, curFileName);

			    // Build Annotations
			    var defaultAnnotations = [];    
			    for (var i = 0; i < targets.targets.length; i++) {
					var annot = {
					    'id': null,
					    'start': targets.targets[i].begin,
					    'end': targets.targets[i].end,
					    'targetType': {
							'targetType': targets.targets[i].type
					    },
					    'user': null,
					    'document': null,
					    'text': $scope.textFileMap[curFileName].substring(targets.targets[i].begin, targets.targets[i].end)
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

			    $http.post("discanno/document/adddoctoproject", JSON.stringify(documentTemplate)).then((function (curFileName) {
					return function (response) {
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
		} catch (ex) {
			$rootScope.addAlert({type: 'danger', msg: ex});
		}
        
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});