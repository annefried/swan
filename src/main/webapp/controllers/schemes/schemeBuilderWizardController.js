/**
 * Created by Julia Dembowski on 04/08/16.
 */

'use strict';

angular
    .module('app')
    .controller('schemeBuilderWizardController', function ($scope, $rootScope, $http, $sce,
                                                           $uibModal, $uibModalInstance, $window, UtilityService) {

		var modal = this;

        /**
         * Called at the end of the controller construction
         */
        $scope.init = function () {
            $scope.steps = ['name', 'visualization', 'spanTypes', 'labelSets', 'linkTypes', 'preview'];
            $scope.step = 0;
            $scope.nextLabel = 'Next';

            $scope.loadSchemes();
            modal.noView = {
                checked: true
            };
            modal.graphView = {
                checked: false,
                open: false
            };
            modal.timelineView = {
                checked: false,
                open: false
            };
            $rootScope.alertsModal = [];
            modal.visKind = 'None';
            modal.positioning = undefined;
            modal.editingLabelSet = false;
            modal.editingLinkType = false;
            $scope.spanTypes = [];
            $scope.selectedSpanTypesOfLabelSet = [];
            $scope.linkTypes = [];
            $scope.currentLabelsOfLabelSet = [];
            $scope.currentLinkLabels = [];
            $scope.labelSets = [];
        };

        $scope.isFirstStep = function () {
            return $scope.step === 0;
        };

        $scope.isLastStep = function () {
            return $scope.step === ($scope.steps.length - 1);
        };

        $scope.isCurrentStep = function (step) {
            return $scope.step === step;
        };

        $scope.setCurrentStep = function (step) {
            $scope.step = step;
            $scope.nextLabel = $scope.getNextLabel();
        };

        $scope.getCurrentStep = function () {
            return $scope.steps[$scope.step];
        };

        $scope.getNextLabel = function () {
            return ($scope.isLastStep()) ? 'Submit' : 'Next';
        };

        $scope.handlePrevious = function () {
            if ($scope.isLastStep()) {
                $scope.nextLabel = 'Next';
            }
            $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
        };

        $scope.handleNext = function () {
            if ($scope.isLastStep()) {
                $scope.submit();
            } else {
                $scope.step += 1;
                if ($scope.isLastStep()) {
                    $scope.nextLabel = 'Submit';
                }
            }
        };

		$scope.loadSchemes = function () {
			$http.get('swan/scheme/schemes').success(function (response) {
				var schemes = JSOG.parse(JSON.stringify(response.schemes));
				$scope.loadedSchemes = [];
				for (var i = 0; i < schemes.length; i++) {
					var currentScheme = schemes[i];

					var template = {
						id: currentScheme.id,
						name: currentScheme.name
					};
					$scope.loadedSchemes.push(template);
				}
			}).error(function (response) {
				$rootScope.checkResponseStatusCode(response.status);
			});
		};

		$scope.loadPreloadedScheme = function (scheme) {

			if (scheme == null || scheme == undefined) {
				// Do nothing
			} else if (scheme.spanTypes == undefined) {
				$http.get("swan/scheme/byid/" + scheme.id).success(function (response) {
					const resScheme = JSOG.parse(JSON.stringify(response.scheme));
					$scope.setSchemeProperties(resScheme);
					for (var i = 0; i < $scope.loadedSchemes.length; i++) {
						if ($scope.loadedSchemes[i].id == scheme.id) {
							$scope.loadedSchemes[i] = scheme;
							break;
						}
					}
				}).error(function (response) {
					$rootScope.checkResponseStatusCode(response.status);
				});
			} else {
				$scope.setSchemeProperties(scheme);
			}

		};

		/**
		 * Sets the properties of a loaded scheme in the wizard.
		 *
		 * @param scheme
		 */
		$scope.setSchemeProperties = function (scheme) {
			modal.schemeName = "Copy of " + scheme.name;
			$scope.spanTypes = scheme.spanTypes;
			$scope.labelSets = scheme.labelSets;
			$scope.linkTypes = scheme.linkTypes;
			$scope.visElements = scheme.visElements;
			modal.noView.checked = true;
			modal.timelineView.checked = false;
			modal.timelineView.open = false;
			modal.graphView.checked = false;
			modal.graphView.open = false;
			modal.visKind = 'None';
			modal.positioning = undefined;
			for (var i = 0; i < scheme.visElements.length; i++) {
				const visElement = scheme.visElements[i];
				if (visElement.visKind == 'graph') {
					if (visElement.visState != 'hidden') {
						modal.noView.checked = false;
						modal.graphView.checked = true;
						modal.timelineView.checked = false;
						modal.visKind = 'Graph';
						if (visElement.visState == 'opened') {
							modal.graphView.open = true;
						} else {
							modal.graphView.open = false;
						}
					}
				} else if (visElement.visKind == 'timeline') {
					if (visElement.visState != 'hidden') {
						modal.noView.checked = false;
						modal.graphView.checked = false;
						modal.timelineView.checked = true;
						modal.visKind = 'Timeline';
						if (visElement.visState == 'opened') {
							modal.timelineView.open = true;
						} else {
							modal.timelineView.open = false;
						}
					}
				}
			}
			for (var i = 0; i < $scope.labelSets.length; i++) {
				var labelSet = $scope.labelSets[i];
				if (labelSet.labelMenuStyle == undefined) {
					labelSet.labelMenuStyle = 'list';
				}
				for (var j = 0; j < labelSet.labels.length; j++) {
					var label = labelSet.labels[j];
					label.nameParentSet = labelSet.name;
				}
			}
			for (var i = 0; i < $scope.linkTypes.length; i++) {
				var linkType = $scope.linkTypes[i];
				if (linkType.linkLabelMenuStyle == undefined) {
					linkType.linkLabelMenuStyle = 'list';
				}
				if (linkType.undirected == undefined) {
					linkType.undirected = false;
				}
				for (var j = 0; j < linkType.linkLabels.length; j++) {
					var linkLabel = linkType.linkLabels[j];
					linkLabel.nameParentSet = linkType.name;
				}
			}

			$scope.resetLabelSetInputFields();
			$scope.resetLinkTypeInputFields();
			$scope.loadScheme = true;
		};

		/**
		 * Called by the submit() function. Creates a json template of the scheme and sends it to the backend.
		 */
		$scope.sendScheme = function () {
			try {
				var currUser = {"id": parseInt($window.sessionStorage.uId)}; // TODO maybe global

				// Visualization elements
				var visElements = [];
				var graphViewTem = {
					"visState": "hidden",
					"visKind": "graph"
				};
				var timelineViewTem = {
					"visState": "hidden",
					"visKind": "timeline"
				};
				if (modal.noView.checked) {
					// Nothing to do
				} else if (modal.graphView.checked) {
					if (modal.graphView.open) {
						graphViewTem.visState = "opened";
					} else {
						graphViewTem.visState = "closed";
					}
				} else if (modal.timelineView.checked) {
					if (modal.timelineView.open) {
						timelineViewTem.visState = "opened";
					} else {
						timelineViewTem.visState = "closed";
					}
				}
				visElements.push(graphViewTem);
				visElements.push(timelineViewTem);

				// Color schemes are currently not used yet, so a dummy scheme is created.
				var colorScheme = {
					colorMode: 'automatic',
					spanTypeColors: [],
					labelColors: [],
					linkLabelColors: [],
					labelSetColors: [],
					linkTypeColors: []
				};

				var scheme = {
					"id": null,
					"name": modal.schemeName,
					"creator": currUser,
					"visElements": visElements,
					"spanTypes": $scope.spanTypes,
					"labelSets": $scope.labelSets,
					"linkTypes": $scope.linkTypes,
					"projects": [],
					"colorScheme": colorScheme
				};

				try {

					$http.post("swan/scheme", angular.toJson(scheme)).success(function (response) {
						$rootScope.schemesTable[scheme.name] = scheme;
						var schemePreview = {
							'id': response,
							'name': scheme.name,
							"creator": currUser,
							"visElements": visElements,
							'tableIndex': $scope.schemeCounter++,
							'projects': []
						};
						$rootScope.tableSchemes.push(schemePreview);
						$rootScope.allSchemes.push(schemePreview);

						// Check if the guided tour can continue
						if ($rootScope.tour !== undefined) {
							$("#tour-next-button").prop("disabled", false);
						}

						$uibModalInstance.close();
					}).error(function (response) {
						$rootScope.checkResponseStatusCode(response.status);
						$rootScope.addAlert({type: 'danger', msg: 'A scheme with this name already exists.'});
					});

				} catch (ex) {
					$rootScope.addAlert({type: 'danger', msg: 'The selected file does not contain a valid annotation scheme. Reason: ' + ex});
				}
			} catch (ex) {
				$rootScope.addAlert({type: 'danger', msg: 'The selected file does not contain a valid annotation scheme.'});
			}

		};


		/////////////////////////////////////
		//
		//  HTML INTERACTING FUNCTIONS
		//
		/////////////////////////////////////

		$scope.watchVisualizationChange = function (kind) {
			if (kind === "None") {
				// If timeline was the last selected visualization kind all
				// positioning options have to be resetted of the already added link
				// sets
				if (modal.timelineView.checked) {
					for (var i = 0; i < $scope.linkTypes.length; i++) {
						var linkType = $scope.linkTypes[i];
						for (var j = 0; j < linkType.linkLabels.length; j++) {
							var linkLabel = linkType.linkLabels[j];
							linkLabel.options = undefined;
						}
					}
				}
				// Reset the options attribute of the link labels which belong to
				// the not yet added link sets
				for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
					$scope.currentLinkLabels[i].options = undefined;
				}
				modal.positioning = undefined;
				modal.noView.checked = true;
				modal.graphView.checked = false;
				modal.timelineView.checked = false;
			} else if (kind === "Graph") {
				// If timeline was the last selected visualization kind all
				// positioning options have to be resetted
				if (modal.timelineView.checked) {
					for (var i = 0; i < $scope.linkTypes.length; i++) {
						var linkType = $scope.linkTypes[i];
						for (var j = 0; j < linkType.linkLabels.length; j++) {
							var linkLabel = linkType.linkLabels[j];
							linkLabel.options = undefined;
						}
					}
				}
				// Reset the options attribute of the link labels which belong to
				// the not yet added link sets
				for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
					$scope.currentLinkLabels[i].options = undefined;
				}
				modal.positioning = undefined;
				modal.noView.checked = false;
				modal.graphView.checked = true;
				modal.timelineView.checked = false;
			} else if (kind === "Timeline") {
				modal.noView.checked = false;
				modal.graphView.checked = false;
				modal.timelineView.checked = true;
				// Reset all link sets because the positioning attribute for link
				// labels is mandatory
				$scope.linkTypes = [];
				$scope.currentLinkLabels = [];
			}
		};

		$scope.getLinkTypeHeadline = function () {
			if (modal.timelineView.checked) {
				return "Link type";
			} else {
				return "Link types";
			}
		};

		$scope.disableTextInputButton = function (text) {
			return text === undefined
				|| text.length <= 0;
		};

		$scope.disableLinkLabelButton = function (labelName, positioning) {
			if (modal.timelineView.checked) {
				return positioning === undefined
					|| (positioning !== "horizontal" && positioning !== "vertical")
					|| $scope.disableTextInputButton(labelName);
			} else {
				return $scope.disableTextInputButton(labelName);
			}
		};

		$scope.disableLabelSetButton = function () {
			return modal.nameLabelSet === undefined
				|| modal.nameLabelSet === ''
				|| $scope.selectedSpanTypesOfLabelSet.length < 1
				|| $scope.currentLabelsOfLabelSet.length < 1;
		};

		$scope.disableLinkTypeButton = function () {
			return modal.nameLinkType === undefined
				|| modal.nameLinkType === ''
				|| modal.startSpanType === undefined
				|| modal.endSpanType === undefined
				|| (modal.timelineView.checked && $scope.linkTypes.length >= 1);
		};

		/**
		 * Called when clicking the New Label Set button
		 */
		$scope.newLabelSet = function () {
			modal.editingLabelSet = true;
		}

		/**
		 * Called when clicking the add Button for a LabelSet
		 */
		$scope.addLabelSet = function () {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.labelSets.length; i++) {
				if ($scope.labelSets[i].name == modal.nameLabelSet) {
					nameAlreadyUsed = true;
					break;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A label set with this name is already part of this scheme.'});
			} else {
				var labels = [];
				for (var i = 0; i < $scope.currentLabelsOfLabelSet.length; i++) {
					var label = {
						name: $scope.currentLabelsOfLabelSet[i].name,
						nameParentSet: modal.nameLabelSet
					};
					labels.push(label);
				}

				const newLabelSet = {
					name: modal.nameLabelSet,
					exclusive: modal.exclusiveLabelSet,
					labels: labels,
					appliesToSpanTypes: $scope.selectedSpanTypesOfLabelSet,
					labelMenuStyle: 'list'  //display labels as dropdown menu is not yet implemented, so this is always set to list
				};

				$scope.labelSets.push(newLabelSet);
				$scope.resetLabelSetInputFields();
				modal.editingLabelSet = false;
			}
		};

		/**
		 * Called when clicking the edit button in scheme table on label set.
		 *
		 * @param {type} name : name of label set to be edited
		 */
		$scope.editLabelSet = function (name) {
			// Find label set to be edited
			var selectedSet = undefined;
			$scope.currentLabelsOfLabelSet = [];
			$scope.selectedSpanTypesOfLabelSet = [];

			for (var i = 0; i < $scope.labelSets.length; i++) {
				if ($scope.labelSets[i].name === name) {
					selectedSet = $scope.labelSets[i];
					for (var j = 0; j < $scope.labelSets[i].labels.length; j++) {
						$scope.addLabelToLabelSet($scope.labelSets[i].labels[j].name);
					}
					break;
				}
			}
			// Reset editing fields
			modal.editingLabelSet = true;
			modal.nameLabelSet = name;
			modal.exclusiveLabelSet = selectedSet.exclusive;
			$scope.selectedSpanTypesOfLabelSet = selectedSet.appliesToSpanTypes;

			// Remove from table
			$scope.removeLabelSet(name);
		};

		/**
		 * Called when clicking 'x'-Button in SchemeTable on a LabelSet.
		 *
		 * @param {type} name : Name of the LabelSet to remove
		 */
		$scope.removeLabelSet = function (name) {
			for (var i = 0; i < $scope.labelSets.length; i++) {
				if ($scope.labelSets[i].name === name) {
					$scope.labelSets.splice(i, 1);
				}
			}
		};

		/**
		 * Called when clicking the New Link Type button
		 */
		$scope.newLinkType = function () {
			modal.editingLinkType = true;
		}

		/**
		 * Called when clicking add Button for LinkType.
		 */
		$scope.addLinkType = function () {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.linkTypes.length; i++) {
				if ($scope.linkTypes[i].name == modal.nameLinkType) {
					nameAlreadyUsed = true;
					break;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A link type with this name is already part of this scheme.'});
			} else {
				var linkLabels = [];
				for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
					var linkLabel = {
						name: $scope.currentLinkLabels[i].name,
						options: $scope.currentLinkLabels[i].options,
						nameParentSet: modal.nameLinkType
					};
					linkLabels.push(linkLabel);
				}
				var newLinkType = {
					name: modal.nameLinkType,
					startSpanType: modal.startSpanType,
					endSpanType: modal.endSpanType,
					linkLabels: linkLabels,
					linkLabelMenuStyle: 'list', //display labels as dropdown menu is not yet implemented, so this is always set to 'list'
					undirected: false //allowing undirected links is not yet implemented, so this is always set to false for now
				};

				$scope.linkTypes.push(newLinkType);
				$scope.resetLinkTypeInputFields();
				modal.editingLinkType = false;
			}
		};

		/**
		 * Called when clicking editing button in scheme table
		 *
		 * @param {link type object} linkType
		 */
		$scope.editLinkType = function (name) {
			// Find the link type to be edited
			var selectedType = undefined;
			for (var i = 0; i < $scope.linkTypes.length; i++) {
				if ($scope.linkTypes[i].name === name) {
					$scope.currentLinkLabels = [];
					for (var j = 0; j < $scope.linkTypes[i].linkLabels.length; j++) {
						var linkLabel = $scope.linkTypes[i].linkLabels[j];
						$scope.addLabelToLinkType(linkLabel.name, linkLabel.options);
					}
					selectedType = $scope.linkTypes[i];
					break;
				}
			}
			// Set fields
			modal.editingLinkType = true;
			modal.nameLinkType = name;
			modal.startSpanType = selectedType.startSpanType;
			modal.endSpanType = selectedType.endSpanType;

			// Remove from table while editing
			$scope.removeLinkType(name);
		};

		/**
		 * Called when clicking 'x'-Button in SchemeTable on a LinkType.
		 *
		 * @param {type} linkType : LinkType to remove
		 */
		$scope.removeLinkType = function (name) {
			for (var i = 0; i < $scope.linkTypes.length; i++) {
				if ($scope.linkTypes[i].name === name) {
					$scope.linkTypes.splice(i, 1);
					break;
				}
			}
		};

		$scope.addSpanTypeToLabelSet = function (spanType) {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.selectedSpanTypesOfLabelSet.length; i++) {
				if ($scope.selectedSpanTypesOfLabelSet[i].name === spanType.name) {
					nameAlreadyUsed = true;
					break;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A span type can only be added once!'});
			} else {
				$scope.selectedSpanTypesOfLabelSet.push(spanType);
			}
		};

		$scope.removeSpanTypeFromLabelSet = function (spanTypeName) {
			for (var i = 0; i < $scope.selectedSpanTypesOfLabelSet.length; i++) {
				if ($scope.selectedSpanTypesOfLabelSet[i].name === spanTypeName) {
					$scope.selectedSpanTypesOfLabelSet.splice(i, 1);
					break;
				}
			}
		};

		$scope.selectedSpanTypeLabelSetFilter = function (value, index, array) {
			var ret = true;
			for (var i = 0; i < $scope.selectedSpanTypesOfLabelSet.length; i++) {
				if (value === $scope.selectedSpanTypesOfLabelSet[i]) {
					ret = false;
				}
			}
			return ret;
		};

		/**
		 * Adds a new span type to the scheme.
		 *
		 * @param name
		 */
		$scope.addSpanType = function (name) {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.spanTypes.length; i++) {
				if ($scope.spanTypes[i].name === name) {
					nameAlreadyUsed = true;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A span type with this name already exists!'});
			} else {
				const newSpanType = {
					'name': name
				};
				$scope.spanTypes.push(newSpanType);
				modal.spanTypeName = undefined;
			}
		};

		/**
		 * Called when clickling the 'x'-button next to a span type. Removes a span type and all label sets and link types
		 * that use the span type from the scheme.
		 *
		 * @param spanType
		 */
		$scope.removeSpanType = function (spanType) {

			for (var i = 0; i < $scope.spanTypes.length; i++) {
				var spanType2 = $scope.spanTypes[i];
				if (spanType2.name === spanType.name) {
					$scope.spanTypes.splice(i, 1);
				}
			}
			// Remove potential span types in label sets and link types
			for (var i = 0; i < $scope.selectedSpanTypesOfLabelSet.length; i++) {
				if ($scope.selectedSpanTypesOfLabelSet[i].name == spanType.name) {
					$scope.selectedSpanTypesOfLabelSet.splice(i, 1);
				}
			}

			if (modal.startSpanType != undefined && modal.startSpanType.name == spanType.name) {
				modal.startSpanType = undefined;
			}

			if (modal.endSpanType != undefined && modal.endSpanType.name == spanType.name) {
				modal.endSpanType = undefined;
			}

			var i = $scope.labelSets.length;
			while (i--) {
				var labelSet = $scope.labelSets[i];
				for (var j = 0; j < labelSet.appliesToSpanTypes.length; j++) {
					if (labelSet.appliesToSpanTypes[j].name == spanType.name) {
						$scope.labelSets.splice(i, 1);
					}
				}
			}
			var i = $scope.linkTypes.length;
			while (i--) {
				var linkType = $scope.linkTypes[i];
				if (linkType.startSpanType.name == spanType.name || linkType.endSpanType.name == spanType.name) {
					$scope.linkTypes.splice(i, 1);
				}
			}
		};

		$scope.addLabelToLabelSet = function (labelName) {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.currentLabelsOfLabelSet.length; i++) {
				if ($scope.currentLabelsOfLabelSet[i].name == labelName) {
					nameAlreadyUsed = true;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A label with this name already exists!'});
			} else {
				$scope.currentLabelsOfLabelSet.push({name: labelName});
				modal.labelName = undefined;
			}
		};

		$scope.addLabelToLinkType = function (labelName, options) {
			var nameAlreadyUsed = false;
			for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
				if ($scope.currentLinkLabels[i].name == labelName) {
					nameAlreadyUsed = true;
					break;
				}
			}
			if (nameAlreadyUsed) {
				$rootScope.addAlert({type: 'danger', msg: 'A label with this name already exists!'});
			} else {
				var linkLabel = {name: labelName,
					options: options};
				$scope.currentLinkLabels.push(linkLabel);
				modal.linkLabelName = undefined;
				modal.positioningTitle = 'Choose positioning';
				modal.positioning = undefined;
			}
		};

		$scope.addLabelToLinkTypeWithSingleOpt = function (labelName, option) {
			if (option == undefined || option == null) {
				$scope.addLabelToLinkType(labelName, []);
			} else {
				$scope.addLabelToLinkType(labelName, [option]);
			}
		};

		$scope.removeLabelFromLabelSet = function (name) {
			var i = $scope.currentLabelsOfLabelSet.length;
			while (i--) {
				if ($scope.currentLabelsOfLabelSet[i].name == name) {
					$scope.currentLabelsOfLabelSet.splice(i, 1);
				}
			}
		};

		$scope.removeLabelFromLinkType = function (name) {
			var i = $scope.currentLinkLabels.length;
			while (i--) {
				if ($scope.currentLinkLabels[i].name === name) {
					$scope.currentLinkLabels.splice(i, 1);
				}
			}
		};


		/**
		 * Loads a scheme from a file defined in XML or JSON.
		 *
		 * @param $fileContent
		 */
		$scope.uploadScheme = function ($fileContent) {
			try {
				var xmlDoc = $.parseXML($fileContent);
				var xml = xmlDoc.responseXML;
				// xml2json function is in 'other' folder.
				var content = xml2json(xmlDoc, "");
			} catch (e) {
				content = $fileContent;
			}

			try {
				$scope.uploadedScheme = content;
				var scheme = JSON.parse(content);

				// Validate scheme
				var sTypeMap = {}; // for constant access
				for (var i = 0; i < scheme.spanTypes.length; i++) {
					var sType = scheme.spanTypes[i];
					sTypeMap[sType.name] = sType;
				}

				// Validate label sets
				for (var i = 0; i < scheme.labelSets.length; i++) {
					var labelSet = scheme.labelSets[i];
					for (var j = 0; j < labelSet.appliesToSpanTypes.length; j++) {
						var sType = labelSet.appliesToSpanTypes[j].name;
						if (sTypeMap[sType.toString()] === undefined) {
							throw "Span type used in label set not defined";
						}
					}

					if (labelSet.appliesToSpanTypes.length === 0
						|| labelSet.labels.length === 0
						|| labelSet.name === undefined) {

						throw "Incomplete label set";
					}

					// Check on duplicate name
					var labelSetLabelNameSet = {};
					for (var j = 0; j < labelSet.labels.length; j++) {
						const label = labelSet.labels[j];
						if (labelSetLabelNameSet[label.name] !== undefined) {
							throw "Label with duplicate name: " + label.name;
						} else {
							labelSetLabelNameSet[label.name] = label.name;
						}
					}
				}

				// Validate link types
				for (var i = 0; i < scheme.linkTypes.length; i++) {
					const linkType = scheme.linkTypes[i];
					if (sTypeMap[linkType.startSpanType.name] === undefined
						|| sTypeMap[linkType.endSpanType.name] === undefined) {

						throw "Span type used in link type not defined";
					}
					if (linkType.startSpanType === undefined
						|| linkType.endSpanType === undefined
						|| linkType.linkLabels.length === 0
						|| linkType.name === undefined) {

						throw "Incomplete link type";
					}

					var linkLabelNameSet = {};
					for (var j = 0; j < linkType.linkLabels.length; j++) {
						const linkLabel = linkType.linkLabels[j];
						if (linkLabel.name === undefined
							|| linkLabel.options === undefined) {
							throw "Link label in " + linkType.name + " not valid";
						}
						// Check on duplicate name
						if (linkLabelNameSet[linkLabel.name] !== undefined) {
							throw "Link label with duplicate name: " + linkLabel.name;
						} else {
							linkLabelNameSet[linkLabel.name] = linkLabel.name;
						}
					}

				}

				// Validate visualization depending properties
				for (var i = 0; i < scheme.visElements.length; i++) {
					var visElement = scheme.visElements[i];
					if (visElement.visKind === 'timeline' && visElement.visState != 'hidden') {
						if (scheme.linkTypes.length > 1) {
							throw "Only one link type allowed for timeline view";
						}
						if (scheme.linkTypes.length === 1) {
							var linkType = scheme.linkTypes[0];
							for (var j = 0; j < linkType.linkLabels.length; j++) {
								var linkLabel = linkType.linkLabels[j];
								if (linkLabel.options.length != 1) {
									throw "Positioning must be specified";
								}
							}
						}
					}
					if (visElement.visKind === 'graph' && visElement.visState != 'hidden') {
						for (var j = 0; j < scheme.linkTypes.length; j ++) {
							var linkType = scheme.linkTypes[j];
							for (var k = 0; k < linkType.linkLabels.length; k++) {
								var linkLabel = linkType.linkLabels[k];
								if (linkLabel.options.length != 0) {
									throw "Positioning must not be specified";
								}
							}
						}
					}

				}

				if (typeof scheme.spanTypes === 'string') {
					var spanTypes = [scheme.spanTypes];
					scheme.spanTypes = spanTypes;
				}
				for (var i = 0; i < scheme.labelSets.length; i++) {
					if (typeof scheme.labelSets[i].appliesToSpanTypes === 'string') {
						var spanType = [scheme.labelSets[i].appliesToSpanTypes];
						scheme.labelSets[i].appliesToSpanTypes = spanType;
					}
					for (var j = 0; j < scheme.labelSets[i].appliesToSpanTypes.length; j++) {
						var spanType = scheme.labelSets[i].appliesToSpanTypes[j]
						scheme.labelSets[i].appliesToSpanTypes[j] = sTypeMap[spanType.name]
					}
					if (typeof scheme.labelSets[i].labels === 'string') {
						var labels = [scheme.labelSets[i].labels];
						scheme.labelSets[i].labels = labels;
					}
				}
				for (var i = 0; i < scheme.linkTypes.length; i++) {
					if (typeof scheme.linkTypes[i].linkLabels === 'string') {
						var linkLabels = [scheme.linkTypes[i].linkLabels];
						scheme.linkTypes[i].linkLabels = linkLabels;
					}
					var startSpanType = scheme.linkTypes[i].startSpanType;
					scheme.linkTypes[i].startSpanType = sTypeMap[startSpanType.name]
					var endSpanType = scheme.linkTypes[i].endSpanType;
					scheme.linkTypes[i].endSpanType = sTypeMap[endSpanType.name]
				}
				try {
					$scope.setSchemeProperties(scheme);
				} catch (ex) {
					$rootScope.addAlert({type: 'danger', msg: 'Selected file does not contain a valid annotation scheme. ' +
					'Reason: ' + ex});
				}
			} catch (ex) {
				$rootScope.addAlert({type: 'danger', msg: 'Selected file does not contain a valid annotation scheme. ' +
				'Reason: ' + ex});
			}
		};

		$scope.resetLabelSetInputFields = function () {
			modal.nameLabelSet = undefined;
			modal.exclusiveLabelSet = false;
			$scope.currentLabelsOfLabelSet = [];
			$scope.selectedSpanTypesOfLabelSet = [];
		};

		$scope.resetLinkTypeInputFields = function () {
			modal.nameLinkType = undefined;
			modal.startSpanType = undefined;
			modal.endSpanType = undefined;
			$scope.currentLinkLabels = [];
			modal.positioning = undefined;
		};

		/**
		 * Called when clicking the submit button.
		 */
		$scope.submit = function () {
			if (modal.schemeName === undefined || modal.schemeName.trim() === "") {
				$scope.alerts.push({type: "warning", msg: "Please define a valid name for your scheme."});
			} else {
				// Check if scheme with this name already exists
				for (var i = 0; i < $scope.loadedSchemes.length; i++) {
					if ($scope.loadedSchemes[i].name === modal.schemeName) {
						$scope.alerts.push({type: "warning", msg: "A scheme with this name already exists."});
						return;
					}
				}
				// Check if at least one span type is defined
				if ($scope.spanTypes.length === 0) {
					$scope.alerts.push({type: "warning", msg: "You need to define at least one span type."});
					return;
				}

				$scope.sendScheme();
			}
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.init();
	});
