/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
import lastOrUndefined = ts.lastOrUndefined;

/**
 * Created by Timo Guehring on 04.11.16.
 */
describe('Test annotationController', function () {
    beforeEach(angular.mock.module('app'));

    var $controller;

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('Setup tests', function () {
        var controller, $injector, $scope, $rootScope, $window, $http,
                tokenService, getAnnotationService, linkService, schemeService;

        // For asynchronous statements and promises
        var $q;

        beforeEach(
            inject(
                function (_$controller_, $controller, _$injector_, _$q_, _$rootScope_, _$window_, _$http_,
                            _tokenService_, _getAnnotationService_, _linkService_, _schemeService_) {
                    $injector = _$injector_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;
                    $scope = $rootScope.$new();
                    $window = _$window_;
                    $http = _$http_;
                    tokenService = _tokenService_;
                    getAnnotationService = _getAnnotationService_;
                    linkService = _linkService_;
                    schemeService = _schemeService_;

                    $window.sessionStorage.role = 'annotator';
                    $window.sessionStorage.isAnnotator = 'true';
                    $window.sessionStorage.uId = '3';
                    $scope.isUnprivileged = 'true';
                    $window.sessionStorage.docId = '1';
                    $window.sessionStorage.projectId = '1';

                    spyOn(getAnnotationService, "getAnnotations").and.returnValue([testAnnotationEntity, testAnnotationEntity2]);
                    spyOn(schemeService, "getScheme").and.returnValue(testScheme);
                    spyOn(linkService, "getLinks").and.returnValue([testLink]);
                    spyOn(tokenService, "getTokens").and.returnValue(testTokenData);

                    //mock rootController, this is very hacky
                    $rootScope.loadProjectById = {};
                    spyOn($rootScope, "loadProjectById").and.callFake(function () {
                        $rootScope.currProj = testProject;
                        var d = $q.defer();
                        d.resolve(testProject);
                        return d.promise;
                    });

                    $rootScope.buildDocumentsByAnnotator = {};
                    spyOn($rootScope, "buildDocumentsByAnnotator").and.returnValue(testDocumentsUser3);

                    $rootScope.getDocumentByDocumentId = {};
                    spyOn($rootScope, "getDocumentByDocumentId").and.returnValue(testDocumentsUser3[0]);

                    $rootScope.alerts = [];
                    $rootScope.addAlert = {};
                    spyOn($rootScope, "addAlert").and.callFake(function (alert) {
                        $rootScope.alerts.push(alert)
                    });

                    controller = $controller('annotationController', {
                        $scope: $scope,
                        $window: $window,
                        $rootScope: $rootScope,
                        $http: $http,
                        tokenService: tokenService,
                        getAnnotationService: getAnnotationService,
                        textService: linkService,
                        schemeService: schemeService,
                        $q: $q
                    });

                    $scope.$apply();
                }));

        it('Test init', function () {
            expect($controller).toBeDefined();
            expect($scope.role).toEqual('annotator');
            expect($window.sessionStorage.shownUser).toEqual('3');
            expect($rootScope.initialized).toEqual('true');
        });

        it('Test readData', function () {
            spyOn($scope, 'buildDocuments');

            controller.readData();
            $scope.$apply();

            expect(controller.annotations).toEqual([testAnnotationEntity, testAnnotationEntity2]);
            expect(controller.scheme).toEqual(testScheme);
            expect(controller.linkData).toEqual([testLink]);
            expect(controller.tokenData).toEqual(testTokenData);
            expect($rootScope.currProj).toEqual(testProject);
            expect($scope.buildDocuments).toHaveBeenCalled();
        });

        it('Test buildDocuments', function () {
            $window.sessionStorage.shownUser = '3';
            $rootScope.currProj = testProject;

            $scope.buildDocuments();
            expect($rootScope.documents).toEqual(testDocumentsUser3);
            expect($rootScope.currDoc).toEqual(testDocumentsUser3[0]);
            expect($scope.completed).toEqual(true);
        });


        it('Test readSchemes', function () {
            controller.scheme = testScheme;
            controller.readSchemes();

            expect($scope.timeline.show).toEqual(false);
            expect($scope.timeline.isOpen).toEqual(false);
            expect($scope.graph.show).toEqual(true);
            expect($scope.graph.isOpen).toEqual(true);
            
            
            // Test buildSpantypes
            expect(controller.spanTypes["Situation"]).toBeDefined();
            var type: SpanType = controller.spanTypes["Situation"];
            expect(type.name).toEqual("Situation");
            expect(type.id).toEqual(1);

            // Test buildLabels
            expect(controller.labelTable[1]).toBeDefined();
            var labelSet: AnnotationLabelSet = controller.labelTable[1];
            expect(labelSet).toEqual(testAnnotationLabelSets[0]);
            expect(type.selectableLabels[1]).toEqual(labelSet);
            
            // Test buildLinkLabels
            expect(controller.linkLabels["Situation"]["Situation"][2]).toBeDefined();
            var linkLabelSet: AnnotationLabelSet = controller.linkLabels["Situation"]["Situation"][2];
            expect(linkLabelSet).toEqual(testAnnotationLinkTypes[0]);

            // Test setAnnotationMode
            expect(controller.annotationMode).toEqual(AnnotationMode.Everything);
        });

        //TODO Test openAnnoTool
        
        it('Test setUpAnnoView with existing users', function () {
            $window.sessionStorage.role == 'admin';
            $window.sessionStorage.users = JSON.stringify(testUsers);

            controller.setUpAnnoView();

            expect(window.sessionStorage.shownUser).toEqual('0');
            expect($scope.shownUserList['0']).toBeDefined();
            expect($scope.shownUserList['0']).toEqual('0');
        });

        it('Test setUpAnnoView with no users', function () {
            $window.sessionStorage.role == 'admin';
            $window.sessionStorage.users = '[]';

            controller.setUpAnnoView();

            expect(window.sessionStorage.shownUser).toEqual('3');
            expect($scope.shownUserList['3']).toBeDefined();
            expect($scope.shownUserList['3']).toEqual('3');
        });
        
        it('Test onUserChange', function () {
            $window.sessionStorage.shownUser = '3';

            spyOn($scope, 'openAnnoTool');

            var htmlElement = '<form id="users">' +
                '<input type="radio" name="users" value="4" >' +
                '</form>';
            document.body.insertAdjacentHTML(
                'afterbegin',
                htmlElement);

            controller.onUserChange();
            expect(window.sessionStorage.shownUser).toEqual('4');
            expect($scope.openAnnoTool).toHaveBeenCalled();
        });
        
        it('Test buildText', function () {
            controller.tokenData = testTokenData;
            controller.buildText();
            
            expect(controller.annotationText.length).toEqual(2);

            var line1 = controller.annotationText[0];
            expect(line1.start).toEqual(0);
            expect(line1.end).toEqual(9);
            expect(line1.words.length).toEqual(4);
            expect(line1.words[0].text).toEqual('Line');
            expect(line1.words[0].start).toEqual(0);
            expect(line1.words[0].end).toEqual(4);
        });

        it('Test initializeDataStructure', function () {
            controller.annotationIdMap = null;
            controller.annotationStartMap = null;

            controller.initializeDataStructure();
            expect(controller.annotationIdMap).toEqual({});
            expect(controller.annotationStartMap).toEqual({});
        });
        
        it('Test getSpanType', function () {
            controller.spanTypes = {"Situation": testSpanType};

            var span: SpanType = controller.getSpanType("Situation");
            expect(span).toEqual(testSpanType);
        });
        
        it('Test addAnnotationToDataStructure', function () {
            controller.annotationIdMap = {};
            controller.annotationStartMap = {};
            controller.addAnnotationToDataStructure(testAnnotation);
            
            expect(controller.annotationIdMap[testAnnotation.id]).toEqual(testAnnotation);
            expect(controller.annotationStartMap[testAnnotation.startIndex()]).toEqual([testAnnotation]);
        });

        it('Test findWords', function () {
            controller.tokenData = testTokenData;
            controller.buildText();

            var anno: Annotation = new Annotation(null, testAnnotationEntity.id, testAnnotationSpanType);

            controller.findWords(testAnnotationEntity.start, testAnnotationEntity.end, anno);
            expect(anno.words.length).toEqual(5);
            expect(anno.text).toEqual("one,line two");
        });
        
        it('Test buildAnnotations', function () {
            controller.annotations = [testAnnotationEntity];
            controller.buildAnnotations();

            expect(controller.annotationIdMap[testAnnotationEntity.id]).toBeDefined();
            var anno: Annotation = controller.annotationIdMap[testAnnotationEntity.id];
            expect(anno.id).toEqual(3);
            expect(anno.text).toEqual("one,line two")
            expect(anno.notSure).toEqual(false);
            expect(anno.selectableLabels[1].name).toEqual(testSpanType.selectableLabels[1].name);
            expect(anno.activeLabels[1]).toBeDefined();
            expect(anno.activeLabels[1][0].name).toEqual("State");
            expect(anno.sType.name).toEqual(testSpanType.name);
            expect(anno.words.length).toEqual(5);
        });
        
        it('Test buildLinks', function () {
            controller.linkData = [testLink];
            controller.buildLinks();

            expect(controller.annotationLinks[testAnnotationEntity.id][testAnnotationEntity2.id]).toBeDefined();
            var link: AnnotationLink = controller.annotationLinks[testAnnotationEntity.id][testAnnotationEntity2.id];
            expect(link.id).toEqual(1);
            expect(link.selectableLabels[2].labels.length).toEqual(testLinkLabels.length);
            expect(link.activeLabels[2].length).toEqual(1);
            expect(link.activeLabels[2][0].name).toEqual("after");
            expect(link.source.text).toEqual("one,line two");
            expect(link.target.text).toEqual("Line");
        });

        it('Test setSelected with null', function () {
            spyOn(controller, 'removeAnnotation');
            
            controller.setSelected(null);
            expect(controller.selectedNode).toEqual(null);
            expect(controller.removeAnnotation).not.toHaveBeenCalled();

            controller.tempAnno = testAnnotation;
            controller.setSelected(null);
            expect(controller.removeAnnotation).toHaveBeenCalled();
        });
        
        it('Test setSelected', function () {
            controller.selectedNode = null;
            controller.setSelected(testAnnotation);
            expect(controller.selectedNode).toEqual(testAnnotation);

            // unselect again
            controller.setSelected(testAnnotation);
            expect(controller.selectedNode).toEqual(null);
        });
        
        it('Test setSelectedLabel with Annotation', function () {
            var $httpBackend = $injector.get('$httpBackend');
            const urlAdd = 'swan/annotations/addlabel/';
            const urlRemove = 'swan/annotations/removelabel/';

            $httpBackend
                .when('POST', urlAdd + testAnnotation.id)
                .respond(200, testAnnotation.id);

            $httpBackend
                .expect('POST', urlAdd + testAnnotation.id);

            $httpBackend
                .when('POST', urlRemove + testAnnotation.id)
                .respond(200);

            $httpBackend
                .expect('POST', urlRemove + testAnnotation.id);
            
            controller.selectedNode = testAnnotation;
            expect(controller.selectedNode.isLabeled(testAnnotationLabelSets[0],testAnnotationLabels[0])).toEqual(false);

            // add
            controller.setSelectedLabel(testAnnotationLabels[0], testAnnotationLabelSets[0]);
            expect(controller.selectedNode.isLabeled(testAnnotationLabelSets[0],testAnnotationLabels[0])).toEqual(true);

            // remove
            controller.setSelectedLabel(testAnnotationLabels[0], testAnnotationLabelSets[0]);
            expect(controller.selectedNode.isLabeled(testAnnotationLabelSets[0],testAnnotationLabels[0])).toEqual(false);
            expect($httpBackend.flush).not.toThrow();
        });

        it('Test setSelectedLabel with Link', function () {
            var $httpBackend = $injector.get('$httpBackend');
            const urlAdd = 'swan/links/addlabel/';
            const urlRemove = 'swan/links/removelabel/';

            $httpBackend
                .when('POST', urlAdd + testLinkAnnotation.id)
                .respond(200, testLinkAnnotation.id);

            $httpBackend
                .expect('POST', urlAdd + testLinkAnnotation.id);

            $httpBackend
                .when('POST', urlRemove + testLinkAnnotation.id)
                .respond(200);

            $httpBackend
                .expect('POST', urlRemove + testLinkAnnotation.id);

            controller.selectedNode = testLinkAnnotation;
            expect(controller.selectedNode.isLabeled(testAnnotationLinkTypes[0],testAnnotationLinkLabels[0])).toEqual(false);

            // add
            controller.setSelectedLabel(testAnnotationLinkLabels[0], testAnnotationLinkTypes[0]);
            expect(controller.selectedNode.isLabeled(testAnnotationLinkTypes[0],testAnnotationLinkLabels[0])).toEqual(true);

            // remove
            controller.setSelectedLabel(testAnnotationLinkLabels[0], testAnnotationLinkTypes[0]);
            expect(controller.selectedNode.isLabeled(testAnnotationLinkTypes[0],testAnnotationLinkLabels[0])).toEqual(false);
            expect($httpBackend.flush).not.toThrow();
        });

        it('Test updateAnno', function () {
            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/annotations';

            var jsonTemplate = {
                "id": testAnnotation2.id,
                "user": {
                    "id": $window.sessionStorage.uId
                },
                "spanType": {
                    "id": testAnnotation2.sType.id,
                    "name": testAnnotation2.sType.name
                },
                "document": {
                    "id": $window.sessionStorage.docId
                },
                "start": testAnnotation2.words[0].start,
                "end": testAnnotation2.words[testAnnotation2.words.length - 1].end,
                "text": testAnnotation2.text,
                "notSure": testAnnotation2.notSure
            };

            $httpBackend
                .when('PUT', url, JSON.stringify(jsonTemplate))
                .respond(200, testAnnotation2.id);

            $httpBackend
                .expect('PUT', url, JSON.stringify(jsonTemplate));

            spyOn(controller, 'updateDataStructure');

            controller.updateAnno(testAnnotation2, 0, testAnnotation2.startIndex(), 10, testAnnotation2.endIndex());
            expect($httpBackend.flush).not.toThrow();
            expect(controller.sizeIncreased).toEqual(testAnnotation2);
            expect(controller.updateDataStructure).toHaveBeenCalled();


        });

        it('Test updateAnno with existing identical annotation', function () {
            spyOn(controller, 'removeAnnotation');
            spyOn(controller, 'displayDuplicateAnnotationWarning');

            var duplicateAnno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            duplicateAnno.addWord(testTextWord1);

            controller.annotationStartMap[0] = [testAnnotation2];
            controller.updateAnno(duplicateAnno, 0, duplicateAnno.startIndex(), 10, duplicateAnno.endIndex());

            expect(controller.removeAnnotation).toHaveBeenCalled();
            expect(controller.displayDuplicateAnnotationWarning).toHaveBeenCalled();
            
        });

        it('Test resetSizeIncreased', function () {
            controller.sizeIncreased = testAnnotation;
            controller.selectedNode = testAnnotation;
            controller.selectedNode.updatedWords = [testTextWord1];
            controller.selectedNode.removedWord = testTextWord1;

            controller.resetSizeIncreased();
            expect(controller.sizeIncreased).toEqual(undefined);
            expect(controller.selectedNode.updatedWords).toEqual([]);
            expect(controller.selectedNode.removedWord).toEqual(undefined);
        });
        
        it('Test nextWord', function () {
            var nextWord : TextWord = controller.nextWord(5);
            expect(nextWord.text).toEqual('one');

            // Test across line boundaries
            nextWord = controller.nextWord(9);
            expect(nextWord.text).toEqual('line');

            // Test for last word
            nextWord = controller.nextWord(18);
            expect(nextWord).toEqual(undefined);
        });
        
        it('Test increaseSelectedAnnoSizeRight', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord1);
            controller.selectedNode = Anno;
            spyOn(controller, 'updateAnno');

            controller.increaseSelectedAnnoSizeRight(Anno.startIndex(), Anno.endIndex());
            expect(controller.selectedNode.startIndex()).toEqual(0);
            expect(controller.selectedNode.endIndex()).toEqual(8);
            expect(controller.selectedNode.words.length).toEqual(3);
            expect(controller.updateAnno).toHaveBeenCalled();
        });

        it('Test previousWord', function () {
            var prevWord : TextWord = controller.previousWord(5);
            expect(prevWord.text).toEqual('Line');

            // Test across line boundaries
            prevWord = controller.previousWord(13);
            expect(prevWord.text).toEqual(',');

            // Test for first word
            prevWord = controller.previousWord(4);
            expect(prevWord).toEqual(undefined);
        });

        it('Test increaseSelectedAnnoSizeLeft', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord2);
            controller.selectedNode = Anno;
            spyOn(controller, 'updateAnno');

            controller.increaseSelectedAnnoSizeLeft(Anno.startIndex(), Anno.endIndex());
            expect(controller.selectedNode.startIndex()).toEqual(0);
            expect(controller.selectedNode.endIndex()).toEqual(8);
            expect(controller.selectedNode.words.length).toEqual(3);
            expect(controller.updateAnno).toHaveBeenCalled();
        });

        it('Test decreaseSelectedAnnoSizeRight', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord1);
            Anno.addWord(testTextWord2);
            controller.selectedNode = Anno;
            spyOn(controller, 'updateAnno');

            controller.decreaseSelectedAnnoSizeRight();
            expect(controller.selectedNode.startIndex()).toEqual(0);
            expect(controller.selectedNode.endIndex()).toEqual(4);
            expect(controller.selectedNode.words.length).toEqual(1);
            expect(controller.updateAnno).toHaveBeenCalled();
        });

        it('Test decreaseSelectedAnnoSizeLeft', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord1);
            Anno.addWord(testTextWord2);
            controller.selectedNode = Anno;
            spyOn(controller, 'updateAnno');

            controller.decreaseSelectedAnnoSizeLeft();
            expect(controller.selectedNode.startIndex()).toEqual(5);
            expect(controller.selectedNode.endIndex()).toEqual(8);
            expect(controller.selectedNode.words.length).toEqual(1);
            expect(controller.updateAnno).toHaveBeenCalled();
        });
        
        it('Test isSpanTypeAlreadyApplied', function () {
            var duplicateAnno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            duplicateAnno.addWord(testTextWord1);
            controller.annotationStartMap[0] = [testAnnotation];

            var alreadyApplied : boolean = controller.isSpanTypeAlreadyApplied(duplicateAnno, testAnnotationSpanType);
            expect(alreadyApplied).toEqual(false);

            controller.annotationStartMap[0].push(testAnnotation2);
            var alreadyApplied : boolean = controller.isSpanTypeAlreadyApplied(duplicateAnno, testAnnotationSpanType);
            expect(alreadyApplied).toEqual(true);


        });
        
        it('Test setSelectedSpanTypeAndAdd with new annotation', function () {
            var Anno: Annotation = new Annotation(null, 5);
            Anno.addWord(testTextWord1);
            controller.selectedNode = Anno;
            controller.tempAnno = Anno;
            spyOn(controller, 'addAnnotation');
            spyOn(controller, 'getColor');
            spyOn(controller, 'removeConnectedLinks');
            
            controller.setSelectedSpanTypeAndAdd(testAnnotationSpanType);
            expect(controller.selectedNode.sType).toEqual(testAnnotationSpanType);
            expect(controller.lastSet).toEqual(Anno);
            expect(controller.lastTargeted).toEqual(Anno);
            expect(controller.tempAnno).toEqual(null);
            expect(controller.getColor).toHaveBeenCalled();
            expect(controller.addAnnotation).toHaveBeenCalled();
            expect(controller.removeConnectedLinks).toHaveBeenCalled();
        });

        it('Test Test setSelectedSpanTypeAndAdd with existing annotation', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord1);
            controller.selectedNode = Anno;
            spyOn(controller, 'getColor');
            spyOn(controller, 'removeConnectedLinks');

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/annotations/changest/' + controller.selectedNode.id;
            $httpBackend
                .when('POST', url, {'id': testAnnotationSpanType2.id, 'name': testAnnotationSpanType2.name})
                .respond(200);
            $httpBackend
                .expect('POST', url, {'id': testAnnotationSpanType2.id, 'name': testAnnotationSpanType2.name});

            controller.setSelectedSpanTypeAndAdd(testAnnotationSpanType2);
            expect(controller.selectedNode.sType).toEqual(testAnnotationSpanType2);
            expect(controller.lastSet).toEqual(Anno);
            expect(controller.lastTargeted).toEqual(Anno);
            expect(controller.getColor).toHaveBeenCalled();
            expect(controller.removeConnectedLinks).toHaveBeenCalled();
            expect($httpBackend.flush).not.toThrow();
        });

        it('Test setSelectedSpanTypeAndAdd with duplicate annotation', function () {
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType);
            Anno.addWord(testTextWord1);
            controller.selectedNode = Anno;
            spyOn(controller, 'removeConnectedLinks');

            controller.setSelectedSpanTypeAndAdd(testAnnotationSpanType);
            expect(controller.removeConnectedLinks).not.toHaveBeenCalled();

            controller.annotationStartMap[0] = [Anno];
            var duplicateAnno: Annotation = new Annotation(null, 6);
            duplicateAnno.addWord(testTextWord1);
            controller.selectedNode = duplicateAnno;
            spyOn(controller, 'removeAnnotation');
            spyOn(controller, 'displayDuplicateAnnotationWarning');

            controller.setSelectedSpanTypeAndAdd(testAnnotationSpanType);
            expect(controller.removeAnnotation).toHaveBeenCalled();
            expect(controller.displayDuplicateAnnotationWarning).toHaveBeenCalled();
        });

        it('Test setTemporarySpanType', function () {
            var Anno: Annotation = new Annotation(null, 5);
            controller.tempAnno = Anno;
            spyOn(controller, 'addAnnotation');
            spyOn(controller, 'getColor');

            controller.setTemporarySpanType(testAnnotationSpanType);
            expect(Anno.sType).toEqual(testAnnotationSpanType);
            expect(controller.tempAnno).toEqual(null);
            expect(controller.getColor).toHaveBeenCalled();
            expect(controller.addAnnotation).toHaveBeenCalled();
        });

        it('Test setTemporaryAnnotation', function () {
            var Anno: Annotation = new Annotation(null, 5);
            Anno.addWord(testTextWord1);
            var n : number = testTextWord1.annotatedBy;
            controller.tempAnno = Anno;
            controller.selectedNode = null;
            spyOn(controller, 'getOnlySpanType');

            controller.setTemporaryAnnotation([testTextWord2]);
            expect(testTextWord1.annotatedBy).toEqual(n-1);
            expect(Anno.words.length).toEqual(0);

            var newAnno : Annotation = controller.selectedNode;
            expect(newAnno).not.toEqual(Anno);
            expect(controller.tempAnno).not.toEqual(Anno);
            expect(newAnno.words.length).toEqual(1);
            expect(newAnno.words[0]).toEqual(testTextWord2);
            expect(controller.getOnlySpanType).toHaveBeenCalled();
        });

        it('Test  addAnnotation', function () {
            spyOn(controller, 'addAnnotationToDataStructure');
            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/annotations';

            var jsonTemplate = {
                "id": null,
                "user": {
                    "id": $window.sessionStorage.uId
                },
                "spanType": {
                    "id": testAnnotation2.sType.id,
                    "name": testAnnotation2.sType.name
                },
                "document": {
                    "id": $window.sessionStorage.docId
                },
                "start": testAnnotation2.words[0].start,
                "end": testAnnotation2.words[testAnnotation2.words.length - 1].end,
                "text": testAnnotation2.text,
                "notSure": false
            };

            $httpBackend
                .when('POST', url, JSON.stringify(jsonTemplate))
                .respond(200, testAnnotation2.id);

            $httpBackend
                .expect('POST', url, JSON.stringify(jsonTemplate));

            controller.addAnnotation(testAnnotation2);
            expect($httpBackend.flush).not.toThrow();
            expect(controller.addAnnotationToDataStructure).toHaveBeenCalled();
            expect(controller.lastAdded).toEqual(testAnnotation2);
        });

        it('Test removeAnnotation', function () {
            var Anno: Annotation = new Annotation(null, 5);
            Anno.addWord(testTextWord1);
            var n : number = testTextWord1.annotatedBy;
            controller.sizeIncreased = Anno;
            controller.lastRemoved = null;
            spyOn(controller, 'removeConnectedLinks');
            spyOn(controller, 'removeAnnotationFromDataStructure');

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/annotations/' + Anno.id;
            $httpBackend
                .when('DELETE', url)
                .respond(200);
            $httpBackend
                .expect('DELETE', url);

            controller.removeAnnotation(Anno);
            expect($httpBackend.flush).not.toThrow();
            expect(controller.sizeIncreased).toEqual(undefined);
            expect(controller.removeConnectedLinks).toHaveBeenCalled();
            expect(controller.lastRemoved).toEqual(Anno);
            expect(testTextWord1.annotatedBy).toEqual(n-1);
            expect(controller.removeAnnotationFromDataStructure).toHaveBeenCalled();
        });


        it('Test removeAnnotation with tempAnno', function () {
            var Anno: Annotation = new Annotation(null, 5);
            Anno.addWord(testTextWord1);
            var n : number = testTextWord1.annotatedBy;
            controller.tempAnno = Anno;
            controller.sizeIncreased = Anno;
            controller.lastRemoved = null;

            controller.removeAnnotation(Anno);
            expect(controller.sizeIncreased).toEqual(undefined);
            expect(testTextWord1.annotatedBy).toEqual(n-1);
            expect(controller.tempAnno).toEqual(null);
            expect(controller.lastRemoved).toEqual(Anno);
        });

        it('Test linkable', function () {
            // Test linkable
            var linkable : boolean = controller.linkable(testAnnotation2, testAnnotation);
            expect(linkable).toEqual(true);

            // Test already existing
            var linkable : boolean = controller.linkable(testAnnotation, testAnnotation2);
            expect(linkable).toEqual(false);

            // Test not linkable
            var Anno: Annotation = new Annotation(null, 5, testAnnotationSpanType2);
            var linkable : boolean = controller.linkable(testAnnotation, Anno);
            expect(linkable).toEqual(false);
        });

        //TODO test adddLink

        it('Test removeLink', function () {
            controller.annotationLinks[testAnnotation.id][testAnnotation2.id] = testLinkAnnotation

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/links/' + testLinkAnnotation.id;
            $httpBackend
                .when('DELETE', url)
                .respond(200);
            $httpBackend
                .expect('DELETE', url);

            controller.removeLink(testLinkAnnotation);
            expect($httpBackend.flush).not.toThrow();
            expect(controller.lastRemovedLink).toEqual(testLinkAnnotation);
            expect(controller.annotationLinks[testAnnotation.id]).toEqual(undefined);
        });
        
        it('Test removeConnectedLinks', function () {
            var anno1 : Annotation = testAnnotation; // id 3
            var anno2 : Annotation = testAnnotation2; // id 4
            var anno3 : Annotation = new Annotation(null, 5, testAnnotationSpanType);
            var link1 : AnnotationLink = testLinkAnnotation; // anno1 to anno2
            var link2 : AnnotationLink = new AnnotationLink(2, anno2, anno1, {2: testAnnotationLinkTypes[0]});
            var link3 : AnnotationLink = new AnnotationLink(3, anno2, anno3, {2: testAnnotationLinkTypes[0]});

            controller.annotationLinks[3] = {};
            controller.annotationLinks[3][4] = link1;
            controller.annotationLinks[4] = {};
            controller.annotationLinks[4][3] = link2;
            controller.annotationLinks[4][5] = link3;

            controller.removeConnectedLinks(anno1);
            expect(controller.annotationLinks[3]).toEqual(undefined);
            expect(controller.annotationLinks[4][3]).toEqual(undefined);

            controller.removeConnectedLinks(anno3);
            expect(controller.annotationLinks[4]).toEqual(undefined);
        });

        it('Test getOnlySpanType', function () {
            var onlySpan : AnnotationSpanType = controller.getOnlySpanType();
            expect(onlySpan).toBeDefined();
            expect(onlySpan.name).toEqual("Situation");

            controller.spanTypes["Action"] = testAnnotationSpanType2;
            onlySpan = controller.getOnlySpanType();
            expect(onlySpan).toEqual(undefined);
        });
        
        it('Test removeAnnotationFromDataStructure', function () {
            var newAnno : Annotation = new Annotation(null, 5, testAnnotationSpanType);
            newAnno.addWord(testTextWord2);
            controller.annotationIdMap[testAnnotation.id] = testAnnotation;
            controller.annotationStartMap[testAnnotation.startIndex()] = [testAnnotation, newAnno];

            controller.removeAnnotationFromDataStructure(testAnnotation);
            expect(controller.annotationIdMap[testAnnotation.id]).toEqual(undefined);
            expect(controller.annotationStartMap[testAnnotation.startIndex()].length).toEqual(1)
            expect(controller.annotationStartMap[testAnnotation.startIndex()][0]).toEqual(newAnno);
        });

        it('Test updateDataStructure', function () {
            controller.annotationStartMap[0] = [];
            controller.annotationStartMap[0].push(testAnnotation);
            controller.annotationStartMap[0].push(testAnnotation2);
            spyOn(controller, "addAnnotationToDataStructure");

            controller.updateDataStructure(testAnnotation, 0);
            expect(controller.annotationStartMap[0].length).toEqual(1);
            expect(controller.annotationStartMap[0][0]).toEqual(testAnnotation2);
            expect(controller.addAnnotationToDataStructure).toHaveBeenCalled();
        });

        it('Test isPunctuation', function () {
            var isPunct : boolean = controller.isPunctuation(".");
            expect(isPunct).toEqual(true);
            isPunct = controller.isPunctuation(",");
            expect(isPunct).toEqual(true);
            isPunct = controller.isPunctuation("!");
            expect(isPunct).toEqual(true);
            isPunct = controller.isPunctuation("?");
            expect(isPunct).toEqual(true);
            isPunct = controller.isPunctuation(";");
            expect(isPunct).toEqual(true);
            isPunct = controller.isPunctuation(".?");
            expect(isPunct).toEqual(false);
        });
        
        // TODO test getCharacterSum
        // TODO test getColor
        
        it('Test nextDoc', function () {
            spyOn($scope, "openAnnoTool").and.callFake(function (docId, docName, projectId, projectName, tokenizationLang) {
                $window.sessionStorage.docId = docId;
            });

            // Test forward
            controller.nextDoc(1);
            expect($window.sessionStorage.docId).toEqual('5');
            controller.nextDoc(1);
            expect($window.sessionStorage.docId).toEqual('169');
            controller.nextDoc(1);
            expect($window.sessionStorage.docId).toEqual('1');

            // Test backward
            controller.nextDoc(-1);
            expect($window.sessionStorage.docId).toEqual('169');
            controller.nextDoc(-1);
            expect($window.sessionStorage.docId).toEqual('5');
            controller.nextDoc(-1);
            expect($window.sessionStorage.docId).toEqual('1');
        })
        
        it('Test setDocCompleted mark as incomplete', function () {
            $window.sessionStorage.completed = true;
            var $httpBackend = $injector.get('$httpBackend');
            const url = "swan/document/1/3";
            
            $scope.completed = false;
            var payload = {
                value: $scope.completed
            };

            $httpBackend
                .when('POST', url, JSON.stringify(payload))
                .respond(200);

            $httpBackend
                .expect('POST', url, JSON.stringify(payload));
            
            controller.setDocCompleted();
            expect($httpBackend.flush).not.toThrow();
            expect($window.sessionStorage.completed).toEqual('false');
            expect($rootScope.currDoc.completed).toEqual(false);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('success');
            expect(alert.msg).toEqual('Document marked as incomplete!');
        });

        it('Test setDocCompleted mark as complete', function () {
            $window.sessionStorage.completed = false;
            $rootScope.currDoc.completed = false;
            var $httpBackend = $injector.get('$httpBackend');
            const url = "swan/document/1/3";

            $scope.completed = true;
            var payload = {
                value: $scope.completed
            };

            $httpBackend
                .when('POST', url, JSON.stringify(payload))
                .respond(200);

            $httpBackend
                .expect('POST', url, JSON.stringify(payload));

            controller.setDocCompleted();
            expect($httpBackend.flush).not.toThrow();
            expect($window.sessionStorage.completed).toEqual('true');
            expect($rootScope.currDoc.completed).toEqual(true);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('success');
            expect(alert.msg).toEqual('Document marked as completed!');
        });
        
        it('Test setAnnotationNotSure', function () {
            var anno : Annotation = controller.annotationIdMap[testAnnotation.id];

            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/annotations/notsure/' + anno.id;
            var boolVal = !anno.notSure;
            var payload = {
                value:  boolVal
            };

            $httpBackend
                .when('POST', url, JSON.stringify(payload))
                .respond(200);

            $httpBackend
                .expect('POST', url, JSON.stringify(payload));

            controller.setAnnotationNotSure(anno);
            expect($httpBackend.flush).not.toThrow();
            expect(anno.notSure).toEqual(boolVal);
        });

        it('Test displayDuplicateAnnotationWarning', function () {
            controller.displayDuplicateAnnotationWarning();
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('warning');
            expect(alert.msg).toEqual('An annotation was removed because it had the same start, end and span type ' +
                'properties like an already existing one.');
        });

        //TODO test cloneAnnotationColor

    });

});
