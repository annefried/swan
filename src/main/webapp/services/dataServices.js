'use strict';

angular.module('app')
        .factory("getAnnotationService", function () {
            return  {
                getAnnotations: function (uId, docId) {

                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "tempannot/annotations/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var annotations = JSOG.parse(xmlHttp.responseText);
                    return annotations.annotations;

                }
            }
        })
        .factory('textService', function () {
            return  {
                getText: function (docId) {

                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "tempannot/document/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var text = xmlHttp.responseText;
                    var textJSON = JSOG.parse(text);
                    var finalText = textJSON.text;

                    return finalText;
                }
            }
        })
        .factory('targetService', function () {
            return  {
                getTargets: function (uId, docId) {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "tempannot/annotations/" + uId + "/" + docId, false); // false for synchronous request
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
        }
        )
        .factory('linkService', function () {
            return  {
                getLinks: function (uId, docId) {

                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "tempannot/links/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var linkJSON = JSOG.parse(xmlHttp.responseText).links;
                    return linkJSON;
                }
            }
        })
        .factory('schemeService', function () {
            return  {
                getScheme: function (docId) {

                    // HACK to load data
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "tempannot/scheme/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    // HACK to load data

//                    var xmlHttp = new XMLHttpRequest();
//                    xmlHttp.open("GET", "tempannot/document/" + docId, false); // false for synchronous request
//                    xmlHttp.send(null);
                    var schemeJSON = JSOG.parse(xmlHttp.responseText).scheme;
                    return schemeJSON;

                }
            }
        });
