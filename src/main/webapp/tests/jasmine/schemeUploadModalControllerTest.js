/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

/**
 * Created by Julia Dembowski on 05/07/16.
 */
describe('Test schemeUploadModalController', function () {
    beforeEach(module('app'));

    var $controller, $injector, $scope, $rootScope, $window, $http, $sce, $uibModal, $uibModalInstance, $timeout;
    var controller, rootController, schemesController, UtilityService;

    // For asynchronous statements and promises
    var $q, deferred;

    beforeEach(inject(function(_$controller_, _$injector_, _$q_, _$rootScope_, _$window_, _$http_, _$timeout_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $injector = _$injector_;
        $q = _$q_;
        deferred = _$q_.defer();
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $window = _$window_;
        $http = _$http_;
        $timeout = _$timeout_;
		$uibModalInstance = {};

        $window.sessionStorage.role = 'admin';
        $window.sessionStorage.isAnnotator = 'false';
        $scope.isUnprivileged = 'false';
        $window.sessionStorage.uId = '1';

        rootController = $controller('rootController', {
            $rootScope: $rootScope,
            $scope: $scope,
            $window: $window,
            $http: $http,
            $timeout: $timeout
        });

        controller = $controller('schemeUploadModalController', {
            $scope: $scope,
            $rootScope: $rootScope,
            $http: $http,
            $sce: $sce,
            $uibModal: $uibModal,
            $uibModalInstance: $uibModalInstance,
            $window: $window,
            UtilityService: UtilityService,
            $timeout: $timeout
        });
    }));

    it('Test init', function() {
        expect($scope.noView.checked).toEqual(true);
        expect($scope.graphView.checked).toEqual(false);
        expect($scope.graphView.state).toEqual('opened');
        expect($scope.timelineView.checked).toEqual(false);
        expect($scope.timelineView.state).toEqual('opened');
        expect($rootScope.alertsModal.length).toEqual(0);
        expect($scope.visKind).toEqual('None');
        expect($scope.positioning).toEqual(undefined);
        expect($scope.spanTypes.length).toEqual(0);
        expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(0);
        expect($scope.linkTypes.length).toEqual(0);
        expect($scope.currentLabelsOfLabelSet.length).toEqual(0);
        expect($scope.currentLinkLabels.length).toEqual(0);
        expect($scope.labelSets.length).toEqual(0);
    });

    describe('Schemebuilder tests', function () {
        var timelineLinkType = {
            name: 'temporal relation',
            startSpanType: {name: 'verb'},
            endSpanType: {name: 'verb'},
            linkLabels: [{name: 'before', options: ['horizontal']},{name: 'overlap', options: ['vertical']}]
        };

        var normalLinkType = {
            name: 'temporal relation',
            startSpanType: {name: 'verb'},
            endSpanType: {name: 'verb'},
            linkLabels: [{name: 'before', options: []},{name: 'overlap', options: []}]
        };

        beforeEach(function () {
            $scope.schemeName = 'testScheme';
            $scope.spanTypes = [{name: 'verb'}];

            var newLabelSet = {
                name: 'testLabelSet',
                exclusive: true,
                labels: [{name: 'label1'},{name: 'label2'}],
                appliesToSpanTypes: [$scope.spanTypes[0]]
            };

            $scope.labelSets.push(newLabelSet);
        });

        it('Test loadSchemes', function () {
            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/scheme/schemes';
            var response = { schemes: [] };

            $httpBackend
                .when('GET', url)
                .respond(200, response);

            $httpBackend
                .expect('GET', url);

            var httpObj = $scope.loadSchemes();

            expect($httpBackend.flush).not.toThrow();
        });

        it('Test visualization change from Timeline to None', function() {
            $scope.noView = {
                checked: false
            };
            $scope.timelineView = {
                checked: true,
                state: 'opened'
            };
            $scope.visKind = 'Timeline';

            $scope.currentLinkLabels.push({name: 'linkLabel', options: ['vertical']});
            $scope.linkTypes.push(timelineLinkType);

            $scope.watchVisualizationChange('None');

            for (var i = 0; i < $scope.linkTypes.length; i++) {
                var linkType = $scope.linkTypes[i];
                for (var j = 0; j < linkType.linkLabels.length; j++) {
                    expect(linkType.linkLabels[j].options).toEqual(undefined);
                }
            }

            for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
                expect($scope.currentLinkLabels[i].options).toEqual(undefined);
            }
            expect($scope.positioning).toEqual(undefined);;
            expect($scope.noView.checked).toEqual(true);
            expect($scope.graphView.checked).toEqual(false);
            expect($scope.timelineView.checked).toEqual(false);
        });

        it('Test visualization change from Timeline to Graph', function() {
            $scope.noView = {
                checked: false
            };
            $scope.timelineView = {
                checked: true,
                state: 'opened'
            };
            $scope.visKind = 'Timeline';

            $scope.currentLinkLabels.push({name: 'linkLabel', options: ['vertical']});
            $scope.linkTypes.push(timelineLinkType);

            $scope.watchVisualizationChange('Graph');

            for (var i = 0; i < $scope.linkTypes.length; i++) {
                var linkType = $scope.linkTypes[i];
                for (var j = 0; j < linkType.linkLabels.length; j++) {
                    expect(linkType.linkLabels[j].options).toEqual(undefined);
                }
            }

            for (var i = 0; i < $scope.currentLinkLabels.length; i++) {
                expect($scope.currentLinkLabels[i].options).toEqual(undefined);
            }
            expect($scope.positioning).toEqual(undefined);
            expect($scope.noView.checked).toEqual(false);
            expect($scope.graphView.checked).toEqual(true);
            expect($scope.timelineView.checked).toEqual(false);
        });

        it('Test visualization change to Timeline', function() {
            $scope.currentLinkLabels.push({name: 'linkLabel', options: []});
            $scope.linkTypes.push(normalLinkType);

            $scope.watchVisualizationChange('Timeline');

            expect($scope.linkTypes.length).toEqual(0);
            expect($scope.currentLinkLabels.length).toEqual(0);
            expect($scope.positioning).toEqual(undefined);
            expect($scope.noView.checked).toEqual(false);
            expect($scope.graphView.checked).toEqual(false);
            expect($scope.timelineView.checked).toEqual(true);
        });

        it('Test disableTextInputButton', function () {
            expect($scope.disableTextInputButton(undefined)).toEqual(true);
            expect($scope.disableTextInputButton('')).toEqual(true);
            expect($scope.disableTextInputButton('bla')).toEqual(false);

        });

        it('Test disableLinkLabelButton', function () {
            expect($scope.disableLinkLabelButton(undefined, undefined)).toEqual(true);
            expect($scope.disableLinkLabelButton('', undefined)).toEqual(true);
            expect($scope.disableLinkLabelButton('test', undefined)).toEqual(false);

            $scope.timelineView.checked = true;
            expect($scope.disableLinkLabelButton('test', undefined)).toEqual(true);
            expect($scope.disableLinkLabelButton('test', 'test')).toEqual(true);
            expect($scope.disableLinkLabelButton('test', 'horizontal')).toEqual(false);
            expect($scope.disableLinkLabelButton('test', 'vertical')).toEqual(false);
        });

        it('Test disableLabelSetButton', function () {
            expect($scope.disableLabelSetButton()).toEqual(true);

            $scope.nameLabelSet = 'test';
            $scope.currentLabelsOfLabelSet.push({name: 'test'});
            expect($scope.disableLabelSetButton()).toEqual(true);   //no span types

            $scope.selectedSpanTypesOfLabelSet.push({name: 'verb'});
            $scope.nameLabelSet = undefined;
            expect($scope.disableLabelSetButton()).toEqual(true);   //no name specified

            $scope.nameLabelSet = 'test';
            expect($scope.disableLabelSetButton()).toEqual(false);
        });

        it('Test disableLinkTypeButton', function () {
            expect($scope.disableLinkTypeButton()).toEqual(true);

            $scope.nameLinkType = 'test';
            expect($scope.disableLinkTypeButton()).toEqual(true);   //no span types

            $scope.startSpanType = {name: 'verb'};
            $scope.endSpanType = {name: 'verb'};
            $scope.nameLinkType = undefined;
            expect($scope.disableLinkTypeButton()).toEqual(true);   //no name specified

            $scope.nameLinkType = 'test';
            expect($scope.disableLinkTypeButton()).toEqual(false);

            $scope.timelineView.checked = true;
            expect($scope.disableLinkTypeButton()).toEqual(false);

            $scope.linkTypes.push(timelineLinkType);
            expect($scope.disableLinkTypeButton()).toEqual(true);
        });

        it('Test addLabelSet', function() {
            $scope.nameLabelSet = 'labelSet';
            $scope.exclusiveLabelSet = true;
            $scope.currentLabelsOfLabelSet = [{name: 'label1'},{name: 'label2'}];
            $scope.selectedSpanTypesOfLabelSet = [$scope.spanTypes[0]];

            $scope.addLabelSet();

            expect($scope.labelSets.length).toEqual(2);
            expect($scope.nameLabelSet).toEqual(undefined);
            expect($scope.exclusiveLabelSet).toEqual(false);
            expect($scope.currentLabelsOfLabelSet.length).toEqual(0);
            expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(0);
        });

        it('Test addLabelSet with existing name', function() {
            $scope.nameLabelSet = 'testLabelSet';
            $scope.exclusiveLabelSet = true;
            $scope.currentLabelsOfLabelSet = [{name: 'label1'},{name: 'label2'}];
            $scope.selectedSpanTypesOfLabelSet = [$scope.spanTypes[0]];

            $scope.addLabelSet();

            expect($scope.labelSets.length).toEqual(1);
            expect($scope.nameLabelSet).toEqual('testLabelSet');
            expect($scope.exclusiveLabelSet).toEqual(true);
            expect($scope.currentLabelsOfLabelSet.length).toEqual(2);
            expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(1);

            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A Label set with this name is already part of this scheme.')
        });

        it('Test editLabelSet', function() {
            //To test if input fields are resetted
            $scope.currentLabelsOfLabelSet.push({name: 'testLabel'});
            $scope.selectedSpanTypesOfLabelSet.push({name: 'noun'});

            $scope.editLabelSet('testLabelSet');

            expect($scope.nameLabelSet).toEqual('testLabelSet');
            expect($scope.exclusiveLabelSet).toEqual(true);
            expect($scope.currentLabelsOfLabelSet).toEqual([{name: 'label1'},{name: 'label2'}]);
            expect($scope.selectedSpanTypesOfLabelSet).toEqual([{name: 'verb'}]);
            expect($scope.labelSets.length).toEqual(0);
        });

        it('Test removeLabelSet', function () {
            $scope.removeLabelSet('testLabelSet');
            expect($scope.labelSets.length).toEqual(0);
        });

        it('Test editLinkType', function () {
            $scope.linkTypes.push(normalLinkType);

            //To test if input fields are resetted
            $scope.currentLinkLabels.push({name: 'testLabel', options: []})

            $scope.editLinkType(normalLinkType.name);

            expect($scope.nameLinkType).toEqual('temporal relation');
            expect($scope.startSpanType).toEqual({name: 'verb'});
            expect($scope.endSpanType).toEqual({name: 'verb'});
            expect($scope.currentLinkLabels).toEqual([{name: 'before', options: []},{name: 'overlap', options: []}]);
            expect($scope.linkTypes.length).toEqual(0);
        });

        it('Test addLinkType', function () {
            $scope.nameLinkType = 'temporal relation';
            $scope.startSpanType = $scope.spanTypes[0];
            $scope.endSpanType = $scope.spanTypes[0];
            $scope.currentLinkLabels = [{name: 'before', options: []},{name: 'overlap', options: []}];

            $scope.addLinkType();

            expect($scope.linkTypes.length).toEqual(1);
            expect($scope.nameLinkType).toEqual(undefined);
            expect($scope.startSpanType).toEqual(undefined);
            expect($scope.endSpanType).toEqual(undefined);
            expect($scope.currentLinkLabels.length).toEqual(0);
        });

        it('Test addLinkType with existing name', function () {
            $scope.linkTypes.push(normalLinkType);
            $scope.nameLinkType = 'temporal relation';
            $scope.startSpanType = $scope.spanTypes[0];
            $scope.endSpanType = $scope.spanTypes[0];
            $scope.currentLinkLabels = [{name: 'before', options: []},{name: 'overlap', options: []}];

            $scope.addLinkType();

            expect($scope.linkTypes.length).toEqual(1);
            expect($scope.nameLinkType).toEqual('temporal relation');
            expect($scope.startSpanType).toEqual({name: 'verb'});
            expect($scope.endSpanType).toEqual({name: 'verb'});
            expect($scope.currentLinkLabels.length).toEqual(2);

            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A Link type with this name is already part of this scheme.');
        });

        it('Test removeLinkType', function () {
            $scope.linkTypes.push(normalLinkType);
            $scope.removeLinkType(normalLinkType.name);
            expect($scope.linkTypes.length).toEqual(0);
        });

        it('Test addSpanTypeToLabelSet', function () {
            $scope.addSpanTypeToLabelSet($scope.spanTypes[0]);
            expect($scope.selectedSpanTypesOfLabelSet).toEqual([{name: 'verb'}]);

            $scope.addSpanTypeToLabelSet($scope.spanTypes[0]);
            expect($scope.selectedSpanTypesOfLabelSet).toEqual([{name: 'verb'}]);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A span type can only be added once!');
        });


        it('Test removeSpanTypeFromLabelSet', function () {
            $scope.selectedSpanTypesOfLabelSet.push($scope.spanTypes[0]);
            $scope.removeSpanTypeFromLabelSet($scope.spanTypes[0]);
            expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(0);
        });

        it('Test selectedSpanTypeLabelSetFilter', function () {
            $scope.spanTypes.push({name: 'noun'});
            $scope.selectedSpanTypesOfLabelSet.push($scope.spanTypes[0]); //verb
            expect($scope.selectedSpanTypeLabelSetFilter($scope.spanTypes[0])).toEqual(false); //verb
            expect($scope.selectedSpanTypeLabelSetFilter($scope.spanTypes[1])).toEqual(true); //noun
        });

        it('Test addSpanType', function () {
            $scope.addSpanType('noun');
            expect($scope.spanTypes.length).toEqual(2);

            $scope.addSpanType('verb');
            expect($scope.spanTypes.length).toEqual(2);

            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A span type with this name already exists!');
        });

        it('Test removeSpanType', function () {
            $scope.linkTypes.push(normalLinkType);
            $scope.selectedSpanTypesOfLabelSet.push($scope.spanTypes[0]);
            $scope.startSpanType = $scope.spanTypes[0];
            $scope.endSpanType = $scope.spanTypes[0];

            $scope.removeSpanType({name: 'verb'});
            expect($scope.spanTypes.length).toEqual(0);
            expect($scope.labelSets.length).toEqual(0);
            expect($scope.linkTypes.length).toEqual(0);
            expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(0);
            expect($scope.startSpanType).toEqual(undefined);
            expect($scope.endSpanType).toEqual(undefined);
        });

        it('Test addLabelToLabelSet', function () {
            $scope.addLabelToLabelSet('testLabel');
            expect($scope.currentLabelsOfLabelSet).toEqual([{name: 'testLabel'}]);

            $scope.addLabelToLabelSet('testLabel');
            expect($scope.currentLabelsOfLabelSet.length).toEqual(1);

            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A label with this name already exists!');

        });

        it('Test addLabelToLinkType', function () {
            //Test for link label without positioning option
            $scope.addLabelToLinkTypeWithSingleOpt('testLabel', undefined);
            expect($scope.currentLinkLabels.length).toEqual(1);
            var linklabel = $scope.currentLinkLabels[0];
            expect(linklabel.name).toEqual('testLabel');
            expect(linklabel.options).toEqual([]);

            //Test for link label with positioning option
            $scope.currentLinkLabels = [];
            $scope.addLabelToLinkTypeWithSingleOpt('testLabel', 'vertical');
            expect($scope.currentLinkLabels.length).toEqual(1);
            var linklabel = $scope.currentLinkLabels[0];
            expect(linklabel.name).toEqual('testLabel');
            expect(linklabel.options).toEqual(['vertical']);

            //Test adding link type with existing name
            $scope.addLabelToLinkTypeWithSingleOpt('testLabel', 'vertical');
            expect($scope.currentLinkLabels.length).toEqual(1);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('A label with this name already exists!');
        });

        it('Test removeLabelFromLabelSet', function () {
            $scope.currentLabelsOfLabelSet.push({name: 'testLabel'});
            $scope.removeLabelFromLabelSet('testLabel');
            expect($scope.currentLabelsOfLabelSet.length).toEqual(0);
        });

        it('Test removeLabelFromLinkType', function () {
            $scope.currentLinkLabels.push({name: 'testLabel', options: ['vertical']});
            $scope.removeLabelFromLinkType('testLabel');
            expect($scope.currentLinkLabels.length).toEqual(0);
        });

        it('Test setSchemeProperties', function () {
            //Add test link types and fill input fields to see if everything is correctly cleared.
            $scope.linkTypes.push(normalLinkType);
            $scope.nameLabelSet = 'testLabelSet';
            $scope.currentLabelsOfLabelSet.push({name: 'newLabel'});
            $scope.selectedSpanTypesOfLabelSet.push($scope.spanTypes[0]);
            $scope.exclusiveLabelSet = true;
            $scope.nameLinkType = 'testLinkType';
            $scope.startSpanType = $scope.spanTypes[0];
            $scope.endSpanType = $scope.spanTypes[0];
            $scope.currentLinkLabels = [{name: 'label1', options: []},{name: 'label2', options: []}];

            //New scheme
            var linkType = {
                name: 'newLinkType',
                startSpanType: {name: 'noun'},
                endSpanType: {name: 'noun'},
                linkLabels: [{name: 'horizontalLink', options: ['horizontal']},{name: 'verticalLink', options: ['vertical']}]
            };

            var labelSet = {
                name: 'newLabelSet',
                exclusive: true,
                labels: [{name: 'newLabel'}],
                appliesToSpanTypes: [{name: 'noun'}]
            };

            var scheme = {
                name: 'newScheme',
                spanTypes: [{name: 'noun'}],
                labelSets: [labelSet],
                linkTypes: [linkType],
                visElements: [{visState: "closed", visKind: "timeline"}, {visState: "hidden", visKind: "graph"}]
            };

            $scope.setSchemeProperties(scheme);

            //Test if scheme properties are correctly set
            expect($scope.visKind).toEqual('Timeline');
            expect($scope.noView.checked).toEqual(false);
            expect($scope.graphView.checked).toEqual(false);
            expect($scope.timelineView.checked).toEqual(true);
            expect($scope.schemeName).toEqual('Copy of newScheme');
            expect($scope.spanTypes.length).toEqual(1);
            expect($scope.spanTypes[0].name).toEqual('noun');
            expect($scope.labelSets.length).toEqual(1);
            expect($scope.labelSets[0]).toEqual(labelSet);
            expect($scope.linkTypes.length).toEqual(1);
            expect($scope.linkTypes[0]).toEqual(linkType);

            //Test if input fields are cleared
            expect($scope.nameLabelSet).toEqual(undefined);
            expect($scope.selectedSpanTypesOfLabelSet.length).toEqual(0);
            expect($scope.currentLabelsOfLabelSet.length).toEqual(0);
            expect($scope.exclusiveLabelSet).toEqual(false);

            expect($scope.nameLinkType).toEqual(undefined);
            expect($scope.startSpanType).toEqual(undefined);
            expect($scope.endSpanType).toEqual(undefined);
            expect($scope.currentLinkLabels.length).toEqual(0);
            expect($scope.positioning).toEqual(undefined);
        });

        it('Test sendScheme', function () {
            var $httpBackend = $injector.get('$httpBackend');
            const url = 'swan/scheme';
            var response = 1;

            $httpBackend
                .when('GET', url + '/schemes')
                .respond(200, { schemes: [] });

            $httpBackend
                .expect('GET', url + '/schemes');

            $httpBackend
                .when('POST', url)
                .respond(200, response);

            $httpBackend
                .expect('POST', url);

			$uibModalInstance.close = {};
			spyOn($uibModalInstance, "close").and.callFake(function () {});

            $scope.timelineView.checked = true;
            $scope.noView.checked = false;
            $scope.linkTypes.push(timelineLinkType);

            $rootScope.schemesTable = {};
            $rootScope.tableSchemes = [];
            $rootScope.allSchemes = [];
            $scope.sendScheme();
            expect($httpBackend.flush).not.toThrow();

            expect($rootScope.schemesTable[$scope.schemeName]).toBeDefined();
            var scheme = $rootScope.schemesTable[$scope.schemeName];
            expect(scheme.name).toEqual($scope.schemeName);
            expect(scheme.creator.id).toEqual(1);
            expect(scheme.spanTypes).toEqual($scope.spanTypes);
            expect(scheme.labelSets).toEqual($scope.labelSets);
            expect(scheme.linkTypes).toEqual($scope.linkTypes);

            expect($rootScope.tableSchemes.length).toEqual(1);
            var preview = $rootScope.tableSchemes[0];
            expect(preview.name).toEqual($scope.schemeName);
			expect($uibModalInstance.close).toHaveBeenCalled();
        });

    });

    describe('Upload tests', function () {
        function readJSON(path) {
            var result;
            var client = new XMLHttpRequest();
            client.open('GET', path, false);

            client.onreadystatechange = function () {
                if(client.readyState == 4 && client.status == 200){
                    result = client.responseText;
                }
            };

            client.send(null);
            return result;
        }

        it('Test uploadScheme with valid graph scheme', function () {
            var scheme = readJSON('base/testdata/schemes/graphScheme.json');
            $scope.uploadScheme(scheme);
            expect($scope.schemeName).toEqual('Copy of graphScheme');
            expect($scope.spanTypes.length).toEqual(2);
            expect($scope.labelSets.length).toEqual(2);
            expect($scope.linkTypes.length).toEqual(1);
        });


        it('Test uploadScheme with valid timeline scheme', function () {
            var scheme = readJSON('base/testdata/schemes/timelineScheme.json');
            $scope.uploadScheme(scheme);
            expect($scope.schemeName).toEqual('Copy of timelineScheme');
            expect($scope.spanTypes.length).toEqual(2);
            expect($scope.labelSets.length).toEqual(2);
            expect($scope.linkTypes.length).toEqual(1);
        });

        it('Test uploadScheme with invalid graph scheme', function () {
            var scheme = readJSON('base/testdata/schemes/invalidGraphScheme.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Positioning must not be specified');
        });

        it('Test uploadScheme with invalid timeline scheme 1', function () {
            var scheme = readJSON('base/testdata/schemes/invalidTimelineScheme1.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Positioning must be specified');
        });

        it('Test uploadScheme with invalid timeline scheme 2', function () {
            var scheme = readJSON('base/testdata/schemes/invalidTimelineScheme2.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Only one link type allowed for timeline view');
        });

        it('Test uploadScheme with invalid scheme 1', function () {

            var scheme = readJSON('base/testdata/schemes/invalidScheme1.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Span type used in label set not defined');
        });

        it('Test uploadScheme with invalid scheme 2', function () {

            var scheme = readJSON('base/testdata/schemes/invalidScheme2.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Incomplete label set');
        });

        it('Test uploadScheme with invalid scheme 3', function () {

            var scheme = readJSON('base/testdata/schemes/invalidScheme3.json');
            $scope.uploadScheme(scheme);
            expect($rootScope.alerts.length).toEqual(1);
            var alert = $rootScope.alerts[0];
            expect(alert.type).toEqual('danger');
            expect(alert.msg).toEqual('Selected file does not contain a valid annotation scheme. Reason: ' +
                'Incomplete label set');
        });
    });

});
