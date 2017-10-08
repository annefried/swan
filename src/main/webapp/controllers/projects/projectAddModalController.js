/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('projectAddModalController', function ($scope, $rootScope, $http, $uibModalInstance, $window) {

		var modal = this;

        $scope.init = function () {
			$scope.modes = ['createNew', 'import'];
			$scope.mode = 0;

            // Available tokenization languages
            $scope.languages = [ "Whitespace", "Characterwise", "Spanish", "English", "German", "French" ];
            $scope.loadSchemes();
            $scope.loadNames();

			modal.fileSelected = false;
        };

		$scope.isCurrentMode = function (mode) {
			return $scope.mode === mode;
		};

		$scope.setCurrentMode = function (mode) {
			$scope.mode = mode;
		};

		$scope.getCurrentMode = function () {
			return $scope.modes[$scope.mode];
		};

		/**
		 * Loads schemes.
		 */
		$scope.loadSchemes = function () {
            $http.get("swan/scheme/schemes").success(function (response) {
                $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

		/**
		 * Loads existing project names, so a new project will not be given an existing name.
		 */
		$scope.loadNames = function () {
            $http.get("swan/project/names").success(function (response) {
                $rootScope.names = JSOG.parse(JSON.stringify(response)).projects;
            }).error(function (response) {
                $rootScope.checkResponseStatusCode(response.status);
            });
        };

        /**
         * Checks whether the project name is already taken.
         *
         * @param {type} name
         * @returns {Boolean}
         */
        $scope.hasError = function (name) {
            if (name) {
                for (var i = 0; i < $rootScope.names.length; i++) {
                    if (name == $rootScope.names[i]) {
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        };

		/**
		 * Called when file is selected. Writed the file name to the name field and sets fileSelected to
		 * true, so the submit button will be enabled.
		 *
		 * @param name
		 */
		$scope.sendProjName = function (name) {
			modal.projName = name;
			modal.fileSelected = true;
		}

        $scope.submit = function () {
			if ($scope.getCurrentMode() == 'createNew') {
				var projectTemplate = {
					'id': null,
					'name': modal.projName,
					'tokenizationLang': modal.selectedTokLang,
					'documents': [],
					'scheme': {
						'id': modal.selectedScheme.id
					}
				};

				$http.post('swan/project', JSON.stringify(projectTemplate)).then(function (response) {
					$uibModalInstance.close(response.data);
				}, function () {
					$rootScope.addAlert({type: 'danger', msg: 'A Project with this name already exists.'});
				});
			} else {
				// IMPORT
				var url = "swan/project/reimport/" + $window.sessionStorage.uId + "/" + modal.projName + "/" + modal.selectedTokLang;

				var importProj = document.getElementById("importProject");
				// the file is the first element in the files property
				var file = importProj.files[0]

				$http.post(url, file, {headers:{'Content-Type': 'application/octet-stream'}}).then(function (response) {
					$uibModalInstance.close(response.data);
				}, function () {
					$rootScope.addAlert({type: 'danger', msg: 'A problem occured while trying to create the project.'});
				});

			}

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();

    });
