/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var lab = d3.lab;
var AnnotationEntity = (function () {
    function AnnotationEntity(id, spanType, labels, start, end, text, notSure) {
        if (notSure === void 0) { notSure = false; }
        this.id = id;
        this.spanType = spanType;
        this.labels = labels;
        this.start = start;
        this.end = end;
        this.text = text;
        this.notSure = notSure;
    }
    return AnnotationEntity;
}());
//# sourceMappingURL=AnnotationEntity.js.map