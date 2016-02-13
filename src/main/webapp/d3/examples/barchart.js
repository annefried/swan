
var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
    14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
    24, 18, 25, 9, 3 ];

var w = 500;
var h = 100;
var padding = 3;

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var x = function(d, i) {
    return i * (w / dataset.length + padding);
};

var y = function(d) {
    return h - (d * 4);
}

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", w / (dataset.length - padding))
    .attr("height", function(d) {
        return d * 4;
    })
    .attr("fill", function(d) {
        return "rgb(" + (d * 3) +", " + (d * 5) +", " + (d * 10) +")";
    });

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("x", x)
    .attr("y", y);
