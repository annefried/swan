/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

/**
 * Called on choosing a file.
 * Reads in the content, as well as the filename.
 */
angular
    .module('app')
    .directive('onReadFile', function ($parse) {

        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);
                element.on('change', function (onChangeEvent) {
                    var files = (onChangeEvent.srcElement || onChangeEvent.target).files;
                    for (var i = 0; i < files.length; i++) {
                        var reader = new FileReader();
                        reader.fileName = files[i].name;
                        reader.onload = function (onLoadEvent) {
                            scope.$apply(function () {
                                var filename = "";
                                var split = onLoadEvent.target.fileName.split('.');
                                for (var j = 0; j < (split.length - 1); j++) {
                                    if (j === split.length - 2) {
                                        filename = filename + split[j];
                                    } else {
                                        filename = filename + split[j] + '.';
                                    }
                                }
                                fn(scope, {$fileContent: onLoadEvent.target.result,
                                    $fileName: filename});
                            });
                        };
                        reader.readAsText(files[i]);
                    }
                });
            }
        };
    });
