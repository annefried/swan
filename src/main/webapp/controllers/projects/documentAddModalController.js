/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('documentAddModalController', function ($scope, $http, $rootScope, $uibModalInstance) {

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
         */
        $scope.validateTargets = function (targets, projectId, currFileName) {
            const scheme = $rootScope.currScheme;
            const sTypeMap = $scope.getSpanTypeMap(scheme);
            for (var i = 0; i < targets.targets.length; i++) {
                var spanType = targets.targets[i];
                if (spanType.type === undefined) {
                    throw "The targets do not contain a mandatory field 'type'";
                } else if (spanType.begin === undefined) {
                    throw "The targets do not contain a mandatory field 'begin'";
                } else if (spanType.end === undefined) {
                    throw "The targets do not contain a mandatory field 'end'";
                } else if (sTypeMap[spanType.type] === undefined) {
                    throw "Span type \'" + spanType.type.toString() + "\'" +
                            " in file \'" + currFileName + "\'" +
                            " not defined in scheme.";
                }
            }
        };
        
        /**
         * Returns a map which includes all span types to the given scheme.
         * The map provides constant access for validation purposes.
         * 
         * @param {type} scheme
         * @returns {type} sTypeMap
         */
        $scope.getSpanTypeMap = function (scheme) {
            var sTypeMap = {};
            for (var i = 0; i < scheme.spanTypes.length; i++) {
                var sType = scheme.spanTypes[i].name;
                sTypeMap[sType] = sType;
            }
            return sTypeMap;
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
                            'spanType': {
                                'name': targets.targets[i].type
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

                    $http.post("swan/document/adddoctoproject", JSON.stringify(documentTemplate)).then(function (curFileName) {
                        return function (response) {
                        	
                        	$rootScope.currProj = $rootScope.getProjectByProjectId($rootScope.currentProjectId, $rootScope.tableProjects);
                        	
                            var docTemplate = {
                                'completed': 0,
                                'id': response.data,
                                'name': curFileName,
                                'states': undefined
                            };
                            
                            docTemplate.states = $scope.getStatesArrayForNewDoc(docTemplate, $rootScope.currProj);
                            
                            $rootScope.currProj.numberOfDocuments++;
                            $rootScope.currProj.documents.push(docTemplate);
                            
                            $uibModalInstance.close();
                        };
                    }(curFileName), function (response) {
                        if (response.status >= 400)
                            $rootScope.addAlert({type: 'danger', msg: "The start or end spans of the target does not match the text."});
                    });
                }

            } catch (ex) {
                const msg = typeof ex === 'string' ? ex : ex.message;
                $rootScope.addAlert({type: 'danger', msg: msg});
            }

        };
        
        /**
         * Returns an array which consists of states for each user for
         * a new document.
         */
        $scope.getStatesArrayForNewDoc = function (doc, proj) {
        	var states = [];
        	
        	for (var i = 0; i < proj.users.length; i++) {
        		var user = proj.users[i];
        		var state = {
    				'completed': false,
    				'document': doc,
    				'user': user
        		};
        		
        		states.push(state);
        	}
        	
        	return states;
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();
    });