/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

// TODO this is a mess
angular.module('app')
        .factory("getAnnotationService", function ($http) {
            return  {
                getAnnotations: function (uId, docId) {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/annotations/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var annotations = JSOG.parse(xmlHttp.responseText);

                    return annotations.annotations;
                }
            }
        })
        .factory('textService', function ($http) {
            return  {
                getText: function (docId) {
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/document/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var text = xmlHttp.responseText;
                    var textJSON = JSOG.parse(text);
                    var finalText = textJSON.text;

                    return finalText;
                }
            }
        })
        .factory('tokenService', function ($http) {
            return  {
                getTokens: function (docId) {
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/document/tokens/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var text = xmlHttp.responseText;
                    var textJSON = JSOG.parse(text);

                    return textJSON.tokens;
                }
            }
        })
        .factory('targetService', function ($http) { // TODO never used?
            return  {
                getTargets: function (uId, docId) {
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/annotations/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var targetJSON = JSOG.parse(xmlHttp.responseText);
                    var targets = [];
                    for (var i = 0; i < targetJSON.annotations.length; i++) {
                        var target = targetJSON.annotations[i];
                        if (target.user === undefined) {
                            targets.push(target);
                        }
                    }

                    return targets;
                }
            }
        })
        .factory('linkService', function ($http) {
            return  {
                getLinks: function (uId, docId) {
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/links/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var linkJSON = JSOG.parse(xmlHttp.responseText).links;

                    return linkJSON;
                }
            }
        })
        .factory('schemeService', function ($http) {
            return {
                getScheme: function (docId) {
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/scheme/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var schemeJSON = JSOG.parse(xmlHttp.responseText).scheme;

                    return schemeJSON;
                }
            }
        })
        .factory('schemeByIdService', function ($http) {
            return {
                getScheme: function (schemeId) {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "swan/scheme/byid/" + schemeId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var schemeJSON = JSOG.parse(xmlHttp.responseText).scheme;

                    return schemeJSON;
                }
            }
        })
        .factory('projectService', function ($window, $http) {
            return {
                getScheme: function (docId) {
                    return $http.get("swan/project/byuser/" + $window.sessionStorage.uId);
                }
            }
        });
