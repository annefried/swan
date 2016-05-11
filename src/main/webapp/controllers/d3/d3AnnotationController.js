/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
    .module('app')
    .controller('d3AnnotationController', ['$scope', '$window', function ($scope, $window) {
            
        this.project = $window.sessionStorage.project;
        this.title = $window.sessionStorage.title;

        $scope.isPunctuation = function (string) {
            return string !== undefined
                && (string.length === 1 && (string === "," || string === "." || string === "!" || string === "?"));
        };

        $scope.isSpace = function (string) {
            return string !== undefined
                    && (string === " " || string === "");
        };

        //Determines which text element(s) are currently highlighted/marked by the cursor
        this.UpdateSelectionText = function () {
            if (window.getSelection && window.getSelection().toString().length > 0) {
                this.startSelection = window.getSelection().getRangeAt(0).startContainer.parentNode;
                this.endSelection = window.getSelection().getRangeAt(0).endContainer.parentNode;
            }
        };

        this.clearSelection = function () {
            if (window.getSelection) {
                if (window.getSelection().empty)  // Chrome
                    window.getSelection().empty();

                else if (window.getSelection().removeAllRanges)  // Firefox
                    window.getSelection().removeAllRanges();

            } else if (document.selection)  // IE
                document.selection.empty();
            this.startSelection = null;
            this.endSelection = null;
        };
    }
]);
