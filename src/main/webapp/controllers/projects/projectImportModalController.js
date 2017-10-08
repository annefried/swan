/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
	.module('app')
	.controller('projectImportModalController', function ($scope, $rootScope, $http, $uibModalInstance, $window) {

		$scope.init = function () {
			// Available tokenization languages
			$scope.languages = [ "Whitespace", "Characterwise", "Spanish", "English", "German", "French" ];
			$scope.selectedTokLang = "English"
			$scope.loadNames();
			$scope.projName = "";
		};

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

		$scope.sendProject = function (filecontent, filename) {
			$scope.projName = filename;
			$scope.content = filecontent;
		}

		$scope.submit = function (name, lang) {
			var url = "swan/project/reimport/" + $window.sessionStorage.uId + "/" + name + "/" + lang;

			var importProj = document.getElementById("importProject");
			// the file is the first element in the files property
			var file = importProj.files[0]
			//var blob = new Blob(JSON.stringify($scope.content), {type: "octet/stream"});

			$http.post(url, file, {headers:{'Content-Type': 'application/octet-stream'}}).then(function (response) {
			//$http.post(url, JSON.stringify($scope.content), {headers:{'Content-Type': 'application/octet-stream'}}).then(function (response) {
				$scope.template = {
					'id': response.data,
					'name': name,
					'tokenizationLang': lang,
					'scheme': null,
					'users': [],
					'pms': [],
					'completed': [],
					'numberOfDocuments': 0,
					'documents': []
				};

				$uibModalInstance.close($scope.template);

			}, function () {
				$rootScope.addAlert({type: 'danger', msg: 'A problem occured while trying to create the project.'});
			});

		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.init();

	});
