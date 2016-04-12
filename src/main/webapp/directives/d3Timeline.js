/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

/* Responsible directive for drawing the timeline
 * 
 * Noteworthy: Avoid circular dependencies in the node and link objects.
 * There are some watch functions declared which "watch" the objects. The used
 * compare function will evoke a "Maximum call stack size" and "range error" if
 * there are some circular dependencies between nodes. Therefore the array
 * "isTargetOf" belonging to nodes consists only of node ids and not node
 * objects.
 */
angular
    .module('app')
    .directive('d3Timeline', ['d3', function(d3) {
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
                changeLinkLabel: "=",
                lastTargeted: "=",
                setSelection: "&"
            },
            link: function($scope, iElement) {
                
                // Constants
                const MARGIN = {top: -5, right: -5, bottom: -5, left: -5};
                
                // Upper case for comparison
                const BEFORE_STR = "BEFORE";
                const AFTER_STR = "AFTER";
                const OVERLAP_STR = "OVERLAP";
                
                const BEFORE_INT = 0;
                const OVERLAP_INT = 1;
                const AFTER_INT = 2;
                
                const NOT_LINKED = 0;
                
                const EDGE_ROUNDING = 4;
                const BOX_HEIGHT = 20;
                const BOX_HEIGHT_PADDING = BOX_HEIGHT + 25; // Distance between boxes in y dimension
                const BOX_WIDTH_PADDING = 30; // Distance between boxes in x dimension
                
                var node;
                var link;
                var linkText;
                var container;
                var maxTextSize = 20;
                var width = 0;
                var height = 0;
                
                // Set current zoom of graph view
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
                
                $scope.setNodeWidth = function (node) {
                    var labels = node.shortenLabels(maxTextSize / 2);
                    var text = node.toString(maxTextSize);
                    node.width = 9 * (labels.length + text.length + 2);  
                };
                
                /**
                 * Takes the first LinkLabel and returns the corresponding
                 * integer value:
                 * BEFORE_STR -> BEFORE_INT
                 * AFTER_STR -> AFTER_INT
                 * OVERLAP_STR -> OVERLAP_INT
                 * else -> undefined
                 * 
                 * @param {type} link
                 * @returns {Number|undefined}
                 */
                $scope.getLinkLabel = function (link) {
                    for (var id in link.activeLabels) {
                        var label = link.activeLabels[id];
                        if (label.length > 0) {
                            var tag = label[0].tag.toUpperCase();
                            if (tag === BEFORE_STR) {
                                return BEFORE_INT;
                            } else if (tag === AFTER_STR) {
                                return AFTER_INT;
                            } else if (tag === OVERLAP_STR) {
                                return OVERLAP_INT;
                            } else {
                                return undefined;
                            }
                        } else {
                            return undefined;
                        }
                    }
                    return undefined;
                };
				
                $scope.addLabelToLink = function (link) {
                    var label = $scope.getLinkLabel(link);
                    link.label = label;
                };
                
                /**
                 * Returns all links.
                 * 
                 * @returns {Array<Links>} all existing links
                 */
                $scope.getAllLinks = function () {
                    var graphLinks = [];
                    for (var outerID in $scope.annotationLinks) {
                       var outer = $scope.annotationLinks[outerID];
                       
                       for (var innerID in outer) {
                           var link = outer[innerID];
                           $scope.addLabelToLink(link);
                           graphLinks.push({"source":link.source.id,
                                            "target":link.target.id,
                                            "id": link.id});
                       }
                   }
                   return graphLinks;
                };
                
                graph.links = $scope.getAllLinks();
                
                
                /**
                 * Returns all annotations
                 * 
                 * @returns {Array<Annotations>} all existing nodes
                 */
                $scope.getAllNodes = function() {
                    var graphNodes = [];
                    for(var posID in $scope.annotations) {
                        var anno = $scope.annotations[posID];
                        graphNodes.push(anno);
                    }
                    return graphNodes;
                };
                
                graph.nodes = $scope.getAllNodes();
                    
                
                $scope.putNodesInCluster = function (cluster, nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        cluster[node.id] = node;
                    }
                };
                
                /**
                 * Puts all nodes from srcCluster in targetCluster.
                 * 
                 * @param {type} targetCluster
                 * @param {type} srcCluster
                 * @returns {undefined}
                 */
                $scope.mergeClusters = function (targetCluster, srcCluster) {
                    for (var id in srcCluster) {
                        var node = srcCluster[id];
                        targetCluster[id] = node;
                    }
                };
                
                /**
                 * Returns the corresponding cluster of the node from the
                 * clusterList.
                 * 
                 * @param {type} clusterList
                 * @param {type} node
                 * @returns {undefined|cluster}
                 */
                $scope.nodeContainedInClusterList = function (clusterList, node) {
                    for (var i = 0; i < clusterList.length; i++) {
                        var cluster = clusterList[i];
                        if (cluster[node.id] !== undefined) {
                            return cluster;
                        }
                    }
                    
                    return undefined;
                };
                
                /**
                 * Removes a given cluster from the clusterList.
                 * 
                 * @param {type} clusterList
                 * @param {type} cluster
                 * @returns {undefined}
                 */
                $scope.removeClusterFromClusterList = function (clusterList, cluster) {
                    var index = clusterList.indexOf(cluster);
                    if (index > -1) {
                        clusterList.splice(index, 1);
                    }
                };
                
                /**
                 * Adds the reversed structure to nodes, which node is visited by
                 * some nodes. This makes it easier later.
                 * 
                 * @param {type} targetNode
                 * @param {type} node
                 * @returns {undefined}
                 */
                $scope.addNodeStructure = function (targetNode, node) {
                    if (node !== undefined) {
                        targetNode.isTargetOf.push(node.id);
                    }
                };
				
                $scope.initializeIsTargetOfProp = function (targetNode) {
                        targetNode.isTargetOf = [];
                };
                
                /**
                 * Returns a list of nodes which were visited.
                 * 
                 * @param {type} targetCluster
                 * @param {type} node
                 * @returns {$scope@arr;annotationLinks}
                 */
                $scope.visit = function (clusterList, targetCluster, node) {
//                    console.log("$scope.visit");
                    
                    var links = $scope.annotationLinks[node.id];
                    var visitedNodes = [];
                    
                    if (links !== undefined) {
                        for (var linkId in links) {
                            var link = links[linkId];
                            var targetNode = link.target;
                            
                            $scope.addNodeStructure(targetNode, node);
                            
                            if (targetCluster[targetNode.id] === undefined) {
                                var cluster = $scope.nodeContainedInClusterList(clusterList, targetNode);
                                if (cluster !== undefined) {
                                    $scope.mergeClusters(targetCluster, cluster);
                                    $scope.removeClusterFromClusterList(clusterList, cluster);
                                }
                                targetCluster[targetNode.id] = targetNode;
                                
                                var nodeList = $scope.visit(clusterList, targetCluster, targetNode);
                                
                                visitedNodes.push(targetNode);
                                visitedNodes.concat(nodeList);
                            }
                            
                        }
                        
                        return visitedNodes;
                    } else {
                        return [];
                    }
                    
                };
                
                /**
                 * TODO single nodes have an own cluster
                 * 
                 * Cluster the graph into subgraphs, so all nodes which have a
                 * link contain in one cluster.
                 * 
                 * @returns {Array}
                 */
                $scope.clustering = function () {
                    var clusterList = [];
                    
                    // TODO find better solution
                    // problem is that the property isTargetOf remains if one
                    // link or node is deleted. One solution could be to realize
                    // it with the watch functions but it has also linear rumtime
                    // but the chance is higher to find the desired node before
                    // iterating over all nodes but we don't expect too many nodes
                    graph.nodes.forEach(function(node) {
                        $scope.initializeIsTargetOfProp(node);
                        $scope.setNodeWidth(node);
                    });
					
                    graph.nodes.forEach(function (node) {
                        
                        var targetCluster;
                        for (var i = 0; i < clusterList.length; i++) {
                            var cluster = clusterList[i];
                            if (cluster[node.id] !== undefined) {
                                targetCluster = cluster;
                            }
                        }
                        
                        if (targetCluster === undefined) {
                            targetCluster = {};
                            targetCluster[node.id] = node;
                            
                            var visitedNodes = $scope.visit(clusterList, targetCluster, node);
                            
                            $scope.putNodesInCluster(targetCluster, visitedNodes);
                            clusterList.push(targetCluster);
                        } else {
                            // Do nothing
                        }
                        
                    });
                    
                    return clusterList;
                };
                
                /**
                 * Merges all clusters, which only contain 1 element. Clusters
                 * containing only 1 node are not linked to other nodes and can
                 * be therefore put in one cluster.
                 * 
                 * @param {type} clusterList
                 * @returns {undefined}
                 */
                $scope.checkSingleNodes = function (clusterList) {
                    
                    var newCluster = {};
                    
                    for (var i = 0; i < clusterList.length; i++) {
                        var cluster = clusterList[i];
                        var count = Object.keys(cluster).length;
                        if (count === 1) {
                            $scope.mergeClusters(newCluster, cluster);
                            $scope.removeClusterFromClusterList(clusterList, cluster);
                            i--;
                        }
                    }
                    
                    return newCluster;
                };
                
                $scope.visitInner = function (tarNode, isTarget, label, currPos, visitedMap) {
//                    console.log("$scope.visitInner");

                    if (visitedMap[tarNode.id] === undefined) {
                        visitedMap[tarNode.id] = tarNode;

                        if (label === BEFORE_INT) {
                            if (isTarget) {
                                tarNode.bucketPos = ++currPos;
                            } else {
                                tarNode.bucketPos = --currPos;
                            }
                        } else if (label === AFTER_INT) {
                            if (isTarget) {
                                tarNode.bucketPos = --currPos;
                            } else {
                                tarNode.bucketPos = ++currPos;
                            }
                        } else if (label === OVERLAP_INT) {
                            tarNode.bucketPos = currPos;
                        } else {
                            tarNode.bucketPos = currPos; // TODO evaluate
                        }

                        $scope.visitC(tarNode, currPos, visitedMap);
                    }
                };
                
                $scope.visitC = function (node, currPos, visitedMap) {
//                    console.log("$scope.visitC");
                    
                    var outGoingLinks = $scope.annotationLinks[node.id];
                    
                    if (outGoingLinks !== undefined) {
                        for (var linkId in outGoingLinks) {
                            var link = outGoingLinks[linkId];
                            var tarNode = link.target;
                            if (visitedMap[tarNode.id] === undefined) {
                                $scope.visitInner(tarNode, true, link.label, currPos, visitedMap);
                            }
                        }
                    }
                    
                    for (var i = 0; i < node.isTargetOf.length; i++) {
                        var srcNodeId = node.isTargetOf[i];
						var srcNode = nodeById.get(srcNodeId);
                        if (visitedMap[srcNode.id] === undefined) {
							var link = $scope.annotationLinks[srcNode.id][node.id];
                            $scope.visitInner(srcNode, false, link.label, currPos, visitedMap);
                        }
                    }
                    
                };
                
                /**
                 * Calculate the min, max and total value of all pos values of
                 * the nodes contained in the cluster. The total value is the
                 * absolute value of min and max aggregated.
                 * 
                 * @param {type} cluster
                 * @returns {stat}
                 */
                $scope.calcClusterStat = function (cluster) {
                    
                    var max = 0;
                    var min = 0;
                    
                    for (var nodeId in cluster) {
                        var node = cluster[nodeId];
                        var pos = node.bucketPos;
                        
                        if (pos < 0) {
                            min = Math.min(min, pos);
                        } else if (pos > 0) {
                            max = Math.max(max, pos);
                        }
                    }
                    
                    var total = Math.abs(min) + max;
                    var stat = {"min": min,
                                "max": max,
                                "total": total};
                    cluster.stat = stat;
                    
                    return stat;
                };
                
                $scope.processOffsets = function (clusterList) {
                    
                    var maxOfAll = 0;
                    
                    for (var i = 0; i < clusterList.length; i++) {
                        
                        var curr = 0;
                        var visitedMap = {};
                        var cluster = clusterList[i];
                        
                        if (cluster.length < 1) {
                            throw "Cluster length was not expected to be < 1";
                        }
                        
                        var nodeId = Object.keys(cluster)[0];
                        var node = cluster[nodeId];
                        node.bucketPos = curr;
                        $scope.visitC(node, curr, visitedMap);
                        
                        var stat = $scope.calcClusterStat(cluster);
                        maxOfAll = Math.max(maxOfAll, stat.total);
                    }
                    
                    return maxOfAll;
                };
                
                $scope.initArray = function (size, defaultVal) {
                    var arr = [];
                    for (var i = 0; i < size; i++) {
                        arr[i] = defaultVal;
                    }
                    return arr;
                };
                
                $scope.calcWidthOffset = function (clusterMaxLinkLength, singleNodeBucket, clusterList) {
                    var offsetMap = $scope.initArray(clusterMaxLinkLength + 2, 0);
                    var maxWidth = 0;
                    
                    // Process SingleNodeBucket
                    for (var nodeId in singleNodeBucket) {
                        var node = singleNodeBucket[nodeId];
                        maxWidth = Math.max(maxWidth, node.width);
                    }
                    offsetMap[0] = maxWidth;
                    
                    for (var i = 0; i < clusterList.length; i++) {
                        var cluster = clusterList[i];
                        var absMin = Math.abs(cluster.stat.min); // absolute value of the min pos
                        
                        for (var nodeId in cluster) {
                            var node = cluster[nodeId];
                            if (nodeId !== "stat") {
                                var x = node.bucketPos + absMin + 1;
                                offsetMap[x] = Math.max(offsetMap[x], node.width);
                            }
                        }
                        
                    }
                    
                    // Accumulate the offsets
                    var prevWidth1 = 0;
                    var prevWidth2 = 0;
                    for (var i = 1; i < offsetMap.length; i++) {
                        prevWidth2 = offsetMap[i];
                        offsetMap[i] = offsetMap[i - 1] + prevWidth1 + i * BOX_WIDTH_PADDING;
                        prevWidth1 = prevWidth2;
                    }
                    
                    return offsetMap;
                };
                     
                $scope.calcNodePosition = function () {
//                    console.log("d3Timeline calcNodePosition");
                    
                    var clusterList = $scope.clustering();
                    var singleNodeBucket = $scope.checkSingleNodes(clusterList);
                    var clusterMaxLinkLength = $scope.processOffsets(clusterList);
                    var offsetMapX = $scope.calcWidthOffset(clusterMaxLinkLength, singleNodeBucket, clusterList);
                    
                    var y = 0;
                    // Set at first the coordinates of all nodes which have no links
                    for (var nodeId in singleNodeBucket) {
                        var node = singleNodeBucket[nodeId];
                        node.x = 0;
                        node.y = y * BOX_HEIGHT_PADDING;
                        y++;
                    }
                    y = 0;
                    
                    
                    // Then set the properties of all nodes with links
                    for (var i = 0; i < clusterList.length; i++) {
                        var cluster = clusterList[i];
                        var absMin = Math.abs(cluster.stat.min); // absolute value of the min pos
                        var offsetMapY = $scope.initArray(clusterMaxLinkLength + 1, y);
                        var maxY = 0;
                        
                        for (var nodeId in cluster) {
                            var node = cluster[nodeId];
                            if (nodeId !== "stat") {
                                var x = node.bucketPos + absMin + 1;
                                node.x = offsetMapX[x];
                                node.y = offsetMapY[x - 1] * BOX_HEIGHT_PADDING;

                                offsetMapY[x - 1] = offsetMapY[x - 1] + 1;
                                maxY = Math.max(maxY, offsetMapY[x - 1]);
                            }
                        }
                        
                        y = maxY;
                    }
                    
                };
                
                var rendered = false;
                // Re-render when graph is changed
                $scope.$watch(
                    // This function returns the value being watched. It is called for each turn of the $digest loop
                    function() { return graph; },
                    // This is the change listener, called when the value returned from the above function changes
                    function(newVals) {
                        if (newVals !== undefined && !rendered) {
                            $scope.render(true);
                            rendered = true;
                        }
                }, false);
                
                // Set linking by id
                var nodeById = d3.map();
                graph.nodes.forEach(function(node) {
                    nodeById.set(node.id, node);
                });
//				$scope.render(true);

                graph.links.forEach(function(link) {
                    link.source = nodeById.get(link.source);
                    link.target = nodeById.get(link.target);
                });


                // Listens to changes to the currently active annotation
                // and highlights it
                $scope.$watch("selection", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        $scope.updateNodes();
                        if (newVals.activeLabels !== undefined) {
//                            $scope.render(false);
                        }
                    }
                    
//                    $scope.updateLinkTexts();
                    $scope.connectedNodes(newVals);
                }, true);
                
                // Listens to changes to the last added annotation
                $scope.$watch("addedAnnotation", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        $scope.addGraphNode(newVals);
                        $scope.render(false);
                    }
                });
                
                // Listens to changes to the last removed annotation
                $scope.$watch("removedAnnotation", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        $scope.removeGraphNode(newVals);
                        $scope.removeGraphLinks(newVals);
                        $scope.render(false);
                    }
                });
                
                // Listens to changes to the last object whose target type has been set
                $scope.$watch("lastTargeted", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        $scope.removeGraphLinks(newVals);
                        $scope.render(false);
                    }
                });
                
                // Listens to changes to the last added link
                $scope.$watch("addedLink", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        graph.links.push(newVals);
                        $scope.addLabelToLink(newVals);
                        $scope.render(false);
                    }
                });
                
                // Listens to changes to the last removed link
                $scope.$watch("removedLink", function(newVals) {
                    if(newVals !== undefined && newVals !== null) {
                        if($scope.removeGraphLink(newVals)) {
                            $scope.render(false);
                        }
                    }
                });
                
                /**
                 * Listens to changes LinkLabels change
                 * 
                 * Object contains link, label. Therefore watch will be fired
                 * if one label is changed of the same link. Otherwise the
                 * function would be just called once.
                 */
                $scope.$watch("changeLinkLabel", function(object) {
                    if(object !== undefined
                            && object !== null) {
                        var link = object.link;
                        var label = $scope.getLinkLabel(link);
                        link.label = label;
                        $scope.render(false);
                    }
                });
                
                
                var svg = d3.select(iElement[0])
                    .append("svg");
                
                // Main rendering function for the graph
                $scope.render = function(resize) {
                    svg.selectAll("*").remove();
                    
                    if (resize) {
                        width = d3.select(iElement[0])[0][0].offsetWidth * 2.2;
                        height = d3.select(iElement[0])[0][0].offsetHeight * 25;
                    }
                    
                    $scope.renderSVG(MARGIN, resize);
                    $scope.renderGraph();
                };
                
                // Render links and nodes of the graph
                $scope.renderGraph = function() {
                    $scope.renderNodes();
                    $scope.renderLinks();
                    $scope.setGraphBehaviour();
                };
                
                // Render the background of the graph as well as zoom
                $scope.renderSVG = function(margin, resize) {
                    if (resize) {
                        svg = svg.attr("width", "100%")
                            .attr("height", height + margin.top + margin.bottom)
                            .call(zoom)
                            .append("svg:g");
                    } else {
                        svg = svg.attr("width", "100%")
                            .attr("height", height + margin.top + margin.bottom)
                            .append("svg:g"); 
                    }
                    
                    container = svg.append("g");
                    container.attr("transform", "translate(" + zoomTranslate + ")scale(" + zoomScale + ")"); 
                };
                
                $scope.renderNodes = function() {
                    
                    $scope.calcNodePosition();
                    node = container.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("g")
                        .attr("class", "node");

                    node.append("rect")
                        .attr("width", function(d) { // d is an annotation
                            return d.width;
                        })
                        .attr("opacity", 0.7)
                        .attr("height", BOX_HEIGHT)
                        .attr("rx", EDGE_ROUNDING)
                        .attr("ry", EDGE_ROUNDING)
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function (d) {
                            return d.y;
                        })
                        .style("fill", function (d) {
                            return d.color.fill();
                        })
                        .attr("stroke", function(d) {
                            return d.color.back;
                        });

                    node.append("text")
                        .attr("x", function(d) {
                            return d.x;
                        })
                        .attr("y", function (d) {
                            return d.y;
                        })
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
                
                $scope.renderLinks = function() {
    
                    link = container.append("g")
                        .attr("class", "links")
                        .selectAll(".link")
                        .data(graph.links) // TODO
                        .enter().append("line")
                        .attr("class", "link arrow")
                        .style("stroke-width", 2)
                        .attr("x1", function(d) {
                            return d.source.x;
                        })
                        .attr("y1", function(d) {
                            return d.source.y + BOX_HEIGHT / 2;
                        })
                        .attr("x2", function(d) {
                            return d.target.x;
                        })
                        .attr("y2", function(d) {
                            return d.target.y + BOX_HEIGHT / 2;
                        })
                        .attr("marker-end", "url(#arrow)");
                
                    linkText = container.selectAll("linkTexts")
                        .data(graph.links)
                        .enter()
                        .append("text")
                        .classed("linkText", true)
                        .attr("x", function(d) {
                            return (d.target.x + d.source.x) / 2;
                        })
                        .attr("y", function(d) {
                            return (d.target.y + d.source.y) / 2 + BOX_HEIGHT / 2;
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
                
                // Update node appearance depending on current node information
                $scope.updateNodes = function() {
                    node.select("rect")
                        .style("fill", function (d) {
                            return d.color.fill();
                        })
                        .attr("stroke", function(d) {
                            return d.color.back;
                        });  
                        
                    $scope.updateNodeTexts();
                };
                
                // Update node text appearance depending on current node information
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
                
                // Update link text appearance depending on current link information
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

                // Sets behaviour for positioning of nodes and links on the screen
                $scope.setGraphBehaviour = function() {

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

                /**
                 * Checks if two objects are linked
                 * 
                 * @param {type} nodeA Node A
                 * @param {type} nodeB Node B
                 * @returns {Number} 0 - not defined/ linked
                 *                   1 - nodeA shows to nodeB
                 *                   2 - nodeB shows to nodeA
                 *                   3 - linked to itself
                 */
                $scope.areLinked = function (nodeA, nodeB) {
                    if (nodeA === undefined || nodeB === undefined)
                        return NOT_LINKED;
                    if (nodeA === nodeB)
                        return 3;

                    var nodeAToNodeB = $scope.annotationLinks[nodeA.id] !== undefined &&
                                $scope.annotationLinks[nodeA.id][nodeB.id] !== undefined;
                    var nodeBToNodeA = $scope.annotationLinks[nodeB.id] !== undefined &&
                                $scope.annotationLinks[nodeB.id][nodeA.id] !== undefined;

                    if (nodeAToNodeB && nodeBToNodeA)
                        return 3;
                    if (nodeAToNodeB)
                        return 1;
                    if (nodeBToNodeA)
                        return 2;

                    return NOT_LINKED;
                };

                // Checks if an annotation is part of a link
                $scope.partOfLink = function (annotation, link) {
                    if (link.source.id === annotation.id)
                        return 1;
                    if (link.target.id === annotation.id)
                        return 2;

                    return 0;
                };

                // Determines which nodes are connected to the committed node
                // and changes the opacity of all nodes respectively
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
                                case NOT_LINKED:
                                    return 0.1;
                                case 3:
                                    return 1.0;
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

                // Check if two nodes have an undirected relation
                $scope.neighboring = function (a, b) {
                    return $scope.areLinked(a, b) > NOT_LINKED;
                };

                // Add new node to graph
                $scope.addGraphNode = function (node) {
                    graph.nodes.push(node);
                    nodeById.set(node.id, node);
                };

                // Remove node from graph
                $scope.removeGraphNode = function (node) {
                    for (var i = 0; i < graph.nodes.length; i++) {
                        var graphNode = graph.nodes[i];

                        if (graphNode.id === node.id) {
                            graph.nodes.splice(i, 1);
                            nodeById.remove(node.id);
                            return true;
                        }
                    }
                };

                // Remove a link from the graph
                $scope.removeGraphLink = function (link) {
                    if (link === undefined) {
                        return false;
                    }

                    for (var i = 0; i < graph.links.length; i++) {
                        var tmpLink = graph.links[i];

                        if (tmpLink.source === link.source
                                && tmpLink.target === link.target) {
                            graph.links.splice(i, 1);
                            return true;
                        }
                    }
                };

                // Remove all links from the graph that are connected to a specific
                // annotation
                $scope.removeGraphLinks = function (annotation) {
                    if (annotation === undefined) {
                        return false;
                    }

                    var length = graph.links.length - 1;
                    for (var i = length; i >= 0; i--) {
                        var tmpLink = graph.links[i];

                        if (tmpLink.source.id === annotation.id
                                || tmpLink.target.id === annotation.id) {
                            graph.links.splice(i, 1);
                        }
                    }
                };
                
//                $scope.render(true);
            }
            
        };
    }]);



