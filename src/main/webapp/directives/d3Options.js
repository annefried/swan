'use strict';
//Responsible directive for drawing the options field
angular.module('app')
        .directive('d3Options', ['$rootScope', 'd3', 'hotkeys', '$window', function ($rootScope, d3, hotkeys, $window) {
                return {
                    restrict: 'EA',
                    scope: {
                        data: "=",
                        selection: "=",
                        labels: "=",
                        targetTypes: "=",
                        tempAnno: "=",
                        setSelection: "&",
                        setLabel: "&",
                        removeAnnotation: "&",
                        removeTarget: "&",
                        removeLink: "&",
                        setType: "&",
                        setTypeAndAdd: "&",
                        setAnnotationNotSure: "&"
                    },
                    link: function ($scope, iElement) {

                        var width;
                        var options = d3.select(iElement[0])
                                .attr("width", "100%");
                        $scope.isAnnotator = ($window.sessionStorage.isAnnotator === "true");

                        //Re-render on window resize
                        window.onresize = function () {
                            return $scope.$apply();
                        };

                        $scope.$watch(function () {
                            return angular.element(window)[0].innerWidth;
                        }, function () {
                            return $scope.render();
                        });

                        //Watch for data changes and re-render
                        $scope.$watch('selection', function () {
                            return $scope.render();
                        }, true);

                        //Main rendering function. Generates all necessary options
                        //depending on the currently selected object
                        $scope.render = function () {
                            options.selectAll("*").remove();

                            var ele = d3.select(iElement[0].offsetParent)[0][0];
                            if (ele !== null)
                                width = ele.offsetWidth;

                            //Window is split in three columns
                            var left = options.append("div")
                                    .classed("col-md-4", true);
                            var middle = options.append("div")
                                    .classed("col-md-4", true)
                            var right = options.append("div")
                                    .classed("col-md-4", true)

                            // add divs inside middle/right for correct spacing
                            middle = middle.append("div");
                            right = right.append("div");

                            if ($scope.selection !== null && $scope.selection !== undefined) {

                                // add target types if options for annotation
                                if ($scope.selection.type === "Annotation") {
                                    $scope.addTargetTypes(left);
                                }

                                $scope.setNotSureOption(left);

                                left.append("br")
                                //Add delete button
                                left.append("button")
                                        .attr("type", "button")
                                        .classed("btn btn-danger btn-xs", true)
                                        .attr("disabled", function () {
                                            if ($scope.selection === $scope.tempAnno) {
                                                return "true";
                                            }
                                            if (!$scope.isAnnotator) {
                                                return "true";
                                            }
                                        })
                                        .text(function () {
                                            if ($scope.selection.type === "Annotation") {
                                                return "Remove annotation";
                                            }
                                            return "Remove link";
                                        })
                                        .on("click", function () {
                                            $scope.$apply(function () {
                                                $scope.delete();
                                                $scope.setSelection({item: null});
                                            });
                                        });

                                $scope.addLabelSets(middle, right);

                            }
                        };

                        $scope.delete = function () {
                            if ($scope.selection !== null) {
                                switch ($scope.selection.type) {
                                    case "Annotation":
                                        if ($scope.selection.getTargetType() !== undefined) {
                                            $scope.removeAnnotation({item: $scope.selection});
                                        } else {
                                            $scope.selection.resetWords();
                                        }
                                        break;
                                    case "Target":
                                        $scope.removeTarget({item: $scope.selection});
                                        break;
                                    case "Link":
                                        $scope.removeLink({item: $scope.selection});
                                        break;
                                }
                            }
                        };

                        $scope.setTypeHotkeys = function (e) {
                            var a = [];
                            var i = 0;
                            for (var id in $scope.targetTypes) {
                                var type = $scope.targetTypes[id];
                                a[i] = type;
                                i++;
                            }
                            var type = a[e];
                            if (type !== undefined) {
                                $scope.setTypeAndAdd({item: type});
                                $scope.setType({item: type});
                            } else {
                                $scope.index = 0;
                                var type = a[0];
                                $scope.setTypeAndAdd({item: type});
                                $scope.setType({item: type});
                            }
                        };

                        $scope.setLabelHotkeys = function (e) {
                            var a = [];
                            for (var id in $scope.selection.selectableLabels) {
                                var labelSet = $scope.selection.selectableLabels[id];
                                var labels = labelSet.labels;
                                for (var i = 0; i < labels.length; i++) {
                                    a.push(labels[i]);
                                }
                            }
                            var type = a[e];
                            if (type !== undefined) {
                                $scope.setLabel({label: type});
                            } else {
                                $scope.indexLabels = 0;
                                var type = a[0];
                                $scope.setLabel({label: type});
                            }
                        };

                        hotkeys.bindTo($scope)
                                .add({
                                    combo: 'alt+t',
                                    description: 'Select next TargetType',
                                    callback: function () {
                                        $scope.index++;
                                        $scope.setTypeHotkeys($scope.index);
                                    }
                                })
                                .add({
                                    combo: 'alt+l',
                                    description: 'Select next Label',
                                    callback: function () {
                                        $scope.indexLabels++;
                                        $scope.setLabelHotkeys($scope.indexLabels);
                                    }
                                })
                                .add({
                                    combo: 'alt+backspace',
                                    description: 'Deleting current Selection',
                                    callback: function () {
                                        $scope.delete();
                                        $scope.setSelection({item: null});
                                    }
                                });

                        $scope.index = -1;
                        $scope.indexLabels = -1;

                        $scope.addTargetTypes = function (parent) {
                            var newParent = parent.append("div");
                            newParent.classed("targetTypesDiv", true)
                            newParent.append("div")
                                    .text("SPAN TYPE")
                                    .classed("optiontitle", true)
                                    .style("font-size", "120%");
                            var targetTypes = newParent.selectAll()
                                    .data(d3.entries($scope.targetTypes))
                                    .enter()
                                    .append("button")
                                    .attr("id", function (d) {
                                        return "tt_" + d.value.tag;
                                    })
                                    .classed("btn btn-default btn-xs", true)
                                    // TODO: create utility function for the two functions below
                                    .classed("btn-default", function (d) {
                                        var tType = $scope.selection.tType;
                                        if (tType !== undefined && tType === d.value) {
                                            return false;
                                        }
                                        return true;
                                    })
                                    .classed("btn-primary", function (d) {
                                        var tType = $scope.selection.tType;
                                        if (tType !== undefined && tType === d.value) {
                                            return true;
                                        }
                                        return false;
                                    })
                                    .attr("disabled", function () {
                                        if (!$scope.isAnnotator) {
                                            return "true";
                                        }
                                    })
                                    .text(function (d) {
                                        return d.value.tag;
                                    })
                                    .on("click", function (d) {
                                        $scope.$apply(function () {
                                            $scope.setTypeAndAdd({item: d.value});
                                        });
                                    });
                            parent.selectAll("button").each(function () {
                                var br = document.createElement("br");
                                this.parentNode.insertBefore(br, this.nextSibling);
                            });
                        };

                        $scope.addLabelSets = function (parent1, parent2) {

                            var par1Count = 0;
                            var par2Count = 0;
                            for (var id in $scope.selection.selectableLabels) {
                                var labelSet = $scope.selection.selectableLabels[id];
                                var parent;
                                if (par1Count <= par2Count) {
                                    parent = parent1;
                                    par1Count++;
                                } else {
                                    parent = parent2;
                                    par2Count++;
                                }

                                // fix for displaying link label sets as if they are types
                                if ($scope.selection.type === "Link") {
                                    parent.append("p").text("LINK TYPE")
                                            .classed("optiontitle", true)
                                            .style("font-size", "110%");
                                    parent.classed("targetTypesDiv", true);
                                }
                                parent.append("p")
                                        .text(function () {
                                            return labelSet.name;
                                        })
                                        .classed("optiontitle", true)
                                        .style("font-size", "110%");
                                if (!labelSet.exclusive && labelSet.labels.length > 1) {
                                    parent.append("p").text("(multiple allowed)")
                                            .style("margin", "0")
                                            .style("font-size", "90%");
                                } else {
                                    if (labelSet.labels.length > 1) {
                                        parent.append("p").text("(select one)")
                                                .style("margin", "0")
                                                .style("font-size", "90%");
                                    }
                                }

                                var labels = parent.selectAll()
                                        .data(labelSet.labels)
                                        .enter()
                                        .append(function (d, i) {
                                            var label = document.createElement("button");
                                            return label;
                                        })
                                        .classed("btn btn-default btn-xs", true)
                                        .classed("btn-default", function (d) {
                                            if ($scope.selection.isLabeled(labelSet, d)) {
                                                return false;
                                            }
                                            return true;
                                        })
                                        .classed("btn-primary", function (d) {
                                            if ($scope.selection.isLabeled(labelSet, d)) {
                                                return true;
                                            }
                                            return false;
                                        })
                                        .attr("disabled", function () {
                                            if (!$scope.isAnnotator) {
                                                return "true";
                                            }
                                        })
                                        .text(function (d) {
                                            return d.toString(width / 30);
                                        })
                                        .on("click", function (d) {
                                            $scope.$apply(function () {
                                                $scope.setLabel({label: d});
                                            });
                                        });
                                // insert line breaks between the labels
                                parent.selectAll("button").each(function () {
                                    var br = document.createElement("br");
                                    this.parentNode.insertBefore(br, this.nextSibling);
                                });

                            }
                        };

                        $scope.setNotSureOption = function (parent) {
                            if ($scope.selection.type === AnnoType.Annotation) {
                                parent.append("br");
                                parent.append("br");

                                parent.append("input")
                                        .attr("type", "checkbox")
                                        .attr("id", "notSureCheckBox")
                                        .attr("checked", function () {
                                            if ($scope.selection.notSure) {
                                                return 'true';
                                            }
                                        })
                                        .attr("disabled", function () {
                                            var tType = $scope.selection.tType;
                                            if (tType === undefined) {
                                                return "true";
                                            }
                                            if (!$scope.isAnnotator) {
                                                return "true";
                                            }
                                        })
                                        .on("click", function () {
                                            $scope.$apply(function () {
                                                $scope.setAnnotationNotSure({item: $scope.selection});
                                            });
                                        });

                                parent.append("label")
                                        .attr("for", "notSureCheckBox")
                                        .text("not sure")
                                        .classed("checkboxLabel", true)
                                        .classed("checkboxLabelDisabled", function () {
                                            var tType = $scope.selection.tType;
                                            if (tType === undefined) {
                                                return true;
                                            }
                                        });

                            }
                        };
                    }
                };
            }]);

