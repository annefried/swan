'use strict';

angular.module('app')
        .factory("getAnnotationService", function ($http) {
            return  {
                getAnnotations: function (uId, docId) {

                    // IDEA: Return http without then. Controller handeles then. http://stackoverflow.com/questions/16227644/angularjs-factory-http-service
                    // Async
//                    var httpCallback = $http.get("discanno/annotations/" + uId + "/" + docId);
//                    return httpCallback;

                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/annotations/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var annotations = JSOG.parse(xmlHttp.responseText);
                    return annotations.annotations;

                }
            }
        })
        .factory('textService', function ($http) {
            return  {
                getText: function (docId) {
                    //Async
//                    $http.get("discanno/document/" + docId).then(function (response) {
//                        var result = JSOG.parse(JSON.stringify(response.data)).text;
//                    }, function (err) {
//
//                    });
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/document/" + docId, false); // false for synchronous request
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
                    //Async
//                    $http.get("discanno/document/" + docId).then(function (response) {
//                        var result = JSOG.parse(JSON.stringify(response.data)).text;
//                    }, function (err) {
//
//                    });
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/document/tokens/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var text = xmlHttp.responseText;
                    var textJSON = JSOG.parse(text);
                    return textJSON.tokens;
                }
            }
        })
        .factory('targetService', function ($http) {
            return  {
                getTargets: function (uId, docId) {
                    // Async
//                    $http.get("discanno/annotations/" + uId + "/" + docId).then(function (response) {
//                        var targetJSON = JSOG.parse(JSON.stringify(response.data));
//                        var targets = [];
//                        for (var i = 0; i < targetJSON.annotations.length; i++) {
//                            var target = targetJSON.annotations[i];
//                            if (target.user === undefined) {
//                                targets.push(target);
//                            }
//                        }
//                        var result = targets;
//                    }, function (err) {
//
//                    });
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/annotations/" + uId + "/" + docId, false); // false for synchronous request
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
        .factory('linkService', function ($http) {
            return  {
                getLinks: function (uId, docId) {
                    // Async
//                    $http.get("discanno/links/" + uId + "/" + docId).then(function (response) {
//                        var result = JSOG.parse(JSON.stringify(response.data)).links;
//                    }, function (err) {
//
//                    });
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/links/" + uId + "/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var linkJSON = JSOG.parse(xmlHttp.responseText).links;
                    return linkJSON;
                }
            }
        })
        .factory('schemeService', function ($http) {
            return  {
                getScheme: function (docId) {
                    // Async
//                    $http.get("discanno/scheme/" + docId).then(function (response) {
//                        var result = JSOG.parse(JSON.stringify(response.data)).scheme;
//                    }, function (err) {
//
//                    });
                    // Sync
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("GET", "discanno/scheme/" + docId, false); // false for synchronous request
                    xmlHttp.send(null);
                    var schemeJSON = JSOG.parse(xmlHttp.responseText).scheme;
                    return schemeJSON;

                }
            }
        }).factory('projectService', function ($window, $http) {
    return  {
        getScheme: function (docId) {
            // Async
            if ($window.sessionStorage.role !== 'user') {
                var httpProjects = $http.get("discanno/project");
            } else {
                var httpProjects = $http.get("discanno/project/byuser/" + $window.sessionStorage.uId);
            }
            return httpProjects;
        }
    }
});
