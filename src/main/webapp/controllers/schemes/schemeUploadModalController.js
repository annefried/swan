/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('schemeUploadModalController', function ($scope, $rootScope, $http, $sce, $uibModal, $uibModalInstance, $window) {

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
            $scope.targetIdCounter = 0;
            $scope.labelLabelSetIdCounter = 0;
            $scope.labelLinkSetIdCounter = 0;
            $scope.targets = [];
            $scope.selectedTargetsLabel = [];
            $scope.linkSets = [];
            $scope.currentLabelSet = [];
            $scope.currentLinkSet = [];
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
            } else if (scheme.targetTypes == undefined) {
                $http.get("swan/scheme/byid/" + scheme.id).success(function (response) {
                    const resScheme = JSOG.parse(JSON.stringify(response.scheme));
                    scheme = $scope.processScheme(resScheme);
                    $scope.setSchemeProperties(scheme);
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

        $scope.processScheme = function (scheme) {
            // Target Types
            var targetTypes = [];
            for (var j = 0; j < scheme.targetTypes.length; j++) {
                targetTypes.push(scheme.targetTypes[j].targetType);
            }
            // Label Sets
            var labelSets = [];
            for (var j = 0; j < scheme.labelSets.length; j++) {
                var labelSet = scheme.labelSets[j];
                var appliesToTargetTypes = [];
                for (var k = 0; k < labelSet.appliesToTargetTypes.length; k++) {
                    var targetType = labelSet.appliesToTargetTypes[k];
                    appliesToTargetTypes.push(targetType.targetType);
                }
                var labels = [];
                for (var k = 0; k < labelSet.labels.length; k++) {
                    var label = labelSet.labels[k];
                    labels.push(label.labelId);
                }
                var labelSetTemplate = {
                    name: labelSet.name,
                    exclusive: labelSet.exclusive,
                    appliesToTargetTypes: appliesToTargetTypes,
                    labels: labels
                };
                labelSets.push(labelSetTemplate);
            }
            // ToDo: Link Sets
            var linkSets = [];
            for (var j = 0; j < scheme.linkSets.length; j++) {
                var linkSet = scheme.linkSets[j];
                var startType = linkSet.startType.targetType;
                var endType = linkSet.endType.targetType;
                var linkLabels = [];
                for (var k = 0; k < linkSet.linkLabels.length; k++) {
                    var linkLabel = {
                        linkLabel: linkSet.linkLabels[k].linkLabel,
                        options: linkSet.linkLabels[k].options
                    };
                    linkLabels.push(linkLabel);
                }
                var linkSetTemplate = {
                    name: linkSet.name,
                    startType: startType,
                    endType: endType,
                    linkLabels: linkLabels
                };
                linkSets.push(linkSetTemplate);
            }

            var template = {
                id: scheme.id,
                name: scheme.name,
                targetTypes: targetTypes,
                labelSets: labelSets,
                linkSets: linkSets
            };

            return template;
        };

        $scope.setSchemeProperties = function (scheme) {
            $scope.name = "Copy of " + scheme.name;
            $scope.targets = scheme.targetTypes;
            $scope.labelSets = scheme.labelSets;
            $scope.linkSets = scheme.linkSets;
            $scope.loadScheme = true;
        };

        $scope.sendScheme = function () {
            try {
                var currUser = {"id": parseInt($window.sessionStorage.uId)}; // TODO maybe global
                var fileTemplate = {
                    "id": null,
                    "name": $scope.name,
                    "creator": currUser,
                    "targetTypes": $scope.targets,
                    "labelSets": $scope.labelSets,
                    "linkSets": $scope.linkSets,
                    "projects": []
                };
                var file = fileTemplate;
                try {
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

                    // TargetTypes
                    var targetTypes = [];
                    for (var i = 0; i < file.targetTypes.length; i++) {
                        var targetType = {
                            targetType: file.targetTypes[i]
                        };
                        targetTypes.push(targetType);
                    }
                    // Constructing Label Sets
                    var labelSets = [];
                    for (var i = 0; i < file.labelSets.length; i++) {
                        // Constructing appliesToTarget
                        var appliesToTargetTypes = [];
                        for (var j = 0; j < file.labelSets[i].appliesToTargetTypes.length; j++) {
                            var targetType = {
                                targetType: file.labelSets[i].appliesToTargetTypes[j]
                            };
                            appliesToTargetTypes.push(targetType);
                        }
                        // Construct Labels
                        var labels = [];
                        for (var j = 0; j < file.labelSets[i].labels.length; j++) {
                            var label = {
                                "labelId": file.labelSets[i].labels[j]
                            };
                            labels.push(label);
                        }
                        var labelSet = {
                            "name": file.labelSets[i].name,
                            "exclusive": file.labelSets[i].exclusive,
                            "appliesToTargetTypes": appliesToTargetTypes,
                            "labels": labels
                        };
                        labelSets.push(labelSet);
                    }
                    var linkSets = [];
                    for (var i = 0; i < file.linkSets.length; i++) {
                        var startType = {
                            targetType: file.linkSets[i].startType
                        };
                        var endType = {
                            targetType: file.linkSets[i].endType
                        };
                        var linkLabels = [];
                        for (var j = 0; j < file.linkSets[i].linkLabels.length; j++) {
                            var oLinkLabel = file.linkSets[i].linkLabels[j];
                            var linkLabel = {
                                linkLabel: oLinkLabel.name,
                                // Change this later if more options are needed
                                options: [oLinkLabel.options]
                            };
                            linkLabels.push(linkLabel);
                        }

                        var linkSet = {
                            "name": file.linkSets[i].name,
                            "startType": startType,
                            "endType": endType,
                            "allowUnlabeledLinks": file.linkSets[i].allowUnlabeledLinks,
                            "linkLabels": linkLabels
                        };
                        linkSets.push(linkSet);
                    }
                    var template = {
                        "id": null,
                        "name": file.name,
                        "creator": currUser,
                        "visElements": visElements,
                        "targetTypes": targetTypes,
                        "labelSets": labelSets,
                        "linkSets": linkSets,
                        "projects": []
                    };
                    $http.post("discanno/scheme", JSON.stringify(template)).success(function (response) {
                        $rootScope.schemesTable[template.name] = template;
                        var schemePreview = {
                            'id': response,
                            'name': template.name,
                            "creator": currUser,
                            "visElements": visElements,
                            'tableIndex': $scope.schemeCounter++,
                            'projects': [],
                            'labelSetCount': template.labelSets.length,
                            'linkSetCount': template.linkSets.length
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
                    for (var i = 0; i < $scope.linkSets.length; i++) {
                        var linkSet = $scope.linkSets[i];
                        for (var j = 0; j < linkSet.linkLabels.length; j++) {
                            var linkLabel = linkSet.linkLabels[j];
                            linkLabel.options = undefined;
                        }
                    }
                }
                // Reset the options attribute of the link labels which belong to
                // the not yet added link sets
                for (var i = 0; i < $scope.currentLinkSet.length; i++) {
                    $scope.currentLinkSet[i].options = undefined;
                }
                $scope.noView.checked = true;
                $scope.graphView.checked = false;
                $scope.timelineView.checked = false;
            } else if (kind === "Graph") {
                // If timeline was the last selected visualization kind all
                // positioning options have to be resetted
                if ($scope.timelineView.checked) {
                    for (var i = 0; i < $scope.linkSets.length; i++) {
                        var linkSet = $scope.linkSets[i];
                        for (var j = 0; j < linkSet.linkLabels.length; j++) {
                            var linkLabel = linkSet.linkLabels[j];
                            linkLabel.options = undefined;
                        }
                    }
                }
                // Reset the options attribute of the link labels which belong to
                // the not yet added link sets
                for (var i = 0; i < $scope.currentLinkSet.length; i++) {
                    $scope.currentLinkSet[i].options = undefined;
                }
                $scope.noView.checked = false;
                $scope.graphView.checked = true;
                $scope.timelineView.checked = false;
            } else if (kind === "Timeline") {
                $scope.noView.checked = false;
                $scope.graphView.checked = false;
                $scope.timelineView.checked = true;
                // Reset all link sets because the positioning attribute for link
                // labels is mandatory
                $scope.linkSets = [];
                $scope.currentLinkSet = [];
            }
        };

        $scope.getLinkSetHeadline = function () {
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
                    || $scope.selectedTargetsLabel.length < 1
                    || $scope.currentLabelSet.length < 1;
        };

        $scope.disableLinkSetButton = function () {
            return $scope.nameLinkSet === undefined
                    || $scope.nameLinkSet === ''
                    || $scope.startType === undefined
                    || $scope.endType === undefined
                    || ($scope.timelineView.checked && $scope.linkSets.length >= 1);
        };

        /**
         * Called when clicking the add Button for a LabelSet
         */
        $scope.addLabelSet = function () {
            var labels = [];
            for (var i = 0; i < $scope.currentLabelSet.length; i++) {
                labels.push($scope.currentLabelSet[i].name);
            }
            var appliesToTargetTypes = [];
            for (var i = 0; i < $scope.selectedTargetsLabel.length; i++) {
                appliesToTargetTypes.push($scope.selectedTargetsLabel[i]);
            }
            var newLabelSet = {
                name: $scope.nameLabelSet,
                exclusive: $scope.exclusiveLabelSet,
                labels: labels,
                appliesToTargetTypes: appliesToTargetTypes
            };
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.labelSets.length; i++) {
                if ($scope.labelSets[i].name === newLabelSet.name) {
                    nameAlreadyUsed = true;
                    break;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A Label set with this name is already part of this scheme.'});
            } else {
                $scope.labelSets.push(newLabelSet);
                // reset input fields
                $scope.nameLabelSet = undefined;
                $scope.exclusiveLabelSet = false;
                $scope.currentLabelSet = [];
                $scope.selectedTargetsLabel = [];
            }
        };

        /**
         * Called when clicking the edit button in scheme table on label set.
         * @param {type} name : name of label set to be edited
         */
        $scope.editLabelSet = function (name) {
            // find label set to be edited
            var selectedSet = undefined;
            for (var i = 0; i < $scope.labelSets.length; i++) {
                if ($scope.labelSets[i].name === name) {
                    selectedSet = $scope.labelSets[i];
                    for (var j = 0; j < $scope.labelSets[i].labels.length; j++) {
                        $scope.addLabelToLabelSet($scope.labelSets[i].labels[j]);
                    }
                    break;
                }
            }
            // reset editing fields
            $scope.nameLabelSet = name;
            $scope.exclusiveLabelSet = $scope.labelSets[i].exclusive;
            $scope.selectedTargetsLabel = selectedSet.appliesToTargetTypes;

            // remove from table
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
         * Called when clicking add Button for LinkSet.
         */
        $scope.addLinkSet = function () {
            var labels = [];
            for (var i = 0; i < $scope.currentLinkSet.length; i++) {
                var linkLabel = {
                    "name": $scope.currentLinkSet[i].name,
                    // Change this later to an array if more options are needed
                    "options": $scope.currentLinkSet[i].options
                };
                labels.push(linkLabel); // TODO naming is cruel thats not a linkSet
            }
            var newLinkSet = {
                name: $scope.nameLinkSet,
                startType: $scope.startType,
                endType: $scope.endType,
                linkLabels: labels
            };

            $scope.linkSets.push(newLinkSet);
            // reset input fields
            $scope.startType = undefined;
            $scope.nameLinkSet = undefined;
            $scope.endType = undefined;
            $scope.currentLinkSet = [];
            $scope.selectedTargetsLink = [];
        };

        /**
         * Called when clicking editing button in scheme table
         *
         * @param {link set object} set
         * @returns {undefined}
         */
        $scope.editLinkSet = function (set) {
            // find the link set to be edited
            var selectedSet = undefined;
            for (var i = 0; i < $scope.linkSets.length; i++) {
                if ($scope.linkSets[i] === set) {
                    $scope.currentLinkSet = [];
                    for (var j = 0; j < $scope.linkSets[i].linkLabels.length; j++) {
                        var linkLabel = $scope.linkSets[i].linkLabels[j];
                        $scope.addLabelToLinkSet(linkLabel.name, linkLabel.options);
                    }
                    selectedSet = $scope.linkSets[i];
                    break;
                }
            }
            // set fields
            $scope.nameLinkSet = selectedSet.name;
            $scope.startType = selectedSet.startType;
            $scope.endType = selectedSet.endType;

            // remove from table while editing
            $scope.removeLinkSet(set);
        };

        /**
         * Called when clicking 'x'-Button in SchemeTable on a LinkSet.
         * @param {type} set : LinkSet to remove
         */
        $scope.removeLinkSet = function (set) {
            for (var i = 0; i < $scope.linkSets.length; i++) {
                if ($scope.linkSets[i] === set) {
                    $scope.linkSets.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addTargetTypeLabel = function (target) {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.selectedTargetsLabel.length; i++) {
                if ($scope.selectedTargetsLabel[i] === target) {
                    nameAlreadyUsed = true;
                    break;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A target type can only be added once!'});
            } else {
                $scope.selectedTargetsLabel.push(target);
            }
        };

        $scope.removeTargetTypeLabel = function (name) {
            for (var i = 0; i < $scope.selectedTargetsLabel.length; i++) {
                if ($scope.selectedTargetsLabel[i] === name) {
                    $scope.selectedTargetsLabel.splice(i, 1);
                    break;
                    }
            }
        };

        $scope.selectedTargetsLabelFilter = function (value, index, array) {
            var ret = true;
            for (var i = 0; i < $scope.selectedTargetsLabel.length; i++) {
                if (value === $scope.selectedTargetsLabel[i]) {
                    ret = false;
                }
            }
            return ret;
        };

        $scope.addTargetType = function (targetType) {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.targets.length; i++) {
                if ($scope.targets[i] === targetType) {
                    nameAlreadyUsed = true;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A target type with this name already exists!'});
            } else {
                $scope.targets.push(targetType);
                $scope.targetType = undefined;
            }
        };

        $scope.removeTargeType = function (name) {
            for (var i = 0; i < $scope.targets.length; i++) {
                if ($scope.targets[i] === name) {
                    var label = $scope.targets[i];
                    $scope.targets.splice(i, 1);
                }
            }
            // Remove potential tTypes in Link and Label Sets
            for (var i = 0; i < $scope.selectedTargetsLabel.length; i++) {
                if ($scope.selectedTargetsLabel[i] === name) {
                    $scope.selectedTargetsLabel.splice(i, 1);
                }
            }
            var i = $scope.labelSets.length;
            while (i--) {
                var labelSet = $scope.labelSets[i];
                for (var j = 0; j < labelSet.appliesToTargetTypes.length; j++) {
                    if (label === labelSet.appliesToTargetTypes[j]) {
                        $scope.labelSets.splice(i, 1);
                    }
                }

            }
            var i = $scope.linkSets.length;
            while (i--) {
                var labelSet = $scope.linkSets[i];
                if (labelSet.startType === label || labelSet.endType === label) {
                    $scope.linkSets.splice(i, 1);
                }

            }
        };

        $scope.addLabelToLabelSet = function (labelName) {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.currentLabelSet.length; i++) {
                if ($scope.currentLabelSet[i].name === labelName) {
                    nameAlreadyUsed = true;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A label with this name already exists!'});
            } else {
                $scope.currentLabelSet.push({name: labelName, id: $scope.labelLabelSetIdCounter++});
                $scope.labelName = undefined;
            }
        };

        $scope.addLabelToLinkSet = function (labelName, positioning) {
            var nameAlreadyUsed = false;
            for (var i = 0; i < $scope.currentLinkSet.length; i++) {
                if ($scope.currentLinkSet[i].name === labelName) {
                    nameAlreadyUsed = true;
                    break;
                }
            }
            if (nameAlreadyUsed) {
                $rootScope.addAlert({type: 'danger', msg: 'A label with this name already exists!'});
            } else {
                var link = {name: labelName,
                            id: $scope.labelLinkSetIdCounter++,
                            options: positioning};
                $scope.currentLinkSet.push(link);
                $scope.linkLabelName = undefined;
                $scope.positioningTitle = 'Choose positioning';
                $scope.positioning = undefined;
            }
        };

        $scope.removeLabelFromLabelSet = function (id) {
            var i = $scope.currentLabelSet.length;
            while (i--) {
                if ($scope.currentLabelSet[i].id === id) {
                    $scope.currentLabelSet.splice(i, 1);
                }
            }
        };

        $scope.removeLabelFromLinkSet = function (id) {
            var i = $scope.currentLinkSet.length;
            while (i--) {
                if ($scope.currentLinkSet[i].id === id) {
                    $scope.currentLinkSet.splice(i, 1);
                }
            }
        };

        $scope.loadPreloadedScheme = function (preloadedScheme) {
            $scope.name = "Copy of " + preloadedScheme.name;
            $scope.targets = preloadedScheme.targetTypes;
            $scope.labelSets = preloadedScheme.labelSets;
            $scope.linkSets = preloadedScheme.linkSets;
            $scope.loadScheme = true;
        };

        // Upload scheme defined in XML or json document
        $scope.uploadScheme = function ($fileContent) {
            try {
                var xmlDoc = $.parseXML($fileContent);
                var xml = xmlDoc.responseXML;
                // xml2json function is in 'other' folder.
                var content = xml2json(xmlDoc, "");

                content = content.replace("[{[{", "[{");
                content = content.replace("[{[{", "[{");

                content = content.replace("}]}]", "}]");
                content = content.replace("}]}]", "}]");
            } catch (e) {
                content = $fileContent;
            }

            try {
                $scope.uploadedScheme = content;
                var scheme = JSON.parse(content);

                // Map from 'new' scheme to 'old' scheme
                // TODO: adjust terminology in back-end at some point,
                // then this won't be necessary any more.
                scheme.targetTypes = scheme.spanTypes;
                scheme.linkSets = scheme.linkTypes;
                delete scheme.spanTypes;
                delete scheme.linkTypes;
                for (var i = 0; i < scheme.labelSets.length; i++) {
                    scheme.labelSets[i].appliesToTargetTypes = scheme.labelSets[i].appliesToSpanTypes;
                    delete scheme.labelSets[i].appliesToSpanType;
                }
                for (var i = 0; i < scheme.linkSets.length; i++) {
                    scheme.linkSets[i].startType = scheme.linkSets[i].startSpanType;
                    scheme.linkSets[i].endType = scheme.linkSets[i].endSpanType;
                    delete scheme.linkSets[i].startSpanType;
                    delete scheme.linkSets[i].endSpanType;
                }

                // Validate scheme
                // TODO rename target type to span type
                var tTypeMap = {}; // for constant access
                for (var i = 0; i < scheme.targetTypes.length; i++) {
                    var tType = scheme.targetTypes[i];
                    tTypeMap[tType.toString()] = tType;
                }
                for (var i = 0; i < scheme.labelSets.length; i++) {
                    var labelSet = scheme.labelSets[i];
                    for (var j = 0; j < labelSet.appliesToTargetTypes.length
                            && j < labelSet.appliesToTargetTypes[j].length; j++) {
                        if (labelSet.appliesToTargetTypes[j].length === 1) {
                            var tType = labelSet.appliesToTargetTypes;
                        } else {
                            var tType = labelSet.appliesToTargetTypes[j];
                        }
                        if (tTypeMap[tType.toString()] === undefined) {
                            throw "Annotation type not defined";
                        }
                    }
                }
                for (var i = 0; i < scheme.linkSets.length; i++) {
                    var linkSet = scheme.linkSets[i];
                    if (tTypeMap[linkSet.startType] === undefined
                            || tTypeMap[linkSet.endType] === undefined) {
                        throw "Annotation type not defined";
                    }
                }

                if (typeof scheme.targetTypes === 'string') {
                    var targetType = [scheme.targetTypes];
                    scheme.targetTypes = targetType;
                }
                for (var i = 0; i < scheme.labelSets.length; i++) {
                    if (typeof scheme.labelSets[i].appliesToTargetTypes === 'string') {
                        var targetType = [scheme.labelSets[i].appliesToTargetTypes];
                        scheme.labelSets[i].appliesToTargetTypes = targetType;
                    }
                    if (typeof scheme.labelSets[i].labels === 'string') {
                        var labels = [scheme.labelSets[i].labels];
                        scheme.labelSets[i].labels = labels;
                    }
                }
                for (var i = 0; i < scheme.linkSets.length; i++) {
                    if (typeof scheme.linkSets[i].linkLabels === 'string') {
                        var targetType = [scheme.linkSets[i].linkLabels];
                        scheme.linkSets[i].linkLabels = targetType;
                    }
                }
                try {
                    $scope.name = "Copy of " + scheme.name;
                    $scope.labelSets = scheme.labelSets;
                    $scope.linkSets = scheme.linkSets;
                    $scope.targets = scheme.targetTypes;
                } catch (ex) {
                    $rootScope.addAlert({type: 'danger', msg: 'The selected file does not contain a valid annotation scheme. Reason: ' + ex});
                }
            } catch (ex) {
                $rootScope.addAlert({type: 'danger', msg: 'Selected file does not contain a valid annotation scheme. Reason: ' + ex});
            }
        };

        $scope.submit = function () {

            if ($scope.name === undefined || $scope.name.trim() === "") {
                $scope.alerts.push({type: "warning", msg: "Please define a name for your scheme!"});
            } else {
                // check if scheme with this name exists
                for (var i = 0; i < $scope.loadedSchemes.length; i++) {
                    if ($scope.loadedSchemes[i].name === $scope.name) {
                        $scope.alerts.push({type: "warning", msg: "A scheme with this name already exists."});
                        return;
                    }
                }
                // valid scheme name given
                // are some annotation types defined?
                if ($scope.targets.length === 0) {
                    $scope.alerts.push({type: "warning", msg: "You need to define at least one Annotation Type."});
                    return;
                }

                // valid, create scheme.
                $scope.sendScheme();
                $uibModalInstance.close();
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init();
    });