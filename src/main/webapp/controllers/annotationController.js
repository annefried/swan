'use strict';
//Controller for the annotation window that provides the visualisation directives
//with the necessary data
angular
        .module('app')
        .controller('annotationController', ['$scope', '$window', '$rootScope',
            '$http', 'getAnnotationService', 'textService', 'targetService', 'linkService', 'schemeService', '$q', 'hotkeys',
            function ($scope, $window, $rootScope, $http, getAnnotationService, textService, targetService, linkService, schemeService, $q, hotkeys) {

                //Reads the committed files and builds them into the used data structures
                this.init = function () {
                    this.readData();
                    this.readSchemes();
                    this.buildText();
                    this.buildAnnotations();
                    this.buildLinks();

                    $scope.completed = $window.sessionStorage.completed === 'true';
                };
                //Backend communication
                this.readData = function () {
                    this.annotationDatabase = getAnnotationService.getAnnotations($window.sessionStorage.uId, $window.sessionStorage.docId);
                    this.scheme = schemeService.getScheme($window.sessionStorage.docId);
                    this.plainText = textService.getText($window.sessionStorage.docId);
                    this.targetData = targetService.getTargets($window.sessionStorage.uId, $window.sessionStorage.docId);
                    this.linkData = linkService.getLinks($window.sessionStorage.uId, $window.sessionStorage.docId);
                    
                    // Retrieve projects and process projects
                    var httpProjects = $rootScope.loadProjects();
                    // Wait for both http requests to be answered
                    $q.all([httpProjects]).then(function () {
                        $rootScope.buildTableProjects();
                    });
                    
                };
                
                /**
                 * Opens the annotation tool again with the passed document
                 * 
                 * @param {String} docId The document id to annotate
                 * @param {String} document name
                 * @param {String} projectName the Projects name
                 * @param {Boolean} completed state of the document
                 */
                $scope.openAnnoTool = function (docId, docName, projectName, completed) {
                    $rootScope.initAnnoTool(docId, docName, projectName, completed);
                    $window.location.reload();
                };
                
                //Split words of the text in data structure
                this.buildText = function () {

                    //Split text into lines
                    this.annotationLines = this.plainText.split(/\r?\n/);
                    this.annotationText = [];
                    var start = 0;
                    var end = -1;
                    //Split the text lines into separate words
                    for (var i = 0; i < this.annotationLines.length; i++) {
                        var line = this.annotationLines[i];
                        start = end + 1;
                        end = start + line.length;
                        var annoLine = new TextLine(start, end);
                        var split = 0;
                        for (var j = 0; j < line.length; j++) {
                            if (line[j] === ' ' || line[j] === '\t' || this.isPunctuation(line[j])) {
                                var word = new TextWord(line.substring(split, j), split + start, j + start);
                                var punctuation = new TextWord((line[j]), j + start, j + 1 + start);
                                word.lineIndex = i;
                                word.wordIndex = annoLine.length;
                                punctuation.lineIndex = i;
                                punctuation.wordIndex = annoLine.length + 1;
                                annoLine.words.push(word);
                                annoLine.words.push(punctuation);
                                split = j + 1;
                            }
                        }

                        if (split < line.length) {
                            var word = new TextWord(line.substring(split, line.length), split + start, line.length + start);
                            annoLine.words.push(word);
                        }

                        this.annotationText.push(annoLine);
                    }
                };
                this.buildAnnotations = function () {
                    //Annotations are indexed by their id
                    //annotationData[id] gives the annotation with id 'id'
                    this.annotationData = {};
                    //Assign actual word(tokens) to the annotations
                    var annotations = this.annotationDatabase;
                    for (var a = 0; a < annotations.length; a++) {
                        var start = annotations[a].start;
                        var end = annotations[a].end;
                        var tType = this.getTargetType(annotations[a].targetType.targetType);
                        var color = this.getColor(tType);
                        var anno = new Annotation(color, annotations[a].id, tType);
                        anno.notSure = annotations[a].notSure;
                        this.findWords(start, end, anno);
                        //Add labels
                        for (var l = 0; l < annotations[a].labelMap.length; l++) {
                            var label = annotations[a].labelMap[l];
                            for (var k = 0; k < label.labelSets.length; k++) {
                                var setId = label.labelSets[k].id;
                                var annotationLabel = new AnnotationLabel(label.label.labelId, setId);
                                var labelSet = this.labelTable[setId];
                                anno.setLabel(labelSet, annotationLabel);
                            }
                        }

                        this.annotationData[anno.id] = anno;
                    }
                };
                this.buildLinks = function () {
                    this.annotationLinks = {};
                    for (var i = 0; i < this.linkData.length; i++) {
                        var link = this.linkData[i];
                        var source = this.annotationData[link.annotation1.id];
                        var target = this.annotationData[link.annotation2.id];
                        if (source !== undefined && target !== undefined) {

                            var annotationLink = new AnnotationLink(link.id, source, target);
                            //Add label sets
                            if (this.linkable(source, target)) {
                                for (var id in this.linkLabels[source.tType.tag][target.tType.tag]) {
                                    var linkSet = this.linkLabels[source.tType.tag][target.tType.tag][id];
                                    annotationLink.addSelectableLabel(linkSet);
                                }
                            }
                            for (var j = 0; j < link.labelMap.length; j++) {
                                var label = link.labelMap[j];
                                for (var k = 0; k < label.linkSets.length; k++) {
                                    var setId = label.linkSets[k].id;
                                    var labelSet = this.linkLabels[source.tType.tag][target.tType.tag][setId];
                                    var linkLabel = new AnnotationLabel(label.label.linkLabel, setId);
                                    annotationLink.setLabel(labelSet, linkLabel);
                                }
                            }

                            if (this.annotationLinks[source.id] === undefined)
                                this.annotationLinks[source.id] = {};
                            this.annotationLinks[source.id][target.id] = annotationLink;
                        }
                    }
                };
                //Set the currently selected/active annotation
                this.setSelected = function (item) {
                    if (item === null && this.tempAnno !== undefined && this.tempAnno !== null)
                        this.removeAnnotation(this.tempAnno);
                    if (item === this.selectedNode)
                        this.selectedNode = null;
                    else
                        this.selectedNode = item;
                };
                //Change the label of the currently selected annotation
                this.setSelectedLabel = function (label, labelSet) {
                    if (this.selectedNode !== null && this.selectedNode !== undefined && label !== undefined) {
                        if (labelSet === undefined) {
                            if (this.selectedNode.type === AnnoType.Annotation)
                                labelSet = this.labelTable[label.setID];
                            else {

                                var source = this.selectedNode.source.tType.tag;
                                var target = this.selectedNode.target.tType.tag;
                                labelSet = this.linkLabels[source][target][label.setID];
                            }
                        }

                        this.selectedNode.setLabel(labelSet, label);
                        var labeled = this.selectedNode.isLabeled(labelSet, label);
                        if (this.selectedNode.type === AnnoType.Annotation) {
                            var labelTemplate = {
                                labelId: label.tag,
                                labelSet: [{
                                        id: labelSet.id
                                    }]
                            };
                            if (labeled) {
                                $http.post('tempannot/annotations/addlabel/' + this.selectedNode.id, labelTemplate);
                            } else {
                                // This is a post request and not delete because of a bug with Jersey or AngularJS
                                // It could not put arguments in the body
                                $http.post('tempannot/annotations/removelabel/' + this.selectedNode.id, labelTemplate);
                            }
                        } else {
                            var labelTemplate = {
                                linkLabel: label.tag,
                                linkSet: [{
                                        id: labelSet.id
                                    }]
                            };
                            if (labeled) {
                                $http.post('tempannot/links/addlabel/' + this.selectedNode.id, labelTemplate);
                            } else {
                                $http.post('tempannot/links/removelabel/' + this.selectedNode.id, labelTemplate);
                            }
                        }

                        this.lastSet = this.selectedNode;
                    }
                };
                //Set target type of the currently selected object
                this.setSelectedTargetType = function (targetType) {

                    if (this.selectedNode !== null && this.selectedNode !== undefined && targetType !== undefined
                            && this.selectedNode.type === "Annotation") {
                        this.selectedNode.setTargetType(targetType);
                        this.selectedNode.color = this.getColor(targetType);
                        this.lastSet = this.selectedNode;
                        this.lastTargeted = this.selectedNode;
                        //Check if the selected note is temporary; in this case a new annotation will be added
                        if (this.selectedNode === this.tempAnno) {
                            this.addAnnotation(this.tempAnno);
                            this.tempAnno = null;
                        }

                        this.removeConnectedLinks(this.selectedNode);
                    }
                };
                this.setSelectedTargetTypeAndAdd = function (targetType) {
                    if (this.selectedNode !== null && this.selectedNode !== undefined && targetType !== undefined
                            && this.selectedNode.type === "Annotation") {
                        if (this.selectedNode.tType !== undefined) {
                            $http.post("tempannot/annotations/changett/" + this.selectedNode.id, {'targetType': targetType.tag}).then(function (response) {

                            }, function (error) {
                                $rootScope.addAlert({type: 'danger', msg: 'No server Connection!'});
                            });
                        }
                        this.selectedNode.setTargetType(targetType);
                        this.selectedNode.color = this.getColor(targetType);
                        this.lastSet = this.selectedNode;
                        this.lastTargeted = this.selectedNode;
                        //Check if the selected note is temporary; in this case a new annotation will be added
                        if (this.selectedNode === this.tempAnno) {
                            this.addAnnotation(this.tempAnno);
                            this.tempAnno = null;
                        }

                        this.removeConnectedLinks(this.selectedNode);
                    }
                };
                //Set target type of the temporal annotations
                this.setTemporaryTargetType = function (targetType) {
                    this.tempAnno.setTargetType(targetType);
                    this.tempAnno.color = this.getColor(targetType);
                    this.addAnnotation(this.tempAnno);
                    this.tempAnno = null;
                };
                //Set the temporary annotation.
                //This annotation is temporary and will not be sent to the database.
                //It can be used to create new annotations
                //It will be transformed into a 'real' annotation when it's label is set
                //This is done in the 'setSelectedLabel'-method
                this.setTemporaryAnnotation = function (words) {
                    if (words !== undefined && words.length > 0 && this.annotationMode === "Everything") {

                        //Reset temporal annotation
                        if (this.tempAnno !== undefined && this.tempAnno !== null) {
                            this.tempAnno.onDelete();
                            this.tempAnno.resetWords();
                        }

                        this.tempAnno = new Annotation(this.emptyColor, 0);
                        for (var v = 0; v < words.length; v++)
                            this.tempAnno.addWord(words[v]);
                        this.selectedNode = this.tempAnno;
                        var tType = this.getOnlyTargetType();
                        if (tType !== undefined && $rootScope.ishotkeys !== 'true')
                            this.setTemporaryTargetType(tType);
                    }
                };
                //Adds a new annotation and makes a callback to the backend
                this.addAnnotation = function (annotation) {

                    var jsonTemplate = {
                        "id": null,
                        "user": {
                            "id": $window.sessionStorage.uId
                        },
                        "targetType": {
                            "targetType": annotation.tType.tag
                        },
                        "document": {
                            "id": $window.sessionStorage.docId
                        },
                        "start": annotation.words[0].start,
                        "end": annotation.words[annotation.words.length - 1].end,
                        "text": annotation.words[0].text,
                        "notSure": false
                    };
                    // add to db
                    $http.post("tempannot/annotations", JSON.stringify(jsonTemplate)).then(function (object) {
                        return function (response) {
                            var newId = response.data;
                            object.lastAdded = annotation;
                            object.lastAdded.id = newId;
                            object.annotationData[newId] = object.lastAdded;
                        };
                    }(this), function (err) {
                        $rootScope.addAlert({type: 'danger', msg: 'No server Connection!'});
                    });
                };
                //Deletes an annotatioan and makes a callback to the backend
                this.removeAnnotation = function (annotation) {

                    this.lastRemoved = annotation;
                    if (annotation === this.tempAnno) {
                        this.tempAnno.onDelete();
                        this.tempAnno = null;
                    } else {
                        $http.delete("tempannot/annotations/" + annotation.id).then(function (object) {
                            return function (response) {
                                annotation.onDelete();
                                delete object.annotationData[annotation.id];
                                object.removeConnectedLinks(annotation);
                            };
                        }(this), function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No server Connection!'});
                        });
                    }
                };
                //Add a new link and make a corresponding callback to the backend
                this.addLink = function (source, target) {
                    if (source !== undefined && target !== undefined &&
                            source.type === "Annotation" && target.type === "Annotation" &&
                            source !== this.tempAnno && target !== this.tempAnno &&
                            this.linkable(source, target)) {

                        var jsonTemplate = {
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
                                "targetType": {
                                    "targetType": source.type
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
                                "targetType": {
                                    "targetType": target.type
                                },
                                "start": target.words[0].start,
                                "end": target.words[0].end,
                                "text": target.words[0].text
                            },
                            "labelMap": []
                        };
                        $http.post("tempannot/links", JSON.stringify(jsonTemplate)).then(function (object) {
                            return function (response) {
                                var newId = response.data;
                                var link = new AnnotationLink(newId, source, target);
                                //Add label sets
                                for (var id in object.linkLabels[source.tType.tag][target.tType.tag]) {
                                    var linkSet = object.linkLabels[source.tType.tag][target.tType.tag][id];
                                    link.addSelectableLabel(linkSet);
                                }

                                if (object.annotationLinks[source.id] === undefined)
                                    object.annotationLinks[source.id] = {};
                                object.annotationLinks[source.id][target.id] = link;
                                object.lastAddedLink = link;
                                return link;
                            };
                        }(this), function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No server Connection!'});
                        });
//                        var xmlHttp = new XMLHttpRequest();
//                        xmlHttp.open("POST", "tempannot/links", false); // false for synchronous request
//                        xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
//                        xmlHttp.send(JSON.stringify(jsonTemplate));

//                        this.checkResponseStatusCode(xmlHttp.status);

//                        var newId = xmlHttp.responseText;
//
//                        var link = new AnnotationLink(newId, source, target);
//
//                        //Add label sets
//                        for (var id in this.linkLabels[source.tType.tag][target.tType.tag]) {
//                            var linkSet = this.linkLabels[source.tType.tag][target.tType.tag][id];
//                            link.addSelectableLabel(linkSet);
//                        }
//
//                        if (this.annotationLinks[source.id] === undefined)
//                            this.annotationLinks[source.id] = {};
//
//                        this.annotationLinks[source.id][target.id] = link;
//                        this.lastAddedLink = link;
//                        return link;
                    }
                };
                //Checks if two annotations are linkable depending on their target type
                this.linkable = function (source, target) {
                    return this.linkLabels[source.tType.tag] !== undefined
                            && this.linkLabels[source.tType.tag][target.tType.tag] !== undefined;
                };
                //Remove a link and make a corresponding callback to the backend
                this.removeLink = function (link) {

                    //TODO: db callback;
                    if (link !== undefined) {
                        var source = link.source;
                        var target = link.target;
                        if (source !== undefined && target !== undefined) {
                            this.lastRemovedLink = link;
                            delete this.annotationLinks[source.id][target.id];
                        }
                    }
                };
                //Remove each link that is connected to the object
                this.removeConnectedLinks = function (object) {

                    //Remove all links that have the annotation as the source
                    if (this.annotationLinks[object.id] !== undefined)
                        delete this.annotationLinks[object.id];
                    //Remove all links that have the annotation as the target
                    for (var sourceID in this.annotationLinks) {
                        var source = this.annotationLinks[sourceID];
                        for (var targetID in source) {
                            var link = source[targetID];
                            if (link.target.id === object.id)
                                delete source[targetID];
                        }
                    }
                };
                //Read all data from the commited scheme
                this.readSchemes = function () {
                    this.buildTargetTypes();
                    this.buildLabels();
                    this.buildLinkLabels();
                    this.setAnnotationMode();
                };
                this.buildTargetTypes = function () {
                    this.targetTypes = {};
                    for (var i = 0; i < this.scheme.targetTypes.length; i++) {
                        var type = this.scheme.targetTypes[i];
                        var targetType = new TargetType(i, type.targetType);
                        this.targetTypes[targetType.tag] = targetType;
                    }
                };
                //Return as specific target type when there only this one is
                //assignable in the whole document
                this.getOnlyTargetType = function () {
                    var counter = 0;
                    var targetType;
                    for (var id in this.targetTypes) {
                        targetType = this.targetTypes[id];
                        counter++;
                    }

                    if (counter === 1)
                        return targetType;
                };
                this.buildLabels = function () {
                    this.labelTable = {};
                    for (var i = 0; i < this.scheme.labelSets.length; i++) {
                        var labSet = this.scheme.labelSets[i];
                        var labelSet = new LabelSet(labSet.id, labSet.name, labSet.exclusive);
                        //Add labels to set
                        var listLabel = labSet.labels;
                        for (var j = 0; j < listLabel.length; j++) {
                            var annotationLabel = new AnnotationLabel(listLabel[j].labelId, labSet.id);
                            if (listLabel[j].labelId !== undefined) {
                                labelSet.addLabel(annotationLabel);
                            }
                        }

                        //Connect label set to correlating targets
                        var applyTargets = labSet.appliesToTargetTypes;
                        for (var a = 0; a < applyTargets.length; a++) {
                            var tag = applyTargets[a].targetType;
                            var targetType = this.targetTypes[tag];
                            targetType.addSelectableLabel(labelSet);
                        }

                        this.labelTable[labelSet.id] = labelSet;
                    }
                };
                this.buildLinkLabels = function () {
                    this.linkLabels = {};
                    for (var i = 0; i < this.scheme.linkSets.length; i++) {
                        var linkSet = this.scheme.linkSets[i];
                        var startType = linkSet.startType.targetType;
                        var endType = linkSet.endType.targetType;
                        if (this.linkLabels[startType] === undefined)
                            this.linkLabels[startType] = {};
                        if (this.linkLabels[startType][endType] === undefined)
                            this.linkLabels[startType][endType] = {};
                        var linkLabelSet = new LabelSet(linkSet.id, "LinkSet " + (i + 1), true);
                        this.linkLabels[startType][endType][linkSet.id] = linkLabelSet;
                        //Add labels to set
                        for (var j = 0; j < linkSet.linkLabels.length; j++) {
                            var tag = linkSet.linkLabels[j].linkLabel;
                            if (tag === undefined)
                                tag = "UndefTag";
                            var annotationLabel = new AnnotationLabel(tag, linkSet.id);
                            linkLabelSet.addLabel(annotationLabel);
                        }
                    }
                };
                //Get annotation by id
                this.getAnnotation = function (id) {
                    return this.annotationData[id];
                };
                //Sets wheter every word is annotatable or only preselected targets
                this.setAnnotationMode = function () {
                    //TODO: read this from scheme
                    this.annotationMode = AnnotationMode.Everything;
                };
                //Get target type by its tag
                this.getTargetType = function (tag) {
                    return this.targetTypes[tag];
                };
                //Checks if a character can be characterized as punctuation
                this.isPunctuation = function (string) {
                    return string !== undefined &&
                            (string.length === 1 && (string === "," || string === "." || string === "!" || string === "?"));
                };
                //Returns a color for a specific label zype
                this.getColor = function (type) {
                    if (type === undefined || type.id === undefined)
                        return this.emptyColor;
                    return this.annotationColors[type.id % this.annotationColors.length];
                };
                //Helper method for finding corresponding words in the text
                //that are indexed by star and end
                this.findWords = function (start, end, object) {

                    //Search for first corresponding line
                    var lineStart = 0;
                    while (this.annotationText[lineStart].end < start)
                        lineStart++;
                    //Search for last corresponding line
                    var lineEnd = lineStart;
                    while (this.annotationText[lineEnd].end < end)
                        lineEnd++;
                    var firstLine = this.annotationText[lineStart];
                    var lastLine = this.annotationText[lineEnd];
                    //Search for corresponding text(s) in line
                    var rowStart = 0;
                    while (firstLine.words[rowStart].start < start)
                        rowStart++;
                    var rowEnd = 0;
                    while (lastLine.words[rowEnd].end < end)
                        rowEnd++;
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
                        var textWord = this.annotationText[currentLine].words[w];
                        if (textWord !== undefined) {
                            textWord.setIndices(currentLine, w);
                            object.addWord(textWord);
                        }
                    }
                };
                this.initCompletedCheckbox = function () {
                    //!$window.sessionStorage.complete;
                };
                this.setDocCompleted = function () {

                    var payload = {
                        value: $scope.completed
                    };
                    $window.sessionStorage.completed = $scope.completed;
                    var payloadJson = JSON.stringify(payload);
                    var docUser = $window.sessionStorage.docId + '/' + $window.sessionStorage.uId;
                    $http.post("tempannot/document/" + docUser, payloadJson).then(function (response) {
                        if (response.status === 200) {
                            if ($scope.completed) {
                                $rootScope.addAlert({type: 'success', msg: 'Document marked as completed!'});
                            } else {
                                $rootScope.addAlert({type: 'success', msg: 'Document marked as uncomplete!'});
                            }
                        } else {
                            $rootScope.addAlert({type: 'danger', msg: 'No server connection'});
                        }
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
                        url: 'tempannot/annotations/notsure/' + anno.id,
                        data: JSON.stringify(payload),
                        headers: {'Content-Type': 'application/json'}
                    }).success(function (response) {
                        anno.notSure = boolVal;
                    }).error(function (response) {
                        $rootScope.addAlert({type: 'danger', msg: response.status + ': No server connection.'});
                    });
                };
                this.checkResponseStatusCode = function (status) {
                    if (status >= 400 && status < 500) {
                        $rootScope.addAlert({type: 'danger', msg: 'This action is not allowed.'});
                    } else if (status >= 500 && status < 600) {
                        $rootScope.addAlert({type: 'danger', msg: 'No server connection.'});
                    }
                };
                this.targetColor = new AnnotationColor("Target", "#F2EFE7", "#000000", "#646362");
                this.emptyColor = new AnnotationColor("Empty", "#F2EFE7", "#716C67", "#999791");
                this.emptyLabel = new AnnotationLabel("");
                this.annotationColors = [new AnnotationColor("Red", "#D92929", "#8C1F1F"),
                    new AnnotationColor("Blue", "#2675A6", "#072540"),
                    new AnnotationColor("Violet", "#A770B0", "#795A8F"),
                    new AnnotationColor("Cyan", "#0B8B8C", "#154747"),
                    new AnnotationColor("Green", "#bbff5a", "#67a754"),
                    new AnnotationColor("Yellow", "#F0B849", "#BE3803"),
                    new AnnotationColor("Brown", "#C59070", "#533631"),
                    new AnnotationColor("Orange", "#F98248", "#AA3935"),
                    new AnnotationColor("Gray", "#7E796D", "#716458")
                ];
                this.init();
            }]);

