/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('app')
    .controller('schemeUploadModalController', function ($scope, $rootScope, $http, $sce, $uibModal, $uibModalInstance, $window, UtilityService) {

        /**
         * Called at the end of the controller construction
         */
        $scope.init = function () {
            $scope.loadSchemes();
            $scope.noView = {
                checked: true
            };
            $scope.graphView = {
                checked: false,
                state: 'opened'
            };
            $scope.timelineView = {
                checked: false,
                state: 'opened'
            };
            $rootScope.alertsModal = [];
            $scope.visKind = 'None';
            $scope.positioning = undefined;
            $scope.spanTypes = [];
            $scope.selectedSpanTypesOfLabelSet = [];
            $scope.linkTypes = [];
            $scope.currentLabelsOfLabelSet = [];
            $scope.currentLinkLabels = [];
            $scope.labelSets = [];
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

        $scope.setSchemeProperties = function (scheme) {
            $scope.schemeName = "Copy of " + scheme.name;
            $scope.spanTypes = scheme.spanTypes;
            $scope.labelSets = scheme.labelSets;
            $scope.linkTypes = scheme.linkTypes;
            $scope.visElements = scheme.visElements;
            $scope.noView.checked = true;
            $scope.timelineView.checked = false;
            $scope.graphView.checked = false;
            $scope.visKind = 'None';
            $scope.positioning = undefined;
            for (var i = 0; i < scheme.visElements.length; i++) {
                const visElement = scheme.visElements[i];
                if (visElement.visKind == 'graph') {
                    if (visElement.visState != 'hidden') {
                        $scope.noView.checked = false;
                        $scope.graphView.checked = true;
                        $scope.timelineView.checked = false;
                        $scope.visKind = 'Graph';
                        $scope.graphView.state = visElement.visState;
                    } else {
                        $scope.graphView.state = 'opened';
                    }
                } else if (visElement.visKind == 'timeline') {
                    if (visElement.visState != 'hidden') {
                        $scope.noView.checked = false;
                        $scope.graphView.checked = false;
                        $scope.timelineView.checked = true;
                        $scope.visKind = 'Timeline';
                        $scope.timelineView.state = visElement.visState;
                    } else {
                        $scope.timelineView.state = 'opened';
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
                if ($scope.noView.checked) {
                    // Nothing to do
                } else if ($scope.graphView.checked) {
                    graphViewTem.visState = $scope.graphView.state;
                } else if ($scope.timelineView.checked) {
                    timelineViewTem.visState = $scope.timelineView.state;
                }
                visElements.push(graphViewTem);
                visElements.push(timelineViewTem);

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
                    "name": $scope.schemeName,
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

                        // Check if the guided tour can continue
                        if ($rootScope.tour !== undefined) {
                            $("#tour-next-button").prop("disabled", false);
                        }
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
                if ($scope.timelineView.checked) {
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
                $scope.positioning = undefined;
                $scope.noView.checked = true;
                $scope.graphView.checked = false;
                $scope.timelineView.checked = false;
            } else if (kind === "Graph") {
                // If timeline was the last selected visualization kind all
                // positioning options have to be resetted
                if ($scope.timelineView.checked) {
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
                $scope.positioning = undefined;
                $scope.noView.checked = false;
                $scope.graphView.checked = true;
                $scope.timelineView.checked = false;
            } else if (kind === "Timeline") {
                $scope.noView.checked = false;
                $scope.graphView.checked = false;
                $scope.timelineView.checked = true;
                // Reset all link sets because the positioning attribute for link
                // labels is mandatory
                $scope.linkTypes = [];
                $scope.currentLinkLabels = [];
            }
        };

        $scope.getLinkTypeHeadline = function () {
            if ($scope.timelineView.checked) {
                return "Link type:";
            } else {
                return "Link types:";
            }
        };

        $scope.disableTextInputButton = function (text) {
            return text === undefined
                || text.length <= 0;
        };

        $scope.disableLinkLabelButton = function (labelName, positioning) {
            if ($scope.timelineView.checked) {
                return positioning === undefined
                    || (positioning !== "horizontal" && positioning !== "vertical")
                    || $scope.disableTextInputButton(labelName);
            } else {
                return $scope.disableTextInputButton(labelName);
            }
        };

        $scope.disableLabelSetButton = function () {
            return $scope.nameLabelSet === undefined
                || $scope.nameLabelSet === ''
                || $scope.selectedSpanTypesOfLabelSet.length < 1
                || $scope.currentLabelsOfLabelSet.length < 1;
        };

        $scope.disableLinkTypeButton = function () {
            return $scope.nameLinkType === undefined
                || $scope.nameLinkType === ''
                || $scope.startSpanType === undefined
                || $scope.endSpanType === undefined
                || ($scope.timelineView.checked && $scope.linkTypes.length >= 1);
        };

        /**
         * Called when clicking the add Button for a LabelSet
         */
        $scope.addLabelSet = function () {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.labelSets.length; i++) {
                if ($scope.labelSets[i].name == $scope.nameLabelSet) {
                    nameAlreadyUsed = true;
                    break;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A Label set with this name is already part of this scheme.'});
            } else {
                var labels = [];
                for (var i = 0; i < $scope.currentLabelsOfLabelSet.length; i++) {
                    var label = {
                        name: $scope.currentLabelsOfLabelSet[i].name,
                        nameParentSet: $scope.nameLabelSet
                    };
                    labels.push(label);
                }
                /**
                for (var i = 0; i < $scope.currentLabelsOfLabelSet; i++) {
                    $scope.currentLabelsOfLabelSet[i].nameParentSet = $scope.nameLabelSet;
                }
                 **/

                const newLabelSet = {
                    name: $scope.nameLabelSet,
                    exclusive: $scope.exclusiveLabelSet,
                    labels: labels,
                    appliesToSpanTypes: $scope.selectedSpanTypesOfLabelSet,
                    labelMenuStyle: 'list'  //display labels as dropdown menu is not yet implemented, so this is always set to list
                };

                $scope.labelSets.push(newLabelSet);
                $scope.resetLabelSetInputFields();
            }
        };

        /**
         * Called when clicking the edit button in scheme table on label set.
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
            $scope.nameLabelSet = name;
            $scope.exclusiveLabelSet = selectedSet.exclusive;
            $scope.selectedSpanTypesOfLabelSet = selectedSet.appliesToSpanTypes;

            // Remove from table
            $scope.removeLabelSet(name);
        };

        /**
         * Called when clicking 'x'-Button in SchemeTable on a LabelSet.
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
         * Called when clicking add Button for LinkType.
         */
        $scope.addLinkType = function () {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.linkTypes.length; i++) {
                if ($scope.linkTypes[i].name == $scope.nameLinkType) {
                    nameAlreadyUsed = true;
                    break;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A Link type with this name is already part of this scheme.'});
            } else {
                var linkLabels = [];
                for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
                    var linkLabel = {
                        name: $scope.currentLinkLabels[i].name,
                        options: $scope.currentLinkLabels[i].options,
                        nameParentSet: $scope.nameLinkType
                    };
                    linkLabels.push(linkLabel);
                }
                var newLinkType = {
                    name: $scope.nameLinkType,
                    startSpanType: $scope.startSpanType,
                    endSpanType: $scope.endSpanType,
                    linkLabels: linkLabels,
                    linkLabelMenuStyle: 'list', //display labels as dropdown menu is not yet implemented, so this is always set to 'list'
                    undirected: false //allowing undirected links is not yet implemented, so this is always set to false for now
                };

                $scope.linkTypes.push(newLinkType);
                $scope.resetLinkTypeInputFields();
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
            $scope.nameLinkType = name;
            $scope.startSpanType = selectedType.startSpanType;
            $scope.endSpanType = selectedType.endSpanType;

            // Remove from table while editing
            $scope.removeLinkType(name);
        };

        /**
         * Called when clicking 'x'-Button in SchemeTable on a LinkType.
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

        $scope.removeSpanTypeFromLabelSet = function (spanType) {
            for (var i = 0; i < $scope.selectedSpanTypesOfLabelSet.length; i++) {
                if ($scope.selectedSpanTypesOfLabelSet[i].name === spanType.name) {
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
                $scope.spanTypeName = undefined;
            }
        };

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

            if ($scope.startSpanType != undefined && $scope.startSpanType.name == spanType.name) {
                $scope.startSpanType = undefined;
            }

            if ($scope.endSpanType != undefined && $scope.endSpanType.name == spanType.name) {
                $scope.endSpanType = undefined;
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
                $scope.labelName = undefined;
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
                $scope.linkLabelName = undefined;
                $scope.positioningTitle = 'Choose positioning';
                $scope.positioning = undefined;
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

        // Upload scheme defined in XML or JSON
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
            $scope.nameLabelSet = undefined;
            $scope.exclusiveLabelSet = false;
            $scope.currentLabelsOfLabelSet = [];
            $scope.selectedSpanTypesOfLabelSet = [];
        };

        $scope.resetLinkTypeInputFields = function () {
            $scope.nameLinkType = undefined;
            $scope.startSpanType = undefined;
            $scope.endSpanType = undefined;
            $scope.currentLinkLabels = [];
            $scope.positioning = undefined;
        };

        $scope.submit = function () {
            if ($scope.schemeName === undefined || $scope.schemeName.trim() === "") {
                $scope.alerts.push({type: "warning", msg: "Please define a valid name for your scheme."});
            } else {
                // Check if scheme with this name already exists
                for (var i = 0; i < $scope.loadedSchemes.length; i++) {
                    if ($scope.loadedSchemes[i].name === $scope.schemeName) {
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
                $uibModalInstance.close();
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();
    });
