'use strict';

//Responsible directive for drawing the graph
angular.module('app')
    .directive('d3Graph', ['d3', function(d3) {
        return {
            restrict: 'EA',
            scope: {
                annotations: "=",
                annotationLinks: "=",
                selection: "=",
                addedAnnotation: "=",
                removedAnnotation: "=",
                addedLink: "=",
                removedLink: "=",
                lastSet: "=",
                lastTargeted: "=",
                setSelection: "&"
            },
            link: function($scope, iElement) {
                
                var force;
                var node;
                var link;
                var linkText;
                var container;
                var maxTextSize = 20;
                var width = 0;
                var height = 0;
                
                //Set current zoom of graph view
                function zoomed() {    
                    $scope.$apply(function() {
                        zoomTranslate = d3.event.translate;
                        zoomScale = d3.event.scale;
                        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    });
                }
                
                var zoom = d3.behavior.zoom()
                    .scaleExtent([0.2, 2.5])
                    .on("zoom", zoomed);
            
                var zoomTranslate = [0, 0];
                var zoomScale = 1;
                var graph = new AnnotationGraph();
                
                //Add all annotations as nodes to the graph
                $scope.addNodes = function() {
                    for(var posID in $scope.annotations) {
                        var anno = $scope.annotations[posID];
                        graphNodes.push(anno);
                    }
                };
                
                var graphNodes = [];
                $scope.addNodes();
                graph.nodes = graphNodes;
                     
                //Add all annotation links as links to the graph
                $scope.addLinks = function() {
                    for(var outerID in $scope.annotationLinks) {
                       var outer = $scope.annotationLinks[outerID];
                       
                       for(var innerID in outer) {
                           var link = outer[innerID];
                           graphLinks.push({"source":link.source.id, "target":link.target.id, "id": link.id});
                       }
                   }
                };
                
                var graphLinks = [];
                $scope.addLinks();
                graph.links = graphLinks;
                
                var svg = d3.select(iElement[0])
                    .append("svg");
                
                var rendered = false;
                //Re-render when graph is changed
                $scope.$watch(function() {
                    return graph;
                    }, function(newVals) {
                        if(newVals !== undefined && !rendered) {
                            $scope.render(true);
                            rendered = true;
                        }
                }, true);

                //Listens to changes to the currently active annotation
                //and highlights it
                $scope.$watch("selection", function(newVals) {
                    if(newVals !== undefined && newVals !== null)
                        $scope.updateNodes();
                    
                    $scope.updateLinkTexts();
                    $scope.connectedNodes(newVals);
                }, true);
                
                //Listens to changes to the last added annotation
                $scope.$watch("addedAnnotation", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        force.stop();
                        $scope.addGraphNode(newVals);
                        $scope.render(false, true);
                    }
                });
                
                //Listens to changes to the last removed annotation
                $scope.$watch("removedAnnotation", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        force.stop();
                        $scope.removeGraphNode(newVals);
                        $scope.removeGraphLinks(newVals);
                        $scope.render(false);
                    }
                });
                
                //Listens to changes to the last object whose target type has been set
                $scope.$watch("lastTargeted", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        force.stop();
                        $scope.removeGraphLinks(newVals);
                        $scope.render(false);
                        
                    }
                });
                
                //Listens to changes to the last added link
                $scope.$watch("addedLink", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        force.stop();
                        graph.links.push(newVals);
                        $scope.render(false);
                    }
                });
                
                //Listens to changes to the last removed link
                $scope.$watch("removedLink", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        if($scope.removeGraphLink(newVals))
                            $scope.render(false);
                    }
                });
                
                //Set linking by id
                var nodeById = d3.map();
                graph.nodes.forEach(function(node) {
                  nodeById.set(node.id, node);
                });

                graph.links.forEach(function(link) {
                    link.source = nodeById.get(link.source);
                    link.target = nodeById.get(link.target);
                });
                
                //Main rendering function for the graph
                $scope.render = function(resize){
                    svg.selectAll("*").remove();

                    var margin = {top: -5, right: -5, bottom: -5, left: -5};
                    
                    if(resize) {
                        width = d3.select(iElement[0])[0][0].offsetWidth * 2.2;
                        height = d3.select(iElement[0])[0][0].offsetHeight * 25;
                        
                        force = d3.layout.force()
                            .charge(-1000)
                            .linkDistance(110)
                            .size([width + margin.left + margin.right, height + margin.top + margin.bottom]);
                    }
                    
                    $scope.renderSVG(margin, resize);
                    $scope.renderGraph();
                };
                
                //Render links and nodes of the graph
                $scope.renderGraph = function() {
                    $scope.renderLinks(); 
                    $scope.renderNodes();
                    $scope.setGraphBehaviour();
                };
                
                //Render the background of the graph as well as zoom
                $scope.renderSVG = function(margin, resize) {
                    
                    if(resize) {
                        svg = svg.attr("width", "100%")
                            .attr("height", height + margin.top + margin.bottom)
                            .call(zoom)
                            .append("svg:g");
                    }
                    else {
                        svg = svg.attr("width", "100%")
                            .attr("height", height + margin.top + margin.bottom)
                            .append("svg:g"); 
                    }
                    
                    container = svg.append("g");
                    container.attr("transform", "translate(" + zoomTranslate + ")scale(" + zoomScale + ")"); 
                };
                
                $scope.renderLinks = function() {
                    force
                        .nodes(graph.nodes)
                        .links(graph.links)
                        .start();
    
                    link = container.append("g")
                        .attr("class", "links")
                        .selectAll(".link")
                        .data(force.links())
                        .enter().append("line")
                        .attr("class", "link arrow")
                        .style("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)");
                
                    linkText =  container.selectAll("linkTexts")
                        .data(force.links())
                        .enter()
                        .append("text")
                        .classed("linkText", true)
                        .attr("x", function(d) {
                            return (d.target.x + d.source.x) / 2;
                        })
                        .attr("y", function(d) {
                            return (d.target.y + d.source.y) / 2;
                        })
                        .attr("fill", "black")
                        .style("font-weight", "bold")
                        .style("font-size", "90%")
                        .text(function(d) { 
                            var link = $scope.annotationLinks[d.source.id][d.target.id];
                            return link.toString();
                        })
                        .on("click", function(d) {
                            $scope.$apply(function() {
                                $scope.setSelection({item: $scope.annotationLinks[d.source.id][d.target.id]});
                            });
                        });
  
                    svg.append("svg:defs").selectAll("marker")
                        .data(["arrow"])
                        .enter().append("svg:marker")
                        .attr("id", String)
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 60)
                        .attr("refY", 0)
                        .attr("markerWidth", 5)
                        .attr("markerHeight", 5)
                        .attr("orient", "auto")
                        .append("svg:path")
                        .attr("d", "M0,-5L10,0L0,5")
                        .style("opacity", 0.3);
                };
                
                $scope.renderNodes = function() {
                    
                    node = container.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("g")
                        .attr("class", "node");

                    node.append("rect")
                        .attr("width", function(d) {
                            var labels = d.shortenLabels(maxTextSize / 2);
                            var text = d.toString(maxTextSize);
                             d.width = 9 * (labels.length + text.length + 2);
                            return d.width;
                        })
                        .attr("opacity", 0.7)
                        .attr("height", 20)
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("x", function(d) {
                            return - d.width / 2;
                        })
                        .attr("y", -10)
                        .style("fill", function (d) {
                            return d.color.fill;
                        })
                        .attr("stroke", function(d) {
                            return d.color.back;
                        });

                    node.append("text")
                        .attr("x", function(d) {
                            return - d.width / 2;
                        })
                        .attr("y", -10)
                        .attr("dx", 5)
                        .attr("dy", 15)
                        .text(function(d) {
                            var labels = d.shortenLabels(maxTextSize / 2);
                            var text = "'" + d.toString(maxTextSize) + "'";
                            
                            return (labels === "") ? text : labels + " | " + text;
                        })
                        .attr("opacity", 0.7)
                        .style("stroke", "black");
                };
                
                //Update node appearance depending on current node information
                $scope.updateNodes = function() {
                    node.select("rect")
                        .style("fill", function (d) {
                            return d.color.fill;
                        })
                        .attr("stroke", function(d) {
                            return d.color.back;
                        });  
                        
                    $scope.updateNodeTexts();
                };
                
                //Update node text appearance depending on current node information
                $scope.updateNodeTexts = function() {
                    node.select("rect")
                        .attr("width", function(d) {
                            var labels = d.shortenLabels(maxTextSize / 2);
                            var text = d.toString(maxTextSize);
                             d.width = 9 * (labels.length + text.length + 2);
                            return d.width;
                        });
                    
                    node.select("text")
                        .text(function(d) {
                            var labels = d.shortenLabels(maxTextSize / 2);
                            var text = "'" + d.toString(maxTextSize) + "'";
                            
                            return (labels === "") ? text : labels + " | " + text;
                        });
                };
                
                //Update link text appearance depending on current link information
                $scope.updateLinkTexts = function() {
                    svg.selectAll(".linkText")    
                        .attr("x", function(d) {
                            return (d.target.x + d.source.x) / 2 + (width / 90);
                        })
                        .attr("y", function(d) {
                            return (d.target.y + d.source.y) / 2;
                        })
                        .text(function(d) {
                            if($scope.annotationLinks[d.source.id] !== undefined 
                                && $scope.annotationLinks[d.source.id][d.target.id] !== undefined) {
                            
                                var link = $scope.annotationLinks[d.source.id][d.target.id];
                                return link.toString();
                            }
                        });   
                };

                //Sets behaviour for positioning of nodes and links on the screen
                $scope.setGraphBehaviour = function() {
                    force.on("tick", function () {
                        link.attr("x1", function (d) {
                                return isNaN(d.source.x) ? 0 : d.source.x;
                            })
                            .attr("y1", function (d) {
                                return isNaN(d.source.y) ? 0 : d.source.y;
                            })
                            .attr("x2", function (d) {
                                return isNaN(d.target.x) ? 0 : d.target.x;
                            })
                            .attr("y2", function (d) {
                                return isNaN(d.target.y) ? 0 :  d.target.y;
                            });

                        $scope.updateLinkTexts();

                        node.attr("transform", function (d) {
                            var dx = isNaN(d.x) ? 0 : d.x;
                            var dy = isNaN(d.y) ? 0 : d.y;
                            return "translate(" + dx + "," + dy + ")";
                        });
                    });

                    node.on("mouseover", function (d) {
                        node.classed("node-active", function (o) {
                            var thisOpacity = ($scope.neighboring(d, o)) ? true : false;
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });

                        link.classed("link-active", function (o) {
                            return o.source === d || o.target === d;
                        });

                        d3.select(this).classed("node-active", true);
                        d3.select(this).select("rect").transition()
                                .duration(250)
                                .attr("opacity", 0.9);
                            })
                            .on("mouseout", function (d) {
                                node.classed("node-active", false);
                                link.classed("link-active", false);

                                d3.select(this).select("rect").transition()
                                        .duration(250)
                                        .attr("opacity", 0.6);
                            })
                            .on('click', function (d) {
                                $scope.$apply(function () {
                                    $scope.setSelection({item: d});
                                });
                            });

                    link.on('click', function (d) {
                            $scope.$apply(function () {
                                $scope.setSelection({item: $scope.annotationLinks[d.source.id][d.target.id]});
                            });
                        })
                        .on("mouseover", function (d) {
                            link.classed("link-active", function (o) {
                                return o === d;
                            });
                        })
                        .on("mouseout", function (d) {
                            link.classed("link-active", false);
                        });
                };

                //Check if two objects are linked
                $scope.areLinked = function (a, b) {
                    if (a === undefined || b === undefined)
                        return 0;
                    if (a === b)
                        return 3;

                    var ab = ($scope.annotationLinks[a.id] !== undefined) &&
                            ($scope.annotationLinks[a.id][b.id] !== undefined);
                    var ba = ($scope.annotationLinks[b.id] !== undefined) &&
                            ($scope.annotationLinks[b.id][a.id] !== undefined);

                    if (ab && ba)
                        return 3;
                    if (ab)
                        return 1;
                    if (ba)
                        return 2;

                    return 0;
                };

                //Checks if an annotation is part of a link
                $scope.partOfLink = function (annotation, link) {
                    if (link.source.id === annotation.id)
                        return 1;
                    if (link.target.id === annotation.id)
                        return 2;

                    return 0;
                };

                //Determines which nodes are connected to the committed node
                //and changes the opacity of all nodes respectively
                $scope.connectedNodes = function (d) {
                    if (d !== null && d !== undefined) {
                        node.style("opacity", function (o) {
                            var linked = 0;
                            switch (d.type) {
                                case "Target":
                                case "Annotation":
                                    linked = $scope.areLinked(o, d);
                                    break;
                                case "Link":
                                    linked = $scope.partOfLink(o, d);
                                    break;
                            }

                            switch (linked) {
                                case 0:
                                    return 0.1;
                                case 3:
                                    return 1;
                                default:
                                    return 0.7;
                            }
                        });

                        var oma = 0.2;
                        link.style("opacity", function (o) {
                            switch (d.type) {
                                case "Annotation":
                                case "Target":
                                    return d.index === o.source.index
                                            || d.index === o.target.index ? 1 : oma;
                                case "Link":
                                    return d.id === o.id ? 1 : oma;
                            }

                            return oma;
                        });

                        svg.selectAll(".linkText")
                                .attr("opacity", function (o) {
                                    switch (d.type) {
                                        case "Annotation":
                                        case "Target":
                                            return d.index === o.source.index
                                                    || d.index === o.target.index ? 1 : oma;
                                        case "Link":
                                            return d.id === o.id ? 1 : oma;
                                    }

                                    return oma;
                                });
                    } else {
                        node.style("opacity", 1);
                        link.style("opacity", 1);
                        svg.selectAll(".linkText")
                                .attr("opacity", 1);
                    }
                };

                //Check if two nodes have a undirected relation
                $scope.neighboring = function (a, b) {
                    return $scope.areLinked(a, b) > 0;
                };

                //Add new node to graph
                $scope.addGraphNode = function (node) {
                    graphNodes.push(node);
                };

                //Remove node from graph
                $scope.removeGraphNode = function (node) {
                    for (var i = 0; i < graph.nodes.length; i++) {
                        var graphNode = graph.nodes[i];

                        if (graphNode.id === node.id) {
                            graph.nodes.splice(i, 1);
                            return true;
                        }
                    }
                };

                //Remove a link from the graph
                $scope.removeGraphLink = function (link) {
                    if (link === undefined)
                        return false;

                    for (var i = 0; i < graph.links.length; i++) {
                        var graphLink = graph.links[i];

                        if (graphLink.source === link.source && graphLink.target === link.target) {
                            graph.links.splice(i, 1);
                            return true;
                        }
                    }
                };

                //Remove all links from the graph that are connected to an specific
                //annotation
                $scope.removeGraphLinks = function (annotation) {
                    if (annotation === undefined)
                        return false;

                    var length = graph.links.length - 1;
                    for (var i = length; i >= 0; i--) {
                        var graphLink = graph.links[i];

                        if (graphLink.source.id === annotation.id || graphLink.target.id === annotation.id)
                            graph.links.splice(i, 1);
                    }
                };
            }
        };
    }]);

