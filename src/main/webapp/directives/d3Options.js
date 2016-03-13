'use strict';
//Responsible directive for drawing the options field
angular.module('app')
        .directive('d3Options', ['$rootScope', 'd3', 'hotkeys', function ($rootScope, d3, hotkeys) {
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

                        //Re-render on window resize
                        window.onresize = function () {
                            return $scope.$apply();
                        };

                        $scope.$watch(function () {
                            return angular.element(window)[0].innerWidth;
                        }, function () {
                            return $scope.render();
                        }
                        );

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
                                    .classed("col-md-4", true);
                            var right = options.append("div")
                                    .classed("col-md-4", true);

                            if ($scope.selection !== null && $scope.selection !== undefined) {

                                if ($scope.selection.type === "Annotation")
                                    $scope.addTargetTypes(left);

                                $scope.setNotSureOption(left);
                                //Add right title
                                left.append("p")
                                        .text("Actions")
                                        .classed("optiontitle", "true")
                                        .style("text-decoration", "underline")
                                        .attr("font-size", "140%");
                                //Add delete button
                                left.append("button")
                                        .attr("type", "button")
                                        .classed("btn btn-warning btn-sm", true)
                                        .attr("disabled", function () {
                                            if ($scope.selection === $scope.tempAnno)
                                                return "true";
                                        })
                                        .text("Delete")
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
                            parent.append("div")
                                    .text("TargetTypes")
                                    .classed("optiontitle", "true")
                                    .style("text-decoration", "underline")
                                    .attr("font-size", "140%");
                            var targetTypes = parent.selectAll("TargetTypes")
                                    .data(d3.entries($scope.targetTypes))
                                    .enter()
                                    .append("label")
                                    .classed("radio", true)
                                    .text(function (d) {
                                        return d.value.tag;
                                    });
                            //Add checkboxes to target types
                            targetTypes.append("input")
                                    .attr("checked", function (d) {
                                        var tType = $scope.selection.tType;
                                        if (tType !== undefined && tType === d.value)
                                            return "true";
                                    })
                                    .attr("type", "radio")
                                    .on("click", function (d) {
                                        $scope.$apply(function () {
                                            $scope.setTypeAndAdd({item: d.value});
                                        });
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

                                parent.append("p")
                                        .text(function () {
                                            return labelSet.name;
                                        })
                                        .classed("optiontitle", "true")
                                        .style("text-decoration", "underline")
                                        .attr("font-size", "140%");
                                var labels = parent.selectAll("Labels")
                                        .data(labelSet.labels)
                                        .enter()
                                        .append(function (d, i) {
                                            if (i > 0) {
                                                var br = document.createElement("br");
                                                iElement[0].appendChild(br);
                                            }

                                            var label = document.createElement("label");
                                            return label;
                                        })
                                        .classed("checkbox", true)
                                        .classed("radio", true)
                                        .text(function (d) {
                                            return d.toString(width / 50);
                                        });
                                //Add checkboxes to labels
                                labels.append("input")
                                        .attr("checked", function (d) {
                                            if ($scope.selection.isLabeled(labelSet, d))
                                                return "true";
                                        })
                                        .attr("disabled", function () {
                                            if ($scope.selection.type === "Annotation" && $scope.selection.tType === undefined)
                                                return "true";
                                        })
                                        .attr("type", function (d) {
                                            if (labelSet.exclusive)
                                                return "radio";
                                            return "checkbox";
                                        })
                                        .on("click", function (d) {
                                            $scope.$apply(function () {
                                                $scope.setLabel({label: d});
                                            });
                                        });
                            }
                        };

                        $scope.setNotSureOption = function (parent) {
                            if ($scope.selection.type === AnnoType.Annotation) {
                                parent.append("div")
                                        .text("Not Sure")
                                        .classed("optiontitle", "true")
                                        .style("text-decoration", "underline")
                                        .attr("font-size", "140%");
                                var checkbox = parent.append("label")
                                        .classed("checkbox-inline", true);
                                checkbox.append("input")
                                        .attr("type", "checkbox")
                                        .text("Not sure")
                                        .attr("checked", function () {
                                            if ($scope.selection.notSure) {
                                                return 'true';
                                            }
                                        })
                                        .on("click", function () {
                                            $scope.$apply(function () {
                                                $scope.setAnnotationNotSure({item: $scope.selection});
                                            });
                                        });
                            }
                        };
                    }
                };
            }]);

