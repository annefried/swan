/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var SpanType = (function () {
    function SpanType(id, name) {
        this.selectableLabels = {};
        this.id = id;
        this.tag = name;
    }
    SpanType.prototype.addSelectableLabel = function (labelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };
    ;
    return SpanType;
}());
//# sourceMappingURL=SpanType.js.map