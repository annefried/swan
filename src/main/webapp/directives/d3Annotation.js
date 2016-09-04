/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Note: In many cases, rounded values (~~v) are used to increase performance
'use strict';

// Responsible directive for drawing the text field
angular
    .module('app')
    .directive('d3Annotation', ['$rootScope', '$timeout', '$window', 'd3', 'hotkeys', 'clipboard', '$q',
    function ($rootScope, $timeout, $window, d3, hotkeys, clipboard, $q) {
        return {
            restrict: 'EA',

            scope: {
                onUserChange: "&",
                sizeIncreased: "=",
                data: "=",
                annotations: "=",
                targets: "=",
                links: "=",
                selection: "=",
                tempAnno: "=",
                startSelection: "=",
                endSelection: "=",
                lastAdded: "=",
                lastRemoved: "=",
                lastSet: "=",
                removedSpanType: "=",
                setSelection: "&",
                setTemp: "&",
                getAnnotationById: "&",
                addLink: "&",
                linkable: "&",
                clearSelection: "&",
                increaseSelectedAnnoSizeRight: "&",
                increaseSelectedAnnoSizeLeft: "&",
                decreaseSelectedAnnoSizeRight: "&",
                decreaseSelectedAnnoSizeLeft: "&",
                resetSizeIncreased: "&"
            },

            link: function ($scope, iElement) {
                const lineHeight = 40; // Height of each displayed line of text
                const wordHeight = 40; // Height of lines in annotation boxes
                const margin = 80; // Space on top of text
                const annotationHeight = wordHeight / 2.4; // Distance between multiple annotations on top of each other
                const scale = 1.2; // Scaling factor of text size
                const jDistance = 30; // Amount of lines after which text should be redrawn
                const defaultLinkOpacity = 0.3; // Opacity of currently unselected / unrelated links
                const wordSpacing = 3.5; // Space beween two adjacent tokens
                const opacityRelated = 0.55; // Opacity of elements that are related to the current selection
                const opacityUnrelated = 0.15; // Opacity of elements that are unrelated to the current selection
                const svg = d3.select(iElement[0])
                    .append("svg")
                    .attr("width", "100%")
                    .on("mouseup", function () {
                        $scope.textMarkable(true);
                    });

                var width, height;
                var lineCount;
                var textWidth;
                var textHeight = 0;
                var arity = 1;
                var linkStart;
                var formText = [];
                var formAnnotations = {};
                var prefixes = [];
                var currJ = 0;
                var oldJ = currJ;
                var minJ = 0;
                var maxJ = minJ + jDistance;
                var maxLines = $scope.data.length;
                var i = 0;
                var j = 0;

                $scope.widthMap = {}; // Map to save width of text elements
                $scope.words = [];
                $scope.isAnnotator = ($window.sessionStorage.isAnnotator === "true");
                $scope.index = -1;

                //Re-render on window resize
                window.onresize = function () {
                    return $scope.$apply();
                };

                // Recompute max-height of right site on resize, to allow for scrolling
                $scope.onResize = function () {
                    var offset = 150;
                    $('.scroll-pane').css('max-height', ($(window).height() - offset));
                };

                $scope.onResize();

                angular.element($window).bind('resize', $scope.onResize);

                // Watch scroll behavior of user to only render important
                // text segments
                angular.element($window).bind("scroll", function () {
                    var minDraw = window.pageYOffset;
                    currJ = Math.floor(minDraw / 40);
                    //If the user scrolled more than a specific threshold
                    //since the last re-rendering, a new text segment will
                    //be rendered
                    if (currJ >= (oldJ + jDistance / 1.7) || currJ <= (oldJ - jDistance / 1.55)) {
                        oldJ = currJ;
                        var minDist = oldJ - jDistance;
                        if (minDist <= 0) {
                            minJ = 0;
                            maxJ = oldJ + jDistance - minDist;
                        } else {
                            minJ = minDist;
                            maxJ = oldJ + jDistance;
                        }

                        $scope.drawText(minJ, maxJ);
                        $scope.drawLineNumbers(minJ, maxJ);
                        $scope.drawAnnotations(minJ, maxJ);
                        $scope.drawLinks();
                        $scope.highlightSelected();
                        //Restores linking process.
                        //This is called when the user tries to link two
                        //annotations while a new text segment is loaded
                        if ($scope.linking()) {
                            $scope.textMarkable(false);
                            $scope.highlightLinkableAnnotations(linkStart);
                        }
                    }
                });

                $scope.$watch(function () {
                    return angular.element(window)[0].innerWidth;
                }, function () {
                    $scope.formatText();
                    $scope.setLineHeights();
                    $scope.formatSpanTypes();
                    $scope.formatAnnotations();
                });

                $scope.setIJ = function (ii, jj) {
                    i = ii;
                    j = jj;
                };

                $scope.hot = function (right) {
                    $scope.words = [];
                    var words = $scope.words;
                    $rootScope.ishotkeys = 'true';
                    if (right === 'true') {
                        var textWord = $scope.data[i].words[j];
                        if (textWord !== undefined) {
                            if (textWord.text === " "
                                    || textWord.text === "."
                                    || textWord.text === ","
                                    || textWord.start === textWord.end
                                    || textWord.text === "	") {
                                j++;
                                $scope.hot('true');
                                return;
                            }
                            textWord.setIndices(i, j);
                            words.push(textWord);
                            $scope.setTemp({item: words});
                        } else {
                            if (i < (maxLines - 1)) {
                                i++;
                                j = 0;
                                $scope.hot('true');
                            } else {
                                i = 0;
                                j = 0;
                                $scope.hot('true');
                            }
                        }
                    } else {
                        var textWord = $scope.data[i].words[j];
                        if (textWord !== undefined) {
                            if (textWord.text === " "
                                    || textWord.text === "."
                                    || textWord.text === ","
                                    || textWord.start === textWord.end
                                    || textWord.text === "	") {
                                j--;
                                $scope.hot('false');
                                return;
                            }
                            textWord.setIndices(i, j);
                            words.push(textWord);
                            $scope.setTemp({item: words});
                        } else {
                            if (i > 0) {
                                i--;
                                j = ($scope.data[i].words.length) - 1;
                                $scope.hot('false');
                            } else if ($scope.data[i].words[j - 1] !== undefined) {
                                j--;
                                $scope.hot('false');
                            }
                        }
                    }
                };

                $scope.hotShift = function (right, words) {
                    $rootScope.ishotkeys = 'true';
                    if (right) {
                        var textWord = $scope.data[i].words[j];
                        if (textWord !== undefined) {
                            if (textWord.text === " "
                                    || textWord.text === "."
                                    || textWord.text === ","
                                    || textWord.start === textWord.end
                                    || textWord.text === "	") {
                                textWord.setIndices(i, j);
                                words.push(textWord);
                                j++;
                                $scope.hotShift(true, words);
                                return;
                            }
                            textWord.setIndices(i, j);
                            words.push(textWord);
                            j++;
                            $scope.setTemp({item: words});
                        } else {
                            if ($scope.data[i].words[j + 1] !== undefined) {
                                j++;
                                $scope.hotShift(true, words);
                            } else if (i < (maxLines - 1)) {
                                i++;
                                j = 0;
                                $scope.hotShift(true, words);
                            }
                        }
                    } else {
                        var textWord = $scope.data[i].words[j];
                        if ((words.indexOf(textWord) !== '-1') && (textWord !== undefined)) {
                            if (textWord.text === " "
                                    || textWord.text === "."
                                    || textWord.text === ","
                                    || textWord.start === textWord.end
                                    || textWord.text === "	") {
                                words.pop(textWord);
                                if (j === 0) {
                                    i--;
                                    j = ($scope.data[i].words.length) - 1;
                                } else {
                                    j--;
                                }
                                $scope.hotShift(false, words);
                                $scope.setTemp({item: words});
                                return;
                            }
                            words.pop(textWord);
                            if (j === 0) {
                                i--;
                                j = ($scope.data[i].words.length) - 1;
                            } else {
                                j--;
                            }
                            $scope.setTemp({item: words});
                        } else {
                            if (i > 0) {
                                i--;
                                j = ($scope.data[i].words.length) - 1;
                                $scope.hotShift(false, words);
                            } else if ($scope.data[i].words[j - 1] !== undefined) {
                                j--;
                                $scope.hotShift(false, words);
                            } else {
                            }
                        }
                    }
                };

                $scope.hotShiftDown = function (up, words) {
                    $rootScope.ishotkeys = 'true';
                    if (up === 'true') {
                        if (i > 0) {
                            if (j > 0) {
                                var l = j;
                                for (var s = 0; s < l; s++) {
                                    var textWord = $scope.data[i].words[s];
                                    words.pop(textWord);
                                }
                                $scope.setTemp({item: words});
                                j = 0;
                            } else {
                                i--;
                                var l = ($scope.data[i].words.length);
                                for (var s = 0; s < l; s++) {
                                    var textWord = $scope.data[i].words[s];
                                    words.pop(textWord);
                                }
                                $scope.setTemp({item: words});
                                j = 0;
                            }
                        }
                    } else {
                        var lengths = $scope.data[i].words.length;
                        for (var k = 0; k < lengths; k++) {
                            var textWord = $scope.data[i].words[j];
                            if (textWord !== undefined) {
                                textWord.setIndices(i, j);
                                words.push(textWord);
                                if (textWord === $scope.data[i].words[lengths - 1] && i < (maxLines - 1)) {
                                    i++;
                                    j = 0;
                                    break;
                                } else {
                                    j++;
                                }
                            }
                        }
                        $scope.setTemp({item: words});
                    }
                };

                // Only enable hotkeys for annotators
                if ($scope.isAnnotator) {
                    hotkeys.bindTo($scope)
                            .add({
                                combo: 'shift+up',
                                description: 'Delete temporal selection in current line',
                                callback: function () {
                                    $scope.hotShiftDown('true', $scope.words);
                                }
                            })
                            .add({
                                combo: 'shift+down',
                                description: 'Select whole line',
                                callback: function () {
                                    $scope.hotShiftDown(false, $scope.words);
                                }
                            })
                            .add({
                                combo: 'shift+right',
                                description: 'Long selection',
                                callback: function () {
                                    $scope.hotShift(true, $scope.words);
                                }
                            })
                            .add({
                                combo: 'shift+left',
                                description: 'Delete words from long selection',
                                callback: function () {
                                    $scope.hotShift(false, $scope.words);
                                }
                            })
                            .add({
                                combo: 'up',
                                description: 'Jump to first word in upper line',
                                callback: function () {
                                    if (i > 0) {
                                        j = 0;
                                        i--;
                                        $scope.hot('true');
                                    } else {
                                        j = 0;
                                        i = maxLines - 1;
                                        $scope.hot('true');
                                    }
                                }
                            })
                            .add({
                                combo: 'down',
                                description: 'Jump to first word in lower line',
                                callback: function () {
                                    if (i < (maxLines - 1)) {
                                        j = 0;
                                        i++;
                                        $scope.hot('true');
                                    } else {
                                        j = 0;
                                        i = 0;
                                        $scope.hot('true');
                                    }
                                }
                            })
                            .add({
                                combo: 'right',
                                description: 'Jump from annotation to annotation',
                                callback: function () {
                                    $scope.index++;
                                    var anno = $scope.getAnnotationAtPosition($scope.index, false);
                                    anno.selectedByHotkey = true;
                                    $scope.setSelection({item: anno});
                                }
                            })
                            .add({
                                combo: 'left',
                                description: 'Jump from annotation to annotation',
                                callback: function () {
                                    $scope.index--;
                                    var anno = $scope.getAnnotationAtPosition($scope.index, true);
                                    anno.selectedByHotkey = true;
                                    $scope.setSelection({item: anno});
                                }
                            })
                            .add({
                                combo: 'f',
                                description: 'Add the word to the right to the current annotation',
                                callback: function () {
                                    $scope.increaseSelectedAnnoSizeRight();
                                }
                            })
                            .add({
                                combo: 'd',
                                description: 'Remove the word to the right from the current annotation',
                                callback: function () {
                                    $scope.decreaseSelectedAnnoSizeRight();
                                }
                            })
                            .add({
                                combo: 's',
                                description: 'Remove the word to the left from the current annotation',
                                callback: function () {
                                    $scope.decreaseSelectedAnnoSizeLeft();
                                }
                            })
                            .add({
                                combo: 'a',
                                description: 'Add the word to the left to the current annotation',
                                callback: function () {
                                    $scope.increaseSelectedAnnoSizeLeft();
                                }
                            })
                            .add({
                                combo: 'n',
                                description: 'Cycle backward through outgoing links of selected annotation',
                                callback: function () {
                                    $scope.cycleThroughLinks(true);
                                }
                            })
                            .add({
                                combo: 'm',
                                description: 'Cycle forward through outgoing links of selected annotation',
                                callback: function () {
                                    $scope.cycleThroughLinks(false);
                                }
                            })
                            .add({
                                combo: 'ctrl+c',
                                description: 'Copy the current selected annotations text to the clipboard',
                                callback: function () {
                                    if ($scope.selection !== null
                                            && $scope.selection !== undefined
                                            && $scope.selection.type !== "Link") {

                                        if (!clipboard.supported) {
                                            console.log('d3Annotation: Copy to clipboard function not supported.');
                                        } else {
                                            clipboard.copyText($scope.selection.text);
                                        }
                                    }
                                }

                            });
                }

                // Cycle through outgoing links of the currently selected annotation
                $scope.cycleThroughLinks = function(backwards) {
                    if ($scope.selection === null) {
                        return;
                    }

                    var links;
                    if ($scope.selection.type === "Annotation") {
                        // If current selection is an annotation, select first/last outgoing link
                        links = $scope.getLinksAsArray($scope.selection);
                        if (links.length > 0) {
                            if (!backwards) {
                                $scope.selection = links[0];
                            } else {
                                $scope.selection = links[links.length - 1];
                            }
                        }
                    } else if ($scope.selection.type === "Link") {
                        // If current selection is a link, select next/previous outgoing link
                        links = $scope.getLinksAsArray($scope.selection.source);
                        for (var i = 0; i < links.length; i++) {
                            if (links[i] === $scope.selection) {
                                var j;
                                if (!backwards) {
                                    j = i + 1;
                                    if (j >= links.length) {
                                        j = 0;
                                    }
                                } else {
                                    j = i - 1;
                                    if (j < 0) {
                                        j = links.length - 1;
                                    }
                                }
                                $scope.selection = links[j];
                                break;
                            }
                        }
                    }
                };

                $scope.getLinksAsArray = function(anno) {
                    var res = [];
                    var i = 0;
                    for (var j in $scope.links[anno.id])
                    {
                        res[i] = $scope.links[anno.id][j];
                        i++;
                    }
                    return res;
                };

                $scope.getAnnotationAtPosition = function (index, backwards) {
                    var a = $scope.getSortedAnnotations();
                    if (index < a.length && index >= 0) {
                        return a[index];
                    } else {
                        if (backwards) {
                            $scope.index = a.length - 1;
                            return a[a.length - 1];
                        } else {
                            $scope.index = 0;
                            return a[0];
                        }
                    }
                };

                $scope.getPositionOfAnnotation = function(anno) {
                    var a = $scope.getSortedAnnotations();
                    for (var i in a) {
                        if (a[i].id === anno.id) {
                            return i;
                        }
                    }
                    return -1;
                };

                $scope.getSortedAnnotations = function() {
                    var a = [];
                    var i = 0;
                    for (var id in $scope.annotations) {
                        var anno = $scope.annotations[id];
                        a[i] = anno;
                        i++;
                    }
                    return a.sort($scope.compareAnnotationsByPosition);
                };

                $scope.compareAnnotationsByPosition = function (anno1, anno2) {
                    var x = anno1.words[0].start;
                    var y = anno2.words[0].start;
                    if (x < y) {
                        return -1;
                    } else if (x > y) {
                        return 1;
                    } else {
                        return 0;
                    }
                };

                //Listens to selection changes and redraws correlating sections
                $scope.$watch('selection', function (newVals, oldVals) {
                    if (newVals !== null && newVals !== undefined) {
                        $scope.index = $scope.getPositionOfAnnotation(newVals);
                    }
                    $scope.highlightSelected(oldVals);
                }, true);

                $scope.$watch('links', function () {
                    $scope.drawLinks();
                    $scope.highlightSelected();
                }, true);

                //Listens to changes to the currently temporary annotation
                //and redraws correlating sections
                $scope.$watch('tempAnno', function (newVals, oldVals) {
                    if (oldVals !== undefined && oldVals !== null) {
                        $scope.removeFormAnnotation(oldVals);
                    }
                    if (newVals !== undefined && newVals !== null) {

                        //Gather all the formatted words that correspond
                        //to the annotated words for this annotation
                        var formWords = [];
                        for (var a = 0; a < newVals.words.length; a++) {
                            var word = newVals.words[a];
                            formWords.push(formText[word.lineIndex][word.wordIndex]);
                        }

                        var maxBefore = $scope.maxAnnotationInLine(formWords);
                        $scope.setLineHeights();
                        $scope.addFormAnnotation(newVals, false);
                        const maxAfter = $scope.maxAnnotationInLine(formWords);
                        var maxDiff = true;
                        for (var b = 0; b < maxBefore.length; b++) {
                            var maxB = maxBefore[b];
                            var maxA = maxAfter[b];
                            if (maxA !== maxB && maxA > 0 && maxB > 0) {
                                maxDiff = false;
                                break;
                            }
                        }

                        //Only re-render whole scene if the annotation needs
                        //new space. This is necessary when one of the annotated
                        //words is annotated more than any other word in their
                        //respective lines
                        if (maxDiff) {
                            $scope.drawAnnotations(minJ, maxJ);
                            $scope.highlightSelected();
                            $scope.clearSelection();
                        } else {
                            $scope.render();
                        }
                    }
                }, true);

                //Listens to changes to the last added object
                $scope.$watch('lastAdded', function (newVals) {
                    if (newVals !== undefined) {
                        $scope.setLineHeights();
                        $scope.addFormAnnotation(newVals, false);
                        $scope.drawText(minJ, maxJ);
                        $scope.drawLineNumbers(minJ, maxJ);
                        $scope.drawAnnotations(minJ, maxJ);
                        $scope.highlightSelected();
                    }
                });

                //Listens to changes to the last removed object
                $scope.$watch('lastRemoved', function (newVals) {
                    if (newVals !== undefined) {
                        //Gather all the formatted words that correspond
                        //to the annotated words fo this annotation
                        var formWords = [];
                        for (var a = 0; a < newVals.words.length; a++) {
                            const word = newVals.words[a];
                            formWords.push(formText[word.lineIndex][word.wordIndex]);
                        }

                        var maxBefore = $scope.maxAnnotationInLine(formWords);
                        formAnnotations[newVals.id];
                        $scope.removeFormAnnotation(newVals);
                        $scope.setLineHeights();
                        const maxAfter = $scope.maxAnnotationInLine(formWords);
                        var maxDiff = true;
                        for (var b = 0; b < maxBefore.length; b++) {
                            const maxB = maxBefore[b];
                            const maxA = maxAfter[b];
                            if (maxA !== maxB && maxA > 0 && maxB > 0) {
                                maxDiff = false;
                                break;
                            }
                        }

                        //Only re-render whole scene if the annotation needs
                        //occupied space that is no longer needed after the
                        //deletion
                        if (maxDiff) {
                            $scope.drawAnnotations(minJ, maxJ);
                            $scope.highlightSelected();
                        } else {
                            $scope.render();
                        }
                    }
                });

                //Listens to changes to the last changed object
                $scope.$watch('lastSet', function (newVals) {
                    if (newVals !== undefined) {
                        $scope.drawAnnotations(minJ, maxJ);
                        $scope.highlightSelected();
                    }
                }, true);

                //Listens to changes to the last removed target
                $scope.$watch('removedSpanType', function (newVals) {
                    if (newVals !== undefined) {
                        $scope.removeFormAnnotation(newVals);
                        $scope.setLineHeights();
                        $scope.drawAnnotations(minJ, maxJ);
                    }
                });

                // ADDED for AnnoView
                $rootScope.changeCallback = function () {
                    $scope.onUserChange();
                };

                $scope.$watch('annotations', function (newVals, oldVals) {
                    $scope.formatSpanTypes();
                    $scope.formatAnnotations();
                    $scope.setLineHeights();
                    $scope.render(true);
                });

                //Size increased
                $scope.$watch('sizeIncreased', function (newVals) {
                    if (newVals !== undefined) {
                        // Update Text words to increase annotatedBy Value
                        for (var a = 0; a < newVals.words.length; a++) {
                            var word = newVals.words[a];
                            formText[word.lineIndex][word.wordIndex].word = word;
                        }
                        if (newVals.updatedWords !== undefined) {
                            for (var b = 0; b < newVals.updatedWords.length; b++) {
                                var word = newVals.updatedWords[b];
                                formText[word.lineIndex][word.wordIndex].word.annotatedBy++;
                            }
                        }
                        if (newVals.removedWord !== undefined) {
                            formText[newVals.removedWord.lineIndex][newVals.removedWord.wordIndex].word = newVals.removedWord;
                            for (var key in formText[newVals.removedWord.lineIndex][newVals.removedWord.wordIndex].annoGrid) {
                                if (formText[newVals.removedWord.lineIndex][newVals.removedWord.wordIndex].annoGrid[key] === newVals) {
                                    formText[newVals.removedWord.lineIndex][newVals.removedWord.wordIndex].annoGrid[key] = undefined;
                                }
                            }
                        }
                        $scope.removeFormAnnotation(newVals);
                        $scope.addFormAnnotation(newVals, false);
                        $scope.setLineHeights();
                        $scope.drawText(minJ, maxJ);
                        $scope.drawLineNumbers(minJ, maxJ);
                        $scope.drawAnnotations(minJ, maxJ);
                        $scope.highlightSelected();
                        $scope.resetSizeIncreased();
                    }
                }, true);

                //Determines what text passage the cursor is currently highlighting
                //and tries to create a new temporary annotation for that section
                $scope.$watch('startSelection', function (newVals) {
                    if (newVals === undefined
                            || !$scope.isAnnotator)
                        return;
                    var startLine;
                    var startRow;
                    var endLine;
                    var endRow;
                    for (var i = 0; i < formText.length; i++) {
                        for (var j = 0; j < formText[i].length; j++) {
                            //Find first selected text
                            if (formText[i][j].element === $scope.startSelection) {
                                startLine = i;
                                startRow = j;
                            }
                            //Find last selected word
                            if (formText[i][j].element === $scope.endSelection) {
                                endLine = i;
                                endRow = j;
                                break;
                            }
                        }
                    }

                    //Do nothing when no indicies for the words are found
                    if (startLine === undefined
                            || startRow === undefined
                            || endLine === undefined
                            || endRow === undefined)
                        return;
                    //Add every word between first and last selected word
                    var words = [];
                    var currentLine = startLine;
                    var currentRow = startRow;
                    while (currentLine < endLine) {
                        for (var w = currentRow; w < formText[currentLine].length; w++) {
                            var textWord = $scope.data[currentLine].words[w];
                            if (textWord !== undefined) {
                                textWord.setIndices(currentLine, w);
                                words.push(textWord);
                            }
                        }

                        currentLine++;
                        currentRow = 0;
                    }

                    for (var w = currentRow; w <= endRow; w++) {
                        var textWord = $scope.data[currentLine].words[w];
                        if (textWord !== undefined) {
                            textWord.setIndices(currentLine, w);
                            words.push(textWord);
                        }
                        $scope.setIJ(currentLine, w);
                    }
                    $scope.words = words;
                    $rootScope.ishotkeys = 'false';
                    $scope.setTemp({item: words});
                    $scope.clearSelection();
                });

                //Computes and splits the lines displayed in the annotation field. This is necessary because it is
                //possible that the lines of the text don't fit into one line of the actual field.
                $scope.formatText = function () {
                    formText = [];
                    prefixes = [];
                    var charSizeApproximation = 8.5;
                    width = d3.select(iElement[0])[0][0].offsetWidth / charSizeApproximation;
                    textWidth = width;
                    var maxLines = $scope.data.length;
                    arity = Math.max(Math.floor(Math.log10(Math.abs(maxLines))), 0) + 1;
                    var iY = 0;
                    //Iterate over every line
                    for (var i = 0; i < $scope.data.length; i++) {
                        //Determine line number
                        var lineArity = Math.max(Math.floor(Math.log10(Math.abs(i + 1))), 0) + 1;
                        var prefix = "";
                        while (lineArity < arity) {
                            prefix += "0";
                            lineArity++;
                        }
                        prefixes.push(new linePrefix(prefix + (i + 1) + " | ", lineHeight));
                        //Determine size of line
                        var line = $scope.data[i].words;
                        var lineLength = $scope.data[i].end - $scope.data[i].start;
                        //Split lines if they're to large
                        if (lineLength > textWidth) {
                            var iX = 0;
                            var index = 0;
                            var added = 0;
                            var newLine = [];
                            //Iterate over every text and search split positions
                            while (index < line.length) {
                                var currLength = 0;
                                var nextWord = line[index].text;
                                var nextWordLength = (nextWord !== undefined) ? nextWord.length * scale : 0;
                                var word = nextWord;
                                iX = 0;
                                while ((currLength * (wordSpacing / 4.25) + nextWordLength < textWidth)
                                        || $scope.$parent.isSpace(word)
                                        || $scope.$parent.isPunctuation(word)) {

                                    currLength += word.length + 1;
                                    newLine.push(new formTextWord(line[index], undefined, 0, 0, iX, iY));
                                    iX++;
                                    index++;
                                    if (line[index] !== undefined)
                                        word = line[index].text;
                                    if (index >= line.length)
                                        break;
                                }

                                added++;
                                if (added > 1)
                                    prefixes.push(new linePrefix("", lineHeight));
                                iY++;
                            }

                            formText.push(newLine);
                        } else {
                            var newLine = [];
                            for (var j = 0; j < line.length; j++) {
                                newLine.push(new formTextWord(line[j], undefined, 0, 0, j, iY));
                            }

                            formText.push(newLine);
                            iY++;
                        }
                    }

                    lineCount = iY;
                };

                //Set the height of the lines according to the amount
                //of annotations that the most annotated word in this line has.
                $scope.setLineHeights = function () {
                    //Reset heights of the prefixes
                    for (var g = 0; g < prefixes.length; g++)
                        prefixes[g].height = 0;
                    var currentLine = 0;
                    for (var i = 0; i < formText.length; i++) {
                        var index = 0;
                        var start = 0;
                        var maxAnnotations = 0;
                        while (index < formText[i].length) {
                            var word = formText[i][index];
                            if (word.lY === currentLine) {
                                var texWord = word.word;
                                if (texWord.annotatedBy > maxAnnotations)
                                    maxAnnotations = texWord.annotatedBy;
                                index++;
                            } else {
                                var annotationSpace = (maxAnnotations > 1) ? maxAnnotations - 1 : 0;
                                var newHeight = lineHeight + annotationSpace * annotationHeight;
                                for (var j = start; j < index + 1; j++) {
                                    formText[i][j].maxAnnotations = maxAnnotations;
                                    formText[i][j].height = newHeight;
                                }

                                if (prefixes[currentLine].height < newHeight)
                                    prefixes[currentLine].height = newHeight;
                                start = index;
                                maxAnnotations = 0;
                                currentLine++;
                            }
                        }

                        var annotationSpace = (maxAnnotations > 1) ? maxAnnotations - 1 : 0;
                        var newHeight = lineHeight + annotationSpace * annotationHeight;
                        for (var j = start; j < index; j++) {
                            formText[i][j].maxAnnotations = maxAnnotations;
                            formText[i][j].height = newHeight;
                        }

                        if (prefixes[currentLine].height < newHeight)
                            prefixes[currentLine].height = newHeight;
                    }

                    textHeight = margin;
                    //Set the height of the overall text to the sum
                    //of the heights of the prefixes
                    for (var g = 0; g < prefixes.length; g++) {
                        if (prefixes[g].height === 0) {
                            prefixes[g].height = lineHeight;
                        }
                        textHeight += prefixes[g].height;
                    }

                    height = textHeight;
                    svg.attr('height', height);
                };

                //For every span type add a formatted version to the text field
                $scope.formatSpanTypes = function () {
                    formAnnotations = [];
                    for (var index in $scope.spanTypes) {
                        var indexSpanType = $scope.spanTypes[index];
                        for (var targetID in indexSpanType) {
                            var target = indexSpanType[targetID];
                            $scope.addFormAnnotation(target, true);
                        }
                    }
                };

                //For every annotation add a formatted version to the text field
                $scope.formatAnnotations = function () {
                    for (var id in $scope.annotations) {
                        var anno = $scope.annotations[id];
                        $scope.addFormAnnotation(anno, false);
                    }
                };

                //Add a new formatted annotation to the text
                $scope.addFormAnnotation = function (annotation, isTarget) {
                    var formAnno = new formAnnotation(annotation, isTarget);
                    var add = $scope.buildAnnotationBoxes(formAnno);
                    if (add)
                        formAnnotations[annotation.id] = formAnno;
                    return formAnno;
                };

                $scope.buildAnnotationBoxes = function (formAnnotation) {
                    var annotation = formAnnotation.annotation;
                    var firstWord = annotation.words[0];
                    var lastWord = annotation.words[annotation.words.length - 1];
                    if (firstWord === undefined || lastWord === undefined)
                        return false;
                    var currentLine = firstWord.lineIndex;
                    var startRow = firstWord.wordIndex;
                    var endLine = lastWord.lineIndex;
                    var endRow = lastWord.wordIndex;
                    while (currentLine < endLine) {
                        //handle empty lines
                        if (formText[currentLine].length !== 0) {
                            var lineLength = $scope.data[currentLine].words.length;
                            var firstWord = formText[currentLine][startRow];
                            var lastWord = formText[currentLine][lineLength - 1];
                            var innerLine = firstWord.lY;
                            var lastInner = (lastWord.lY === undefined) ? firstWord.lY : lastWord.lY;
                            var startInner = startRow;
                            while (innerLine <= lastInner) {
                                var annoBox = new AnnotationBox(annotation);
                                for (var i = startInner; i < lineLength; i++) {
                                    var word = formText[currentLine][i];
                                    if (word.lY === innerLine) {
                                        annoBox.addWord(word);
                                        startInner++;
                                    } else
                                        break;
                                }

                                innerLine++;
                                formAnnotation.addBox(annoBox);
                                $scope.findBoxPosition(annoBox);
                            }
                        }
                        startRow = 0;
                        currentLine++;
                    }

                    //Last line
                    var firstWord = formText[endLine][startRow];
                    var lastWord = formText[endLine][endRow];
                    var innerLine = firstWord.lY;
                    var lastInner = lastWord.lY;
                    var startInner = startRow;
                    while (innerLine <= lastInner) {
                        var annoBox = new AnnotationBox(annotation);
                        for (var j = startInner; j <= endRow; j++) {

                            var word = formText[currentLine][j];
                            if (word.lY === innerLine) {
                                annoBox.addWord(word);
                                startInner++;
                            } else
                                break;
                        }

                        innerLine++;
                        formAnnotation.addBox(annoBox);
                        $scope.findBoxPosition(annoBox);
                    }

                    return true;
                };

                //Iterate over annotation grid to find a position for the annotations
                //that don't overlap with existing annotations
                $scope.findBoxPosition = function (annotationBox) {
                    for (var k = 0; k < annotationBox.formWords[0].maxAnnotations; k++) {
                        var foundPosition = false;
                        for (var l = 0; l < annotationBox.formWords.length; l++) {
                            var formWord = annotationBox.formWords[l];
                            if (formWord.annoGrid[k] === undefined
                                    || formWord.annoGrid[k].id === annotationBox.annotation.id)
                                foundPosition = true;
                            else {
                                foundPosition = false;
                                break;
                            }
                        }

                        if (foundPosition) {
                            var isTempAnno = annotationBox.annotation.id === undefined;
                            annotationBox.height = k;
                            for (var h = 0; h < annotationBox.formWords.length; h++) {
                                var formWord = annotationBox.formWords[h];
                                if (!isTempAnno) {
                                    formWord.annoGrid[k] = annotationBox.annotation;
                                }
                            }

                            break;
                        }
                    }
                };

                //Remove a formatted annotation to the text and rearrange those
                //annotations that annotate the same words in the text
                $scope.removeFormAnnotation = function (annotation) {
                    var formAnnotation = formAnnotations[annotation.id];
                    if (formAnnotation === undefined)
                        return;
                    var annotationSet = {};
                    //Find all annotations that annotate one of the words that are also
                    //being annotated by the annotation that should be removed
                    for (var k = 0; k < formAnnotation.annotationBoxes.length; k++) {
                        var annotationBox = formAnnotation.annotationBoxes[k];
                        for (var i = 0; i < annotationBox.formWords.length; i++) {
                            var formWord = annotationBox.formWords[i];
                            for (var j = 0; j < formWord.maxAnnotations; j++) {
                                if (formWord.annoGrid[j] !== undefined) {
                                    var anno = formWord.annoGrid[j];
                                    if (anno !== undefined && anno.id !== annotation.id && annotationSet[anno.id] === undefined)
                                        annotationSet[anno.id] = anno;
                                }
                            }

                            formWord.annoGrid = {};
                        }
                    }

                    //Rearrange the annotations
                    for (var id in annotationSet) {
                        var formAnno = formAnnotations[id];
                        if (formAnno !== undefined) {
                            for (var h = 0; h < formAnno.annotationBoxes.length; h++)
                                $scope.findBoxPosition(formAnno.annotationBoxes[h], annotationSet[id]);
                        }
                    }

                    delete formAnnotations[annotation.id];
                };

                //Main rendering function of the annotation field
                $scope.render = function (resize) {
                    if (resize) {
                        svg.selectAll("*").remove();
                        $scope.drawBackground();
                    }

                    $scope.drawText(minJ, maxJ);
                    $scope.drawAnnotations(minJ, maxJ);
                    $scope.drawLinks();
                    $scope.highlightSelected();
                    $scope.drawLineNumbers(minJ, maxJ);
                };

                //Draw (invisible) background of text that can react to click events
                $scope.drawBackground = function () {
                    svg.append("rect")
                            .attr("width", width * 10)
                            .attr("height", height)
                            .style("fill", "white")
                            .on("mouseup", function () {
                                if (linkStart !== null) {
                                    linkStart = null;
                                    $scope.drawEverything();
                                }

                                $scope.textMarkable(true);
                                $scope.$apply(function () {
                                    $scope.setSelection({item: null});
                                });
                            });
                };

                //Draw the the basic text
                $scope.drawText = function (minLine, maxLine) {
                    svg.selectAll(".annotationtext").remove();
                    var pre = 30 + 20 * arity;
                    var currentLine = 0;
                    var currentHeight = margin;
                    //Estimate which lines actually need to be drawn.
                    //This is necessary because one text line can occupy
                    //several actual lines on the screen.
                    //E.g. distance between minLine and maxLine is 10 but
                    //the first line already occupies 8 lines on the screen.
                    //Therefore, only 2 lines from the text need to be drawn.
                    var firstLine = 0;
                    var lastLine = maxLine;
                    for (var a = 0; a < formText.length; a++) {
                        var currLine = formText[a];
                        if (currLine.length > 0) {
                            var firstWord = currLine[0];
                            if (firstWord.lY >= minLine && firstLine === 0 && minLine > 0)
                                firstLine = a - 2;
                            if (firstWord.lY >= maxLine) {
                                lastLine = a;
                                break;
                            }
                        }
                    }

                    //Estimate the position of those lines on the screen
                    for (var c = 0; c < firstLine; c++) {
                        var currLine = formText[c];
                        if (currLine.length === 0)
                            currentHeight += lineHeight;
                        else {
                            var lY = 0;
                            for (var b = 0; b < currLine.length; b++) {
                                var currWord = currLine[b];
                                if (currWord.lY > lY) {
                                    lY = currWord.lY;
                                    currentHeight += currWord.height;
                                }
                            }
                        }
                    }

                    currentLine = firstLine;
                    //Draw the actual text by iterating through the lines
                    var dat = [];
                    var pos = pre;
                    for (var j = firstLine; j <= lastLine; j++) {
                    	//Safety measure:
                    	//Stop drawing if a non-existing line is reached
                    	 if (formText[j] === undefined) {
                             break;
                    	 }
                    	// Add empty line in front of first line
                    	if(j == 0) {
                    		dat.push(undefined)
                    	}
                    	// Add line to draw
                        dat = dat.concat(formText[j]);
                        // If empty line add undefined
                        if (formText[j].length === 0) {
                        	dat.push(undefined)
                        }
                    }
                    //Draw each word of the current text line into the
                    //corresponding lines on the screen
                    svg.selectAll("text.content")
                            .data(dat)
                            .enter()
                            .append(function (d) {
                                var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                                // Handle empty lines
                                if (d === undefined) {
                                	text.innerHTML = ''
                                } else {
                                	text.innerHTML = d.word.text;
                                	d.element = text;
                                }
                                return text;
                            })
                            .attr("font-size", function () {
                                return Math.floor(scale * 100) + "%";
                            })
                            .attr("fill", "black")
                            // Compute widths bundled beforehand, because it forces browser reflow
                            .each(function(d){
                            	// Handle empty lines
                            	if(d === undefined || $scope.widthMap[d.word.text] !== undefined){
                            		return
                            	}
                            	$scope.widthMap[d.word.text] = d.element.getComputedTextLength()
                            })
                            .attr("x", function (d) {
                            	// Handle empty lines
                            	if (d === undefined) {
                            		return pos
                            	}
                                if (d.lX === 0)
                                    pos = pre;
                                //var spacing = ($scope.$parent.isPunctuation(d.word.text) || d.word.text === " ") ? 0 : wordSpacing;
                                var spacing = ($scope.$parent.isPunctuation(d.word.text) || $scope.isWhitespace(d.word.text)) ? 0 : wordSpacing;
                                pos += spacing;
                                d.x = pos;
                                // load previously computed lengths
                                d.width = $scope.widthMap[d.word.text];
                                pos += d.width;

                                return ~~d.x;
                            })
                            .attr("y", function (d, i) {
                            	// Handle empty lines
                            	if (d === undefined) {
                            		currentHeight += lineHeight;
                            	} else {
                                    //Set the height of the current word to the height of
                                    //the previous word if we are still in the same line
                                    if (d.lY === currentLine) {
                                        d.y = currentHeight;
                                    } else {
                                    	//Set the height of the first word of a new line
                                    	//to the previous height + the height of that line
                                        d.y = currentHeight + d.height;
                                        currentLine = d.lY;
                                    }
                                    currentHeight = d.y;
                            	}
                                return ~~currentHeight;
                            })
                            .classed("annotationtext", function(d) {
                            	// Handle empty lines
                            	return d !== undefined;
                            })
                            .on("mouseup", function () {
                                if (linkStart !== null) {
                                    linkStart = null;
                                    $scope.drawEverything();
                                }
                            });
                };

                $scope.isWhitespace = function(str) {
                    return $.trim(str) === "";
                };

                $scope.applyLink = function (d) {
                    var link;
                    if ($scope.linking()) {
                        if (linkStart.id !== d.annotation.id) {
                            var promise = $scope.addLink({source: linkStart, target: d.annotation});
                            promise.then(function (link) {
                                if (link !== undefined) {
                                    $scope.setSelection({item: link});
                                }
                            });
                        }
                        linkStart = null;
                    }

                    if (link !== undefined)
                        $scope.setSelection({item: link});
                    else
                        $scope.setSelection({item: d.annotation});
                };

                $scope.getTitle = function (d) {
                    var text = "";
                    for (var key in d.annotation.activeLabels) {
                        var set = d.annotation.activeLabels[key];
                        for (var i = 0; i < set.length; i++) {
                            text += (set[i].tag + " ");
                        }
                    }
                    if (d.annotation.sType === undefined) {
                        return "";
                    } else {
                        return 'Type: ' + d.annotation.sType.tag + " | Labels: " + text;
                    }
                };

                //Draw annotations above corresponding words in the text
                $scope.drawAnnotations = function (minLine, maxLine) {
                    svg.selectAll(".annotationbox").remove();
                    svg.selectAll(".annotationboxtext").remove();
                    for (var annoID in formAnnotations) {
                        var annotation = formAnnotations[annoID];
                        //If the annotation isn't visible, we don't need to draw it
                        if (!$scope.isVisible(annotation, minLine, maxLine))
                            continue;
                        var annotationBoxes = annotation.annotationBoxes;
                        //Draw the background boxes
                        svg.selectAll("annotationboxes")
                                .data(annotationBoxes)
                                .enter()
                                .append("rect")
                                .attr("fill", function (d) {
                                    return d.annotation.color.fill();
                                })
                                .attr("title", function (d) {
                                    return d.annotation;
                                })
                                .attr("stroke", function (d) {
                                    return d.annotation.color.back;
                                })
                                .style("stroke-width", 1)
                                .style("stroke-dasharray", function (d) {
                                    if (d.isTarget)
                                        return("1", "3");
                                })
                                .attr("height", wordHeight / 3)
                                .attr("width", function (d) {
                                    var width = 0;
                                    var leftEdge;
                                    var rightEdge;
                                    for (var i = 0; i < d.formWords.length; i++) {
                                        var formWord = d.formWords[i];
                                        if (leftEdge === undefined || formWord.x < leftEdge) {
                                            leftEdge = formWord.x;
                                        }
                                        if (rightEdge === undefined || (formWord.x + formWord.width) > rightEdge) {
                                            rightEdge = formWord.x + formWord.width;
                                        }
                                    }
                                    width = rightEdge - leftEdge;

                                    d.width = width;
                                    return ~~d.width;
                                })
                                .attr("x", function (d) {
                                        // Iterate, because first word could be a whitespace
                                    var word = d.formWords[0];
                                    d.x = word.x;
                                    return ~~d.x;
                                })
                                .attr("y", function (d) {
                                        // Iterate, because first word could be a whitespace
                                    var word = d.formWords[0];
                                    var height = 1 + d.height;
                                    var firstAnnoHeight = wordHeight / 1.45;
                                    var y = (height === 1) ? firstAnnoHeight :
                                            firstAnnoHeight + (annotationHeight * (height - 1));
                                    d.y = word.y - y;
                                    return ~~d.y;
                                })
                                .classed("annotationbox", true)
                                .on("mouseout", function (d) {
                                    var formAnno = formAnnotations[d.annotation.id];
                                    for (var i = 0; i < formAnno.annotationBoxes.length; i++) {
                                        for (var j = 0; j < formAnno.annotationBoxes[i].formWords.length; j++) {
                                            var formWord = formAnno.annotationBoxes[i].formWords[j];
                                            var element = formWord.element;
                                            if (element !== undefined)
                                                element.setAttribute("fill", "black");
                                        }
                                    }

                                    if (linkStart !== undefined && linkStart !== null && linkStart === formAnno.annotation) {
                                        $scope.highlightLinkableAnnotations(d.annotation);
                                    }
                                })
                                .on("mousedown", function (d) {
                                    $scope.$apply(function () {
                                        linkStart = d.annotation;
                                        $scope.textMarkable(false);
                                    });
                                })
                                .on("mouseup", function (d) {
                                    $scope.$apply($scope.applyLink(d));
                                })
                                .append("svg:title").text(function (d) {
                                    return $scope.getTitle(d);
                                });

                        //Draw the actual annotation text
                        svg.selectAll("annotations")
                                .data(annotationBoxes)
                                .enter()
                                .append("text")
                                .attr("height", wordHeight / 3)
                                .attr("fill", function (d) {
                                    return d.annotation.color.back;
                                })
                                .attr("x", function (d) {
                                    var firstWord = d.formWords[0];
                                    var width = 0;
                                    for (var i = 0; i < d.formWords.length; i++) {
                                        var formWord = d.formWords[i];
                                        if (formWord.element === undefined)
                                            width += wordSpacing;
                                        else
                                        	// load previously computed lengths
                                            width += $scope.widthMap[formWord.word.text];
                                    }
                                    return ~~firstWord.x + 0.5 * width;
                                })
                                .attr("y", function (d) {
                                    var offsetFactor = 0.575;
                                    var word = d.formWords[0];
                                    var height = 1 + d.height;
                                    var firstAnnoHeight = wordHeight / 1.45 * offsetFactor;
                                    var y = (height === 1) ? firstAnnoHeight :
                                            firstAnnoHeight + (annotationHeight * (height - 1));
                                    return ~~word.y - y;
                                })
                                .text(function (d) {
                                    var textLength = 0;
                                    for (var j = 0; j < d.formWords.length; j++) {
                                        var text = d.formWords[j].word.text;
                                        textLength += text.length;
                                    }
                                    textLength = Math.floor(textLength * 0.7);
                                    return d.annotation.shortenLabels(textLength);
                                })
                                .attr("class", "annotationboxtext unselectable")
                                .on("mouseover", function (d) {
                                    var formAnno = formAnnotations[d.annotation.id];
                                    for (var i = 0; i < formAnno.annotationBoxes.length; i++) {
                                        for (var j = 0; j < formAnno.annotationBoxes[i].formWords.length; j++) {
                                            var formWord = formAnno.annotationBoxes[i].formWords[j];
                                            var element = formWord.element;
                                            if (element !== undefined)
                                                element.setAttribute("fill", d.annotation.color.fill);
                                        }
                                    }
                                })
                                .on("mouseout", function (d) {
                                    var formAnno = formAnnotations[d.annotation.id];
                                    for (var i = 0; i < formAnno.annotationBoxes.length; i++) {
                                        for (var j = 0; j < formAnno.annotationBoxes[i].formWords.length; j++) {
                                            var formWord = formAnno.annotationBoxes[i].formWords[j];
                                            var element = formWord.element;
                                            if (element !== undefined)
                                                element.setAttribute("fill", "black");
                                        }
                                    }

                                    if ($scope.linking())
                                        $scope.highlightLinkableAnnotations(d.annotation);
                                })
                                .on("mousedown", function (d) {
                                    linkStart = d.annotation;
                                    $scope.textMarkable(false);
                                })
                                .on("mouseup", function (d) {
                                    $scope.$apply($scope.applyLink(d));
                                }).append("svg:title").text(function (d) {
                                    return $scope.getTitle(d);
                                });
                    }
                };

                //Draw the links as lines between the corresponding annotation boxes
                $scope.drawLinks = function () {
                    var lineFunction = d3.svg.line()
                            .x(function (d) {
                                return d.x;
                            })
                            .y(function (d) {
                                return d.y;
                            })
                            .interpolate("linear");
                    svg.selectAll(".annotationlink").remove();
                    svg.selectAll(".annotationlinktext").remove();
                    svg.selectAll("defs").remove();
                    var minLine = minJ;
                    var maxLine = maxJ;
                    for (var outerLinkID in $scope.links) {
                        var outerLinks = $scope.links[outerLinkID];
                        //Path of the link
                        svg.selectAll("annotationlinks")
                                .data(d3.entries(outerLinks).filter(function (d) {
                                    const link = d.value;
                                    const source = formAnnotations[link.source.id];
                                    const target = formAnnotations[link.target.id];
                                    //Only draw link when at least one of the annotations are visible
                                    return $scope.isVisible(source, minLine, maxLine) || $scope.isVisible(target, minLine, maxLine);
                                }))
                                .enter()
                                .append("path")
                                .attr("d", function (d) {
                                    const source = d.value.source;
                                    const target = d.value.target;
                                    const formSource = formAnnotations[source.id];
                                    const formTarget = formAnnotations[target.id];
                                    const sourceBox = formSource.annotationBoxes[formSource.annotationBoxes.length - 1];
                                    const targetBox = formTarget.annotationBoxes[0];

                                    // Determine the edges of the path of the link;
                                    // if the position of one of the boxes is not yet known, estimate it
                                    // by using the first word of the corresponding annotation
                                    if (sourceBox.x === undefined && sourceBox.y === undefined && sourceBox.width === undefined
                                            && targetBox.x === undefined && targetBox.y === undefined && targetBox.width === undefined) {
                                        $scope.drawText(sourceBox.formWords[0].lY-10,sourceBox.formWords[0].lY+10);
                                        $scope.drawText(minJ, maxJ);
                                        return lineFunction(
                                            [{"x": ~~sourceBox.formWords[0].x + sourceBox.formWords[0].width, "y": ~~sourceBox.formWords[0].y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.formWords[0].x + sourceBox.formWords[0].width * 1.3)), "y": ~~sourceBox.formWords[0].y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.formWords[0].x + sourceBox.formWords[0].width * 1.3)), "y": ~~targetBox.y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.formWords[0].x + 0.5 * targetBox.formWords[0].width, "y": ~~targetBox.formWords[0].y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.formWords[0].x + 0.5 * targetBox.formWords[0].width, "y": ~~targetBox.formWords[0].y}]
                                        );
                                    }
                                    if (sourceBox.x === undefined && sourceBox.y === undefined && sourceBox.width === undefined) {
                                        $scope.drawText(sourceBox.formWords[0].lY-10,sourceBox.formWords[0].lY+10);
                                        $scope.drawText(minJ, maxJ);
                                        return lineFunction(
                                            [{"x": ~~sourceBox.formWords[0].x + sourceBox.formWords[0].width, "y": ~~sourceBox.formWords[0].y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.formWords[0].x + sourceBox.formWords[0].width * 1.3)), "y": ~~sourceBox.formWords[0].y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.formWords[0].x + sourceBox.formWords[0].width * 1.3)), "y": ~~targetBox.y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.x + 0.5 * targetBox.width, "y": ~~targetBox.y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.x + 0.5 * targetBox.width, "y": ~~targetBox.y}]
                                        );
                                    }
                                    if (targetBox.x === undefined && targetBox.y === undefined && targetBox.width === undefined) {
                                        $scope.drawText(targetBox.formWords[0].lY-10,targetBox.formWords[0].lY+10);
                                        $scope.drawText(minJ, maxJ);
                                        return lineFunction(
                                            [{"x": ~~sourceBox.x + sourceBox.width, "y": ~~sourceBox.y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.x + sourceBox.width * 1.3)), "y": ~~sourceBox.y + 0.5 * wordHeight / 3},
                                                {"x": ~~((sourceBox.x + sourceBox.width * 1.3)), "y": ~~targetBox.formWords[0].y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.formWords[0].x + 0.5 * targetBox.formWords[0].width, "y": ~~targetBox.formWords[0].y - 1.5 * wordHeight / 3},
                                                {"x": ~~targetBox.formWords[0].x + 0.5 * targetBox.formWords[0].width, "y": ~~targetBox.formWords[0].y}]
                                        );
                                    }
                                    // If both boxes are well-defined, return path between them
                                    const lineData = [{"x": ~~sourceBox.x + sourceBox.width, "y": ~~sourceBox.y + 0.5 * wordHeight / 3},
                                        {"x": ~~((sourceBox.x + sourceBox.width * 1.3)), "y": ~~sourceBox.y + 0.5 * wordHeight / 3},
                                        {"x": ~~((sourceBox.x + sourceBox.width * 1.3)), "y": ~~targetBox.y - 1.5 * wordHeight / 3},
                                        {"x": ~~targetBox.x + 0.5 * targetBox.width, "y": ~~targetBox.y - 1.5 * wordHeight / 3},
                                        {"x": ~~targetBox.x + 0.5 * targetBox.width, "y": ~~targetBox.y}];
                                    return lineFunction(lineData);
                                })
                                .attr("fill", "none")
                                .attr("stroke-width", 1.5)
                                .attr("opacity", 0)
                                .attr("stroke", function (d) {
                                    var source = d.value.source;
                                    return source.color.line;
                                })
                                .attr("marker-end", "url(#bolt)")
                                .classed("annotationlink", true)
                                .on("mouseup", function () {
                                    if (linkStart !== null) {
                                        linkStart = null;
                                        $scope.drawEverything();
                                    }
                                });
                        //Draw arrow at the end of the path
                        svg.append("svg:defs").selectAll("linkmarker")
                                .data(["bolt"])
                                .enter()
                                .append("svg:marker")
                                .attr("id", String)
                                .attr("viewBox", "0 -5 10 10")
                                .attr("refX", 10)
                                .attr("refY", 0)
                                .attr("markerWidth", 5)
                                .attr("markerHeight", 5)
                                .attr("orient", "auto")
                                .append("svg:path")
                                .attr("d", "M0,-5L10,0L0,5");
                        //Link text
                        svg.selectAll("annotationlinktexts")
                                .data(d3.entries(outerLinks))
                                .enter()
                                .append("text")
                                .attr("height", wordHeight / 3)
                                .attr("fill", "black")
                                .attr("font-weight", "bold")
                                .attr("fill", function (d) {
                                    var source = d.value.source;
                                    return source.color.line;
                                })
                                .text("")
                                .classed("annotationlinktext", true)
                                .classed("unselectable", true)
                                .on("click", function (d) {
                                    $scope.$apply(function () {
                                        $scope.setSelection({item: d.value});
                                    });
                                })
                                .on("mouseup", function () {
                                    if (linkStart !== null) {
                                        linkStart = null;
                                        $scope.drawEverything();
                                    }
                                });
                    }
                };

                //Draw the line numbers
                $scope.drawLineNumbers = function (minLine, maxLine) {
                    svg.selectAll("text.linenumber").remove();
                    //Estimate the position of the first line number on
                    //the screen
                    var currentHeight = margin;
                    if (minLine > 0) {
                        const min = (formText[0].length === 0) ? minLine : minLine - 1;
                        for (var i = 0; i < min; i++) {
                            if (prefixes[i] != undefined)
                                currentHeight += prefixes[i].height;
                        }
                    }

                    //Draw the line numbers of lines between
                    //minLine and maxLine
                    svg.selectAll("linenumber")
                            .data(prefixes.filter(function (d, i) {
                                return (i >= minLine) && (i < maxLine);
                            }))
                            .enter()
                            .append("text")
                            .attr("font-size", function () {
                                return Math.floor(scale * 100) + "%";
                            })
                            .attr("fill", "grey")
                            .attr("class", "unselectable")
                            .attr("y", function (d) {
                                currentHeight += d.height;
                                return ~~currentHeight;
                            })
                            .attr("x", 20)
                            .text(function (d) {
                                return d.prefix;
                            })
                            .classed("linenumber", true);
                };

                // Draw everything with regular opacity
                $scope.drawEverything = function () {
                    svg.selectAll(".annotationtext")
                            .style("opacity", 1);
                    svg.selectAll(".annotationbox")
                            .style("opacity", 1);
                    svg.selectAll(".annotationboxtext")
                            .style("opacity", 1);
                    svg.selectAll(".annotationlink")
                            .style("opacity", defaultLinkOpacity);
                    svg.selectAll(".annotationlinktext")
                            .text("")
                            .style("opacity", defaultLinkOpacity);
                };

                // Highlight all annotations and their corresponding text
                $scope.highlightAllAnnotations = function () {
                    svg.selectAll(".annotationbox")
                            .style("opacity", function (d) {
                                return 1;
                            });
                    svg.selectAll(".annotationboxtext")
                            .style("opacity", function (d) {
                                return 1;
                            });
                    svg.selectAll(".annotationtext")
                            .style("opacity", function (d) {
                                for (var id in d.annoGrid)
                                    return 1;
                                return opacityUnrelated;
                            });
                };

                // Highlight all annotations and their corresponding text
                // if they are linkable with the source annotation
                $scope.highlightLinkableAnnotations = function (source) {
                    svg.selectAll(".annotationbox")
                            .style("opacity", function (d) {
                                const linkable = $scope.linkable({source: source, target: d.annotation});
                                return linkable ? 1 : opacityUnrelated;
                            });
                    svg.selectAll(".annotationboxtext")
                            .style("opacity", function (d) {
                                const linkable = $scope.linkable({source: source, target: d.annotation});
                                return linkable ? 1 : opacityUnrelated;
                            });
                    svg.selectAll(".annotationtext")
                            .style("opacity", function (d) {
                                for (var id in d.annoGrid) {
                                    const anno = d.annoGrid[id];
                                    const linkable = $scope.linkable({source: source, target: anno});
                                    return linkable ? 1 : opacityUnrelated;
                                }

                                return opacityUnrelated;
                            });
                };

                // Highlights the currently selected object and all
                // related objects
                $scope.highlightSelected = function (lastSelection) {
                    if ($scope.selection === null || $scope.selection === undefined) {
                        $scope.drawEverything();
                    } else {
                        if ($scope.selection.selectedInGraph === true) {
                            $scope.jumpToSelection($scope.simpleJump);
                            $scope.selection.selectedInGraph = false;
                        } else if ($scope.selection.selectedByHotkey === true) {
                            $scope.jumpToSelection($scope.smartJump);
                            $scope.selection.selectedByHotkey = false;
                        }
                        svg.selectAll(".annotationtext")
                                .style("opacity", function (d) {
                                    for (var id in d.annoGrid) {
                                        var anno = d.annoGrid[id];
                                        var linked = 0;
                                        switch ($scope.selection.type) {
                                            case "Annotation":
                                            case "Target":
                                                linked = $scope.areLinked(anno, $scope.selection);
                                                break;
                                            case "Link":
                                                linked = $scope.partOfLink(anno, $scope.selection);
                                                break;
                                        }

                                        switch (linked) {
                                            case 1:
                                            case 2:
                                                return opacityRelated;
                                            case 3:
                                                return 1;
                                        }

                                    }

                                    return opacityUnrelated;
                                });
                        svg.selectAll(".annotationbox")
                                .style("stroke-width", function (d) {
                                    return (d.annotation === $scope.selection) ? 1.65 : 1;
                                })
                                .style("opacity", function (d) {
                                    var linked = 0;
                                    switch ($scope.selection.type) {
                                        case "Annotation":
                                        case "Target":
                                            linked = $scope.areLinked(d.annotation, $scope.selection);
                                            break;
                                        case "Link":
                                            linked = $scope.partOfLink(d.annotation, $scope.selection);
                                            break;
                                    }

                                    switch (linked) {
                                        case 0:
                                            return opacityUnrelated;
                                        case 3:
                                            return 1;
                                        default:
                                            return opacityRelated;
                                    }
                                });
                        svg.selectAll(".annotationboxtext")
                                .style("opacity", function (d) {
                                    var linked = 0;
                                    switch ($scope.selection.type) {
                                        case "Annotation":
                                        case "Target":
                                            linked = $scope.areLinked(d.annotation, $scope.selection);
                                            break;
                                        case "Link":
                                            linked = $scope.partOfLink(d.annotation, $scope.selection);
                                            break;
                                    }

                                    switch (linked) {
                                        case 0:
                                            return opacityUnrelated;
                                        case 1:
                                            return opacityRelated;
                                        default:
                                            return 1;
                                    }
                                });
                        svg.selectAll(".annotationlink")
                                .style("opacity", function (d) {
                                    var linked = $scope.getConnection(d.value, $scope.selection);
                                    switch (linked) {
                                        case 0:
                                            return defaultLinkOpacity;
                                        case 3:
                                            return 1;
                                        default:
                                            return 0.5;
                                    }
                                });
                        svg.selectAll(".annotationlinktext")
                                .text(function (d) {
                                    var t = d.value.shortenLabels(10);
                                    return (t === "") ? "click here to add label" : t;
                                })
                                .style("opacity", function (d) {
                                    var linked = $scope.getConnection(d.value, $scope.selection);
                                    switch (linked) {
                                        case 0:
                                            return defaultLinkOpacity;
                                        case 3:
                                            return 1;
                                        default:
                                            return 0.8;
                                    }
                                })
                                .attr("x", function (d) {
                                    var link = d.value;
                                    //Set selection to lastSelection when selecting a link to prevent jumping text
                                    var sel = (lastSelection !== undefined && lastSelection !== null && $scope.selection.type === "Link")
                                            ? lastSelection : $scope.selection;
                                    var linked = $scope.getConnection(link, sel);
                                    switch (linked) {
                                        case 1:
                                        case 3:
                                            var target = link.target;
                                            var formTarget = formAnnotations[target.id];
                                            const targetBox = formTarget.annotationBoxes[0];
                                            return targetBox.x + targetBox.width * 0.5;
                                        default:
                                            var source = link.source;
                                            var formTarget = formAnnotations[source.id];
                                            var boxCount = formTarget.annotationBoxes.length;
                                            const sourceBox = formTarget.annotationBoxes[boxCount - 1];
                                            return sourceBox.x + sourceBox.width + 10;
                                    }
                                })
                                .attr("y", function (d) {
                                    var link = d.value;
                                    //Set selection to lastSelection when selecting a link to prevent jumping text
                                    var sel = (lastSelection !== undefined && lastSelection !== null && $scope.selection.type === "Link")
                                            ? lastSelection : $scope.selection;
                                    var linked = $scope.getConnection(link, sel);
                                    switch (linked) {
                                        case 1:
                                        case 3:
                                            var target = link.target;
                                            var formTarget = formAnnotations[target.id];
                                            var targetBox = formTarget.annotationBoxes[0];
                                            //Set heightScale depending on the relation of source and target
                                            const heightScale = ($scope.links[target.id] !== undefined
                                                    && $scope.links[target.id][link.source.id] !== undefined && $scope.selection.type !== "Link") ? 0.7 : 0.6;
                                            return targetBox.y - wordHeight * heightScale;
                                        default:
                                            var source = link.source;
                                            var formTarget = formAnnotations[source.id];
                                            var boxCount = formTarget.annotationBoxes.length;
                                            const sourceBox = formTarget.annotationBoxes[boxCount - 1];
                                            return sourceBox.y;
                                    }
                                });
                    }
                };

                $scope.jumpToSelection = function(jumpFunction) {
                    var jumpTarget;
                    if ($scope.selection.type === "Link") {
                        jumpTarget = $scope.selection.source;
                    } else {
                        jumpTarget = $scope.selection;
                    }
                    for (var annoID in formAnnotations) {
                        var annotation = formAnnotations[annoID];
                        if (annotation.annotation === jumpTarget) {
                            // Use first word in Anno, since first box might not have a coordinate
                            const firstWord = annotation.annotationBoxes[0].formWords[0];
                            if (firstWord.x === 0 && firstWord.y === 0) {
                                // If exact position not yet known, draw the necessary text
                                $scope.drawText(firstWord.lY - 30, firstWord.lY + 30);
                            }
                            jumpFunction(firstWord);
                            return;
                        }
                    }
                };

                $scope.simpleJump = function(word) {
                    window.scrollTo(word.x, word.y);
                };

                // If the word is currently not within view, jump towards it
                // so that is positioned near the edge of the screen
                // (less disorienting when navigating the document)
                $scope.smartJump = function(word) {
                    const sizeOfNavbar = 55;
                    const spaceAboveText = 120;
                    const bufferSpaceLower = 20;
                    const bufferSpaceUpper = 70;
                    const lowerEdge = window.innerHeight + window.scrollY - sizeOfNavbar - spaceAboveText - bufferSpaceLower;
                    const upperEdge = lowerEdge - (window.innerHeight - sizeOfNavbar) + bufferSpaceUpper;
                    if (word.y < upperEdge) {
                        window.scrollTo(word.x, word.y);
                    } else if (word.y > lowerEdge) {
                        window.scrollTo(word.x, word.y - (window.innerHeight - sizeOfNavbar - 175));
                    }
                };

                //Determine relation between the object and the current selection
                $scope.getConnection = function (object, selection) {
                    switch (selection.type) {
                        case "Annotation":
                        case "Target":
                            return $scope.partOfLink(selection, object);
                        case "Link":
                            return (object === selection) ? 3 : 0;
                    }
                };

                //Checks if a and b are linked
                //Returns 0 when a and b are not linked
                //Returns 1 when a -> b
                //Returns 2 when a <- b
                //Returns 3 when a <-> b or a == b
                $scope.areLinked = function (a, b) {
                    if (a === undefined || b === undefined)
                        return 0;
                    if (a === b)
                        return 3;
                    var ab = ($scope.links[a.id] !== undefined) && ($scope.links[a.id][b.id] !== undefined);
                    var ba = ($scope.links[b.id] !== undefined) && ($scope.links[b.id][a.id] !== undefined);
                    if (ab && ba)
                        return 3;
                    if (ab)
                        return 1;
                    if (ba)
                        return 2;
                    return 0;
                };

                //Checks if the annotation is part of the link
                //Returns 0 when that's not the case
                //Returns 1 when the annotation is the source
                //Returns 2 when the annotation is the target
                $scope.partOfLink = function (annotation, link) {
                    if (link.source.id === annotation.id)
                        return 1;
                    if (link.target.id === annotation.id)
                        return 2;
                    return 0;
                };

                //Makes the whole text field markable or not
                $scope.textMarkable = function (markable) {
                    svg.selectAll(".annotationtext")
                            .classed("unselectable", !markable);
                };

                //Determine the actual amount of lines displayed on the screen
                $scope.maxLines = function () {
                    //Iterate over each line starting from the end of the text until a non-empty
                    //line is found. Add count of empty lines to the line number of last word in this line
                    var count = 0;
                    for (var k = formText.length - 1; k >= 0; k--) {
                        var line = formText[k];
                        if (line.length === 0)
                            count++;
                        else {
                            var lastWord = line[line.length - 1];
                            count += lastWord.lY;
                            break;
                        }

                    }

                    return count;
                };

                //Determines if the user tries to link annotations at the moment
                $scope.linking = function () {
                    return linkStart !== undefined && linkStart !== null;
                };

                //Checks if none of the annotated words of the formatted
                //words is annotated more than the threshold
                $scope.maxAnnotated = function (formAnno, thresh) {
                    if (formAnno === undefined)
                        return false;
                    for (var i = 0; i < formAnno.annotationBoxes.length; i++) {
                        var annoBox = formAnno.annotationBoxes[i];
                        for (var j = 0; j < annoBox.formWords.length; j++) {
                            var formWord = annoBox.formWords[j];
                            if (formWord.maxAnnotations > thresh) {
                                return false;
                            }
                        }
                    }

                    return true;
                };

                $scope.maxAnnotationInLine = function (words) {
                    var max = 0;
                    var line = words[0].lY;
                    var maxi = [];
                    for (var i = 0; i < words.length; i++) {
                        var word = words[i];
                        if (line < word.lY) {
                            maxi.push(max);
                            max = word.maxAnnotations;
                            line = word.lY;
                        } else if (word.maxAnnotations > max)
                            max = word.maxAnnotations;
                    }

                    maxi.push(max);
                    return maxi;
                };

                $scope.isVisible = function (formAnnotation, minLine, maxLine) {
                    if (minLine !== undefined && maxLine !== undefined) {
                        const min = formAnnotation.startLine();
                        const max = formAnnotation.endLine();
                        return (max >= minLine && min <= maxLine);
                    }
                    return true;
                };
            }
        };
    }
]);

