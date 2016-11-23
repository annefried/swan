/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var LabelSet = (function () {
    function LabelSet(id, name, exclusive, appliesToSpanTypes, labels) {
        if (appliesToSpanTypes === void 0) { appliesToSpanTypes = []; }
        if (labels === void 0) { labels = []; }
        this.id = id;
        this.name = name;
        this.exclusive = exclusive;
        this.appliesToSpanTypes = appliesToSpanTypes;
        this.labels = labels;
    }
    LabelSet.prototype.addLabel = function (label) {
        if (label === undefined)
            throw "LabelSet: label undefined";
        this.labels.push(label);
    };
    ;
    return LabelSet;
}());
//# sourceMappingURL=LabelSet.js.map