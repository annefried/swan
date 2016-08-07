/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

/**
 * Controller for the annotation window that provides the visualization directives
 * with the necessary data.
 * 
 * Noteworthy: Some requests are designed as POST requests and not DELETE because
 * of a bug with Jersey or AngularJS. It could not put arguments in the body.
 */
angular
    .module('app')
    .controller('annotationController', ['$scope', '$window', '$rootScope',
        '$http', 'tokenService', 'getAnnotationService', 'textService', 'linkService', 'schemeService', '$q',
        function ($scope, $window, $rootScope, $http, tokenService,
                    getAnnotationService, textService, linkService, schemeService, $q) {

            // Reads the committed files and builds them into the used data structures
            this.init = function () {
                $(function ()
                {
                    $('.scroll-pane').jScrollPane();
                });
                $scope.role = $window.sessionStorage.role;
                if ($window.sessionStorage.role == 'annotator') {
                    $window.sessionStorage.shownUser = $window.sessionStorage.uId;
                } else {
                    this.setUpAnnoView();
                }
                this.readData();
                this.readSchemes();
                this.buildText();
                this.buildAnnotations();
                this.buildLinks();
                $scope.completed = $window.sessionStorage.completed === 'true';
                if ($rootScope.tour !== undefined) {
                    $rootScope.tour.resume();
                }
                $rootScope.initialized = 'true';
            };

            // Backend communication
            this.readData = function () {
                this.annotations = getAnnotationService.getAnnotations($window.sessionStorage.shownUser, $window.sessionStorage.docId);
                this.scheme = schemeService.getScheme($window.sessionStorage.docId);
                this.linkData = linkService.getLinks($window.sessionStorage.shownUser, $window.sessionStorage.docId);
                this.tokenData = tokenService.getTokens($window.sessionStorage.docId);
                // Retrieve projects and process projects
                var httpProjects = $rootScope.loadProjects();
                // Wait for projects to be processed
                $q.all([httpProjects]).then(function () {
                    $rootScope.buildTableProjects();
                    $rootScope.currProj = $rootScope.getProjectByProjectName($window.sessionStorage.project, $rootScope.tableProjects);
                    $rootScope.currDoc = $rootScope.getDocumentByDocumentId($window.sessionStorage.docId, $rootScope.currProj);
                });

            };

            /**
             * Opens the annotation tool again with the passed document
             *
             * @param {String} docId The document id to annotate
             * @param {String} docName name
             * @param {String} projectName the Projects name
             * @param {Boolean} completed state of the document
             */
            $scope.openAnnoTool = function (docId, docName, projectName, completed) {
                $rootScope.initAnnoTool(docId, docName, projectName, completed);
                $window.location.reload();
            };

            this.setUpAnnoView = function () {
                if ($scope.shownUserList === undefined) {
                    $scope.shownUserList = {};
                }
                $scope.users = JSON.parse($window.sessionStorage.users);
                if ($window.sessionStorage.shownUser === "undefined"
                        || $window.sessionStorage.shownUser === undefined
                        || $window.sessionStorage.shownUser == $window.sessionStorage.uId) {
                    if ($scope.users.length > 0) {
                        var firstUserId = $scope.users[0].id;
                        $window.sessionStorage.shownUser = firstUserId;
                    } else {
                        $window.sessionStorage.shownUser = $window.sessionStorage.uId;
                    }

                }
                $scope.shownUserList[$window.sessionStorage.shownUser] = $window.sessionStorage.shownUser;
            };

            this.onUserChange = function () {
            	var form = document.getElementById("users");
                $window.sessionStorage.shownUser = form.elements["users"].value;
                $scope.openAnnoTool($window.sessionStorage.docId,
                        $window.sessionStorage.title,
                        $window.sessionStorage.project,
                        $window.sessionStorage.completed);
            };
            
            $scope.changeCallbackCont = function () {
                $rootScope.changeCallback();
            };

            //Split words of the text in data structure
            this.buildText = function () {

                this.annotationText = [];
                var start = 0;
                var end = -1;
                for (var i = 0; i < this.tokenData.length; i++) {
                    var currentLine = this.tokenData[i].tokens;
                    start = end + 1;
                    end = start + this.tokenData[i].lineLength;
                    var annoLine = new TextLine(start, end);
                    for (var j = 0; j < currentLine.length; j++) {
                        var word = new TextWord(currentLine[j].text, currentLine[j].start, currentLine[j].end);
                        word.lineIndex = i;
                        word.wordIndex = annoLine.words.length;
                        annoLine.words.push(word);
                    }
                    if (annoLine.words.length > 0) {
                        // end of line is end of last word
                        annoLine.end = annoLine.words[annoLine.words.length - 1].end;
                    }
                    // else no words
                    this.annotationText.push(annoLine);
                }

            };
            
            this.buildAnnotations = function () {

                this.initializeDataStructure();

                //Assign actual word(tokens) to the annotations
                var annotations = this.annotations;
                for (var a = 0; a < annotations.length; a++) {
                    var start = annotations[a].start;
                    var end = annotations[a].end;
                    var spanType = this.getSpanType(annotations[a].spanType.name);
                    var anno = new Annotation(color, annotations[a].id, spanType);
                    anno.notSure = annotations[a].notSure;
                    this.findWords(start, end, anno);
                    //Add labels
                    for (var l = 0; l < annotations[a].labelMap.length; l++) {
                        var label = annotations[a].labelMap[l];
                        for (var k = 0; k < label.labelSets.length; k++) {
                            var setId = label.labelSets[k].id;
                            var annotationLabel = new AnnotationLabel(label.label.id, label.label.name, [], setId);
                            var labelSet = this.labelTable[setId];
                            anno.setLabel(labelSet, annotationLabel);
                        }
                    }

                    var color = this.getColor(spanType, anno);
                    anno.color = color;
                    this.addAnnotationToDataStructure(anno);
                }
            };
            
            this.buildLinks = function () {
                this.annotationLinks = {};
                for (var i = 0; i < this.linkData.length; i++) {
                    const link = this.linkData[i];
                    const source = this.annotationIdMap[link.annotation1.id];
                    const target = this.annotationIdMap[link.annotation2.id];
                    if (source !== undefined && target !== undefined) {

                        var annotationLink = new AnnotationLink(link.id, source, target);
                        //Add label sets
                        if (this.linkable(source, target)) {
                            for (var id in this.linkLabels[source.sType.tag][target.sType.tag]) {
                                const linkType = this.linkLabels[source.sType.tag][target.sType.tag][id];
                                annotationLink.addSelectableLabel(linkType);
                            }
                        }
                        for (var j = 0; j < link.labelMap.length; j++) {
                            var label = link.labelMap[j];
                            for (var k = 0; k < label.linkTypes.length; k++) {
                                const setId = label.linkTypes[k].id;
                                const labelSet = this.linkLabels[source.sType.tag][target.sType.tag][setId];
                                const linkLabel = new AnnotationLabel(label.label.id, label.label.name, label.label.options, setId);
                                annotationLink.setLabel(labelSet, linkLabel);
                            }
                        }

                        if (this.annotationLinks[source.id] === undefined)
                            this.annotationLinks[source.id] = {};
                        this.annotationLinks[source.id][target.id] = annotationLink;
                    }
                }
            };
            
            // Set the currently selected/active annotation
            this.setSelected = function (item) {
                if (item === null && this.tempAnno !== undefined && this.tempAnno !== null)
                    this.removeAnnotation(this.tempAnno);
                if (item === this.selectedNode)
                    this.selectedNode = null;
                else {
                    this.selectedNode = item;
                }
            };
            
            // Change the label of the currently selected annotation
            this.setSelectedLabel = function (label, labelSet) {
                if (this.selectedNode !== null
                        && this.selectedNode !== undefined
                        && label !== undefined) {
                    if (labelSet === undefined) {
                        if (this.selectedNode.type === AnnoType.Annotation)
                            labelSet = this.labelTable[label.setID];
                        else {
                            var source = this.selectedNode.source.sType.tag;
                            var target = this.selectedNode.target.sType.tag;
                            labelSet = this.linkLabels[source][target][label.setID];
                        }
                    }

                    this.selectedNode.setLabel(labelSet, label);
                    var labeled = this.selectedNode.isLabeled(labelSet, label);

                    var labelTemplate;
                    var url;
                    
                    // Annotation
                    if (this.selectedNode.type === AnnoType.Annotation) {
                        labelTemplate = {
                            id: label.id,
                            name: label.tag,
                            labelSet: [{
                                id: labelSet.id
                            }]
                        };
                        
                        url = labeled ? 'swan/annotations/addlabel/' : 'swan/annotations/removelabel/';
                    } else { // Link
                        labelTemplate = {
                            id: label.id,
                            name: label.tag,
                            linkType: [{
                                id: labelSet.id
                            }]
                        };
                        
                        url = labeled ? 'swan/links/addlabel/' : 'swan/links/removelabel/';
                    }
                    $http.post(url + this.selectedNode.id, labelTemplate);

                    this.selectedNode.color = this.getColor(this.selectedNode.sType, this.selectedNode);
                    this.lastSet = this.selectedNode;
                    this.changeLinkLabel = { "link": this.selectedNode, "label": label};
                }
            };
            
            // Update an existing annotation and send request
            this.updateAnno = function (newAnno, oldStart, newStart, oldEnd, newEnd) {

                // Check if changed annotation has new properties which match with an existing annotation
                // so that the start, end and span types are the same which is not allowed
                if ((oldStart != newStart || oldEnd != newEnd)
                        && this.isSpanTypeAlreadyApplied(newAnno, newAnno.sType)) {
                    this.removeAnnotation(newAnno);
                    this.displayDuplicateAnnotationWarning();
                    return;
                }

                var jsonTemplate = {
                    "id": newAnno.id,
                    "user": {
                        "id": $window.sessionStorage.uId
                    },
                    "spanType": {
                        "name": newAnno.sType.tag
                    },
                    "document": {
                        "id": $window.sessionStorage.docId
                    },
                    "start": newAnno.words[0].start,
                    "end": newAnno.words[newAnno.words.length - 1].end,
                    "text": newAnno.text,
                    "notSure": newAnno.notSure
                };
                // Send request
                $http.put("swan/annotations", JSON.stringify(jsonTemplate)).then(function (object) {
                    return function (response) {
                        object.sizeIncreased = newAnno;
                        object.updateDataStructure(newAnno, oldStart);
                    };
                }(this), function (err) {
                    $rootScope.addAlert({type: 'danger', msg: 'No server Connection!'});
                });
            };
            
            // Reset sizeIncreased variable to prevent changes from happening twice
            this.resetSizeIncreased = function () {
                this.sizeIncreased = undefined;
                this.selectedNode.updatedWords = [];
                this.selectedNode.removedWord = undefined;
            };
            
            // Increase size of currently selected Node by one word
            this.increaseSelectedAnnoSizeRight = function (oldStart, oldEnd) {
                if (this.selectedNode !== null
                		&& this.selectedNode !== undefined
                        && this.selectedNode.type === AnnoType.Annotation) {

                    const word = this.nextWord(this.selectedNode.endIndex());
                    oldStart = oldStart || this.selectedNode.startIndex();
                    oldEnd = oldEnd || this.selectedNode.endIndex();
                    if (word !== undefined) {
                        this.selectedNode.addWord(word);
                        if (this.selectedNode.updatedWords === undefined) {
                            this.selectedNode.updatedWords = [];
                        }
                        this.selectedNode.updatedWords.push(word);
                    }
                    if (word !== undefined && word.text === " ") {
                        this.increaseSelectedAnnoSizeRight(oldStart);
                        return;
                    }
                    if (this.tempAnno !== this.selectedNode) {
                        const newStart = this.selectedNode.startIndex();
                        const newEnd = this.selectedNode.endIndex();
                        this.updateAnno(this.selectedNode, oldStart, newStart, oldEnd, newEnd);
                    }
                }
            };
            
            this.increaseSelectedAnnoSizeLeft = function (oldStart, oldEnd) {
                if (this.selectedNode !== null
                        && this.selectedNode !== undefined
                        && this.selectedNode.type === AnnoType.Annotation) {

                    const word = this.previousWord(this.selectedNode.words[0].end);
                    oldStart = oldStart || this.selectedNode.startIndex();
                    oldEnd = oldEnd || this.selectedNode.endIndex();
                    if (word !== undefined) {
                        this.selectedNode.addWordBefore(word);
                        if (this.selectedNode.updatedWords === undefined) {
                            this.selectedNode.updatedWords = [];
                        }
                        this.selectedNode.updatedWords.push(word);
                    }
                    if (word !== undefined && word.text === " ") {
                        this.increaseSelectedAnnoSizeLeft(oldStart);
                        return;
                    }
                    if (this.tempAnno !== this.selectedNode) {
                        const newStart = this.selectedNode.startIndex();
                        const newEnd = this.selectedNode.endIndex();
                        this.updateAnno(this.selectedNode, oldStart, newStart, oldEnd, newEnd);
                    }
                }

            };
            
            // Decrease size of currently selected node by one word
            this.decreaseSelectedAnnoSizeRight = function () {
                if (this.selectedNode !== null
                        && this.selectedNode !== undefined
                        && this.selectedNode.type === AnnoType.Annotation) {

                    const oldStart = this.selectedNode.startIndex();
                    const oldEnd = this.selectedNode.endIndex();
                    var word = this.selectedNode.removeLastWord();
                    this.selectedNode.removedWord = word;
                    if (word !== undefined && this.previousWord(word.end).text === " ") {
                        word = this.selectedNode.removeLastWord();
                    }
                    if (this.tempAnno !== this.selectedNode) {
                        const newStart = this.selectedNode.startIndex();
                        const newEnd = this.selectedNode.endIndex();
                        this.updateAnno(this.selectedNode, oldStart, newStart, oldEnd, newEnd);
                    }
                }
            };
            
            this.decreaseSelectedAnnoSizeLeft = function () {
                if (this.selectedNode !== null
                        && this.selectedNode !== undefined
                        && this.selectedNode.type === AnnoType.Annotation) {

                    const oldStart = this.selectedNode.startIndex();
                    const oldEnd = this.selectedNode.endIndex();
                    var word = this.selectedNode.removeFirstWord();
                    this.selectedNode.removedWord = word;
                    if (word !== undefined && this.nextWord(word.end).text === " ") {
                        word = this.selectedNode.removeFirstWord();
                    }
                    if (this.tempAnno !== this.selectedNode) {
                        const newStart = this.selectedNode.startIndex();
                        const newEnd = this.selectedNode.endIndex();
                        this.updateAnno(this.selectedNode, oldStart, newStart, oldEnd, newEnd);
                    }
                }
            };

            /**
             * Sets the passed span and applies it to the selected node. If
             * the node has already an applied span type it creates a request
             * to the backend. If necessary links will be removed which depend
             * on the old span type.
             *
             * @param spanType
             */
            this.setSelectedSpanTypeAndAdd = function (spanType) {
                if (this.selectedNode !== null
                        && this.selectedNode !== undefined
                        && spanType !== undefined
                        && this.selectedNode.type === AnnoType.Annotation) {

                    if (this.isSpanTypeAlreadyApplied(this.selectedNode, spanType)) {
                        this.removeAnnotation(this.selectedNode);
                        this.displayDuplicateAnnotationWarning();
                        return;
                    } else if (this.selectedNode.sType !== undefined) {
                    	const url = "swan/annotations/changest/" + this.selectedNode.id;
                        $http.post(url, {'name': spanType.tag}).success(function (response) {

                        }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                        });
                    }
                    
                    this.selectedNode.setSpanType(spanType);
                    this.selectedNode.color = this.getColor(spanType, undefined);
                    this.lastSet = this.selectedNode;
                    this.lastTargeted = this.selectedNode;
                    // Check if the selected node is temporary; in this case a new annotation will be added
                    if (this.selectedNode === this.tempAnno) {
                        this.addAnnotation(this.tempAnno);
                        this.tempAnno = null;
                    }

                    this.removeConnectedLinks(this.selectedNode);
                }
            };
            
            // Set span type of the temporal annotations
            this.setTemporarySpanType = function (spanType) {
                this.tempAnno.setSpanType(spanType);
                this.tempAnno.color = this.getColor(spanType, undefined);
                this.addAnnotation(this.tempAnno);
                this.tempAnno = null;
            };
            
            /**
             * Sets the temporary annotation. It can be used to create a new annotation.
             * It will be transformed into a persistent annotation when a a span type
             * is applied.
             * 
             * @param words
             */
            this.setTemporaryAnnotation = function (words) {
                if (words !== undefined
                        && words.length > 0
                        && this.annotationMode === AnnotationMode.Everything) {

                    //Reset temporal annotation
                    if (this.tempAnno !== undefined && this.tempAnno !== null) {
                        this.tempAnno.onDelete();
                        this.tempAnno.resetWords();
                    }

                    this.tempAnno = new Annotation(this.emptyColor, 0);
                    for (var v = 0; v < words.length; v++)
                        this.tempAnno.addWord(words[v]);
                    this.selectedNode = this.tempAnno;
                    var sType = this.getOnlySpanType();
                    if (sType !== undefined && $rootScope.ishotkeys !== 'true')
                        this.setTemporarySpanType(sType);
                }
            };
            
            //Adds a new annotation and makes a callback to the backend
            this.addAnnotation = function (annotation) {

                const jsonTemplate = {
                    "id": null,
                    "user": {
                        "id": $window.sessionStorage.uId
                    },
                    "spanType": {
                        "name": annotation.sType.tag
                    },
                    "document": {
                        "id": $window.sessionStorage.docId
                    },
                    "start": annotation.words[0].start,
                    "end": annotation.words[annotation.words.length - 1].end,
                    "text": annotation.words[0].text,
                    "notSure": false
                };
                // Request to backend
                $http.post("swan/annotations", JSON.stringify(jsonTemplate)).then(function (object) {
                    return function (response) {
                        var newId = response.data;
                        object.lastAdded = annotation;
                        object.lastAdded.id = newId;
                        object.addAnnotationToDataStructure(object.lastAdded);
                    };
                }(this), function (err) {
                    $rootScope.checkResponseStatusCode(err.status);
                });
            };
            
            //Deletes an annotation and makes a callback to the backend
            this.removeAnnotation = function (annotation) {
                this.sizeIncreased = undefined;
                if (annotation === this.tempAnno) {
                    this.tempAnno.onDelete();
                    this.tempAnno = null;
                    this.lastRemoved = annotation;
                } else {
                    var annoCtrl = this;
                    $http.delete("swan/annotations/" + annotation.id).then(function (object) {
                        return function (response) {
                            object.removeConnectedLinks(annotation);
                            annoCtrl.lastRemoved = annotation;
                            annotation.onDelete();
                            object.removeAnnotationFromDataStructure(annotation);
                        };
                    }(this), function (err) {
                        $rootScope.checkResponseStatusCode(err.status);
                    });
                }
            };
            
            //Add a new link and make a corresponding callback to the backend
            this.addLink = function (source, target) {
                var deferred = $q.defer();
                if (source !== undefined
                        && target !== undefined
                        && source.type === AnnoType.Annotation
                        && target.type === AnnoType.Annotation
                        && source !== this.tempAnno
                        && target !== this.tempAnno
                        && this.linkable(source, target)) {

                    const jsonTemplate = {
                        "id": null,
                        'user': {
                            'id': $window.sessionStorage.uId
                        },
                        'document': {
                            'id': $window.sessionStorage.docId
                        },
                        "annotation1": {
                            "id": source.id,
                            'user': {
                                'id': $window.sessionStorage.uId
                            },
                            'document': {
                                'id': $window.sessionStorage.docId
                            },
                            "spanType": {
                                "name": source.type
                            },
                            "start": source.words[0].start,
                            "end": source.words[0].end,
                            "text": source.words[0].text
                        },
                        "annotation2": {
                            "id": target.id,
                            'user': {
                                'id': $window.sessionStorage.uId
                            },
                            'document': {
                                'id': $window.sessionStorage.docId
                            },
                            "spanType": {
                                "name": target.type
                            },
                            "start": target.words[0].start,
                            "end": target.words[0].end,
                            "text": target.words[0].text
                        },
                        "labelMap": []
                    };
                    $http.post("swan/links", JSON.stringify(jsonTemplate)).then(function (object) {
                        return function (response) {
                            var newId = response.data;
                            var link = new AnnotationLink(newId, source, target);
                            //Add link types
                            for (var id in object.linkLabels[source.sType.tag][target.sType.tag]) {
                                const linkType = object.linkLabels[source.sType.tag][target.sType.tag][id];
                                link.addSelectableLabel(linkType);
                            }

                            if (object.annotationLinks[source.id] === undefined)
                                object.annotationLinks[source.id] = {};
                            object.annotationLinks[source.id][target.id] = link;
                            object.lastAddedLink = link;
                            deferred.resolve(link);
                        };
                    }(this), function (err) {
                        $rootScope.checkResponseStatusCode(err.status);
                        deferred.reject(undefined);
                    });

                } else {
                    deferred.reject(undefined);
                }

                return deferred.promise;
            };
            
            // Checks if two annotations are linkable depending on their span type
            this.linkable = function (source, target) {
                if (this.annotationLinks !== undefined && this.annotationLinks[source.id] !== undefined) {
                    var alreadyExists = (this.annotationLinks[source.id][target.id] !== undefined)
                } else {
                    var alreadyExists = false;
                }
                return this.linkLabels[source.sType.tag] !== undefined
                        && this.linkLabels[source.sType.tag][target.sType.tag] !== undefined
                        && !alreadyExists;
            };
            
            // Remove a link and make a corresponding callback to the backend
            this.removeLink = function (link) {

                if (link !== undefined) {
                    $http.delete("swan/links/" + link.id).then(function (object) {
                        return function (response) {
                            var source = link.source;
                            var target = link.target;
                            if (source !== undefined && target !== undefined) {
                                object.lastRemovedLink = link;
                                delete object.annotationLinks[source.id][target.id];
                                var entry = object.annotationLinks[source.id];
                                if (Object.keys(entry).length <= 0) {
                                    delete object.annotationLinks[source.id];
                                }
                            }
                        };
                    }(this), function (err) {
                        $rootScope.checkResponseStatusCode(err.status);
                    });
                }
            };
            
            // Remove each link that is connected to the object
            this.removeConnectedLinks = function (object) {

                //Remove all links that have the annotation as the source
                if (this.annotationLinks[object.id] !== undefined)
                    delete this.annotationLinks[object.id];
                //Remove all links that have the annotation as the target
                for (var sourceID in this.annotationLinks) {
                    var source = this.annotationLinks[sourceID];
                    for (var targetID in source) {
                        const link = source[targetID];
                        if (link.target.id === object.id) {
                            delete source[targetID];
                        }
                    }
                }
            };
            
            // Read all data from the committed scheme
            this.readSchemes = function () {
                $scope.graph = {
                    "show": false,
                    "isOpen": false
                };
                $scope.timeline = {
                    "show": false,
                    "isOpen": false
                };
                for (var i = 0; i < this.scheme.visElements.length; i++) {
                    var visElement = this.scheme.visElements[i];
                    if (visElement.visKind === "graph") {
                    	$scope.graph.show = visElement.visState === "hidden" ? false : true;
                        $scope.graph.isOpen = visElement.visState === "opened" ? true : false;
                    } else if (visElement.visKind === "timeline") {
                        $scope.timeline.show = visElement.visState === "hidden" ? false : true;
                        $scope.timeline.isOpen = visElement.visState === "opened" ? true : false;
                    }
                }		

                this.buildSpanTypes();
                this.buildLabels();
                this.buildLinkLabels();
                this.setAnnotationMode();
            };
            
            this.buildSpanTypes = function () {
                this.spanTypes = {};
                for (var i = 0; i < this.scheme.spanTypes.length; i++) {
                    var type = this.scheme.spanTypes[i];
                    var spanType = new SpanType(i, type.name);
                    this.spanTypes[spanType.tag] = spanType;
                }
            };
            
            //Return as specific span type when there only this one is
            //assignable in the whole document
            this.getOnlySpanType = function () {
                var counter = 0;
                var spanType;
                for (var id in this.spanTypes) {
                    spanType = this.spanTypes[id];
                    counter++;
                }

                if (counter === 1)
                    return spanType;
            };
            
            this.buildLabels = function () {
                this.labelTable = {};
                for (var i = 0; i < this.scheme.labelSets.length; i++) {
                    var labSet = this.scheme.labelSets[i];
                    var labelSet = new LabelSet(labSet.id, labSet.name, labSet.exclusive);
                    //Add labels to set
                    var listLabel = labSet.labels;
                    for (var j = 0; j < listLabel.length; j++) {
                        var oLabel = listLabel[j];
                        var annotationLabel = new AnnotationLabel(oLabel.id, oLabel.name, [], labSet.id);
                        if (listLabel[j].name !== undefined) {
                            labelSet.addLabel(annotationLabel);
                        }
                    }

                    // Connect label set to correlating span types
                    var applySpanTypes = labSet.appliesToSpanTypes;
                    for (var a = 0; a < applySpanTypes.length; a++) {
                        var tag = applySpanTypes[a].name;
                        var spanType = this.spanTypes[tag];
                        spanType.addSelectableLabel(labelSet);
                    }

                    this.labelTable[labelSet.id] = labelSet;
                }
            };

            this.buildLinkLabels = function () {
                this.linkLabels = {};
                for (var i = 0; i < this.scheme.linkTypes.length; i++) {
                    var linkType = this.scheme.linkTypes[i];
                    var startSpanType = linkType.startSpanType.name;
                    var endSpanType = linkType.endSpanType.name;
                    if (this.linkLabels[startSpanType] === undefined)
                        this.linkLabels[startSpanType] = {};
                    if (this.linkLabels[startSpanType][endSpanType] === undefined)
                        this.linkLabels[startSpanType][endSpanType] = {};
                    var linkLabelSet = new LabelSet(linkType.id, linkType.name, true);
                    this.linkLabels[startSpanType][endSpanType][linkType.id] = linkLabelSet;
                    //Add labels to set
                    for (var j = 0; j < linkType.linkLabels.length; j++) {
                        var linkLabel = linkType.linkLabels[j];
                        var tag = linkLabel.name;
                        if (tag === undefined) {
                            tag = "UndefTag";
                        }
                        var annotationLabel = new AnnotationLabel(linkLabel.id, tag, linkLabel.options, linkType.id);
                        linkLabelSet.addLabel(annotationLabel);
                    }
                }
            };
            
            this.getAnnotationById = function (id) {
                return this.annotationIdMap[id];
            };

            this.getAnnotationListByStart = function (start) {
                return this.annotationStartMap[start];
            };

            this.addAnnotationToDataStructure = function (annotation) {
                this.annotationIdMap[annotation.id] = annotation;
                // Create or add list
                if (this.annotationStartMap[annotation.startIndex()] == undefined) {
                    this.annotationStartMap[annotation.startIndex()] = [annotation];
                } else {
                    this.annotationStartMap[annotation.startIndex()].push(annotation);
                }
            };

            this.removeAnnotationFromDataStructure = function (annotation) {
                delete this.annotationIdMap[annotation.id];
                const annoList = this.annotationStartMap[annotation.startIndex()];
                for (var i = 0; i < annoList.length; i++) {
                    if (annotation === annoList[i]) {
                        annoList.splice(i, 1);
                    }
                }
            };

            this.updateDataStructure = function (annotation, oldStart) {
                const annoList = this.annotationStartMap[oldStart];
                for (var i = 0; i < annoList.length; i++) {
                    if (annotation.id === annoList[i].id) {
                        annoList.splice(i, 1);
                    }
                }
                this.addAnnotationToDataStructure(annotation);
            };

            this.initializeDataStructure = function () {
                // annotationIdMap maps an annotations id to the annotation itself
                this.annotationIdMap = {};
                // annotationStartMap maps an annotations start attribute to all annotations
                // which have that start attribute
                this.annotationStartMap = {};
            };
            
            // Sets whether every word is annotatable or only preselected span types
            this.setAnnotationMode = function () {
                //TODO: read this from scheme
                this.annotationMode = AnnotationMode.Everything;
            };
            
            // Get span type by its tag
            this.getSpanType = function (tag) {
                return this.spanTypes[tag];
            };
            
            // Checks if a character can be characterized as punctuation
            this.isPunctuation = function (string) {
                return string !== undefined &&
                        (string.length === 1 && (string === "," || string === "." || string === "!" || string === "?"));
            };
            
            this.getCharacterSum = function (str) {
                var sum = 0;
                for (var i = 0; i < str.length; i++) {
                    sum += str.charCodeAt(i);
                }
                return sum;
            };
            
            // Returns a color for a specific label type
            this.getColor = function (type, anno) {
                if (type === undefined || type.id === undefined)
                    return this.emptyColor;
                var col = this.annotationColors[type.id % this.annotationColors.length];
                if (anno !== undefined && anno.activeLabels !== undefined) {
                    var labelMapId = Object.keys(anno.activeLabels)[0];
                    if (labelMapId !== undefined) {
                        var labelSet = anno.activeLabels[labelMapId];
                        var num = this.getCharacterSum(labelSet[0].tag);
                        return this.cloneAnnotationColor(num, col);
                    }
                }

                return col;
            };
            
            // Helper function to find next word
            this.nextWord = function (end) {
                var found = false;
                var start = 0;
                var ending = -1;
                for (var i = 0; i < this.tokenData.length; i++) {
                    var line = this.tokenData[i].tokens;
                    start = ending + 1;
                    ending = start + this.tokenData[i].lineLength;
                    var annoLine = new TextLine(start, ending);
                    for (var j = 0; j < line.length; j++) {
                        var word = new TextWord(line[j].text, line[j].start, line[j].end);
                        word.lineIndex = i;
                        word.wordIndex = annoLine.words.length;
                        annoLine.words.push(word);
                        if (found) {
                            return word;
                        }
                        if (line[j].end === end) {
                            found = true;
                        }
                    }
                }
            };

            //Helper function to find previous word
            this.previousWord = function (end) {
                var start = 0;
                var ending = -1;
                var prevWord;
                for (var i = 0; i < this.tokenData.length; i++) {
                    var line = this.tokenData[i].tokens;
                    start = ending + 1;
                    ending = start + this.tokenData[i].lineLength;
                    var annoLine = new TextLine(start, ending);
                    for (var j = 0; j < line.length; j++) {
                        var word = new TextWord(line[j].text, line[j].start, line[j].end);
                        word.lineIndex = i;
                        word.wordIndex = annoLine.words.length;
                        annoLine.words.push(word);
                        if (line[j].end === end) {
                            return prevWord;
                        }
                        prevWord = word;
                    }
                }
            };
            
            //Helper function for finding corresponding words in the text
            //that are indexed by start and end
            this.findWords = function (start, end, object) {

                //Search for first corresponding line
                var lineStart = 0;
                var endL = this.annotationText[lineStart].end;
                while (endL < start) {
                    lineStart++;
                    endL = this.annotationText[lineStart].end;
                }
                
                //Search for last corresponding line
                var lineEnd = lineStart;
                while (this.annotationText[lineEnd].end < end) {
                    lineEnd++;
                }
                
                var firstLine = this.annotationText[lineStart];
                var lastLine = this.annotationText[lineEnd];
                
                while (lastLine.words.length === 0) {
                    // use previous line as last line
                    lineEnd--;
                    lastLine = this.annotationText[lineEnd];
                }
                //Search for corresponding text(s) in line
                var rowStart = 0;
                while (firstLine.words[rowStart] !== undefined
                        && firstLine.words[rowStart].start < start) {
                    rowStart++;
                }
                
                var rowEnd = 0;
                while (lastLine.words[rowEnd].end < end) {
                    rowEnd++;
                }
                    
                var currentLine = lineStart;
                var currentRow = rowStart;
                while (currentLine < lineEnd) {
                    for (var w = currentRow; w < this.annotationText[currentLine].words.length; w++) {

                        var textWord = this.annotationText[currentLine].words[w];
                        if (textWord !== undefined) {
                            textWord.setIndices(currentLine, w);
                            object.addWord(textWord);
                        }
                    }

                    currentLine++;
                    currentRow = 0;
                }

                for (var w = currentRow; w <= rowEnd; w++) {
                    const textWord = this.annotationText[currentLine].words[w];
                    if (textWord !== undefined) {
                        textWord.setIndices(currentLine, w);
                        object.addWord(textWord);
                    }
                }
            };
            
            this.nextDoc = function (next) {
                var found = false;
                const proj = $rootScope.currProj;
                for (var j = 0; j < proj.documents.length && !found; j++) {
                    var doc = proj.documents[j];
                    if (doc.id == $window.sessionStorage.docId) {
                        // Next document
                        if (next === 1) {
                            if (j + 1 >= proj.documents.length) {
                                doc = proj.documents[0];
                            } else {
                                doc = proj.documents[j + 1];
                            }
                        } else if (next === -1) { // Previous document
                            if (j - 1 < 0) {
                                doc = proj.documents[proj.documents.length - 1];
                            } else {
                                doc = proj.documents[j - 1];
                            }
                        }

                        found = true;
                        $scope.openAnnoTool(doc.id, doc.name, $window.sessionStorage.project, doc.completed);
                    }
                }

                if (!found) {
                    throw "AnnotationController: Could not find the given project and document";
                }
            };
            
            this.setDocCompleted = function () {
                var payload = {
                    value: $scope.completed
                };
                var payloadJson = JSON.stringify(payload);
                var docUser = $window.sessionStorage.docId + '/' + $window.sessionStorage.uId;

                $http.post("swan/document/" + docUser, payloadJson).success(function (response) {
                    $window.sessionStorage.completed = $scope.completed;
                    $rootScope.currDoc.completed = $scope.completed;
                    if ($scope.completed) {
                        $rootScope.addAlert({type: 'success', msg: 'Document marked as completed!'});
                    } else {
                        $rootScope.addAlert({type: 'success', msg: 'Document marked as incomplete!'});
                    }
                }).error(function (response) {
                    $rootScope.checkResponseStatusCode(response.status);
                });
            };
            
            // TODO change here, should be called with a second parameter "true"/ "false"
            // and change the hardcoded payload
            this.setAnnotationNotSure = function (anno) {
                var boolVal = !anno.notSure;
                var payload = {
                    'value': boolVal
                };
                $http({
                    method: 'POST',
                    url: 'swan/annotations/notsure/' + anno.id,
                    data: JSON.stringify(payload),
                    headers: {'Content-Type': 'application/json'}
                }).success(function (response) {
                    anno.notSure = boolVal;
                }).error(function (response) {
                    $rootScope.checkResponseStatusCode(response.status);
                });
            };

            this.isSpanTypeAlreadyApplied = function (node, targetSpanType) {
                const annoList = this.getAnnotationListByStart(node.startIndex());
                if (annoList !== undefined) {
                    for (var i = 0; i < annoList.length; i++) {
                        const anno = annoList[i];
                        if (anno.endIndex() == node.endIndex()
                                && anno.sType == targetSpanType
                                && anno !== node) {
                            
                            return true;
                        }
                    }
                }

                return false;
            };

            this.displayDuplicateAnnotationWarning = function () {
                $rootScope.addAlert({
                    type: 'warning',
                    msg: 'An annotation was removed because it had the same start, end and span type ' +
                            'properties like an already existing one.'});
            };

            this.cloneAnnotationColor = function (num, color) {
                return new AnnotationColor(color.name, num, color.shades, color.back, color.line);
            };

            this.targetColor = new AnnotationColor("Target", 0, ["#F2EFE7"], "#000000", "#646362");
            this.emptyColor = new AnnotationColor("Empty", 0, ["#F2EFE7"], "#716C67", "#999791");
            this.emptyLabel = new AnnotationLabel("");

            var redShades = ["#591010", "#9a1b1b", "#dd3f3f", "#e56a6a", "#f0abab", "#fcecec"];
            var blueShades = ["#0e2c3f", "#1c587e", "#2575a8", "#449dd6", "#83bee4", "#c2dff2"];
            var violetShades = ["#911491", "#d41dd4", "#eb6ceb", "#f199f1", "#fadcfa"];
            var greenShades = ["#004e00", "#008100", "#00ce00", "#1cff1c", "#9cff9c", "#e9ffe9"];

            this.annotationColors = [// AnnotationColor(name, num, shades, back, line)
                new AnnotationColor("Red", 0, redShades, "#8C1F1F", undefined),
                new AnnotationColor("Blue", 0, blueShades, "#072540", undefined),
                new AnnotationColor("Violet", 0, violetShades, "#795A8F", undefined),
                new AnnotationColor("Green", 0, greenShades, "#67a754", undefined)
//                    new AnnotationColor("Cyan", 0, undefined, "#154747", undefined), // TODO https://github.com/annefried/swan/issues/70
//                    new AnnotationColor("Yellow", 0, undefined, "#BE3803", undefined),
//                    new AnnotationColor("Brown", 0, undefined, "#533631", undefined),
//                    new AnnotationColor("Orange", 0, undefined, "#AA3935", undefined),
//                    new AnnotationColor("Grey", 0, undefined, "#716458", undefined)
            ];

            $scope.$on("$destroy", function () {
                delete $window.sessionStorage.shownUser;
                $rootScope.initialized = 'false';
            });
            
            if ($rootScope.initialized !== 'true')
                this.init();
        }
    ]);

