'use strict';

angular.module('d3Module', []).factory('d3', [
  function(){

    var d3;
    d3 = window.d3;

    // returning our service so it can be used
    return d3;
}]);