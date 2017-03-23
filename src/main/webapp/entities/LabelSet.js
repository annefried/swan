/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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
        for (var i = 0; i < this.appliesToSpanTypes.length; i++) {
            this.appliesToSpanTypes[i].addSelectableLabel(this);
        }
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].setLabelSet(this);
        }
    }
    LabelSet.prototype.addLabel = function (label) {
        if (label === undefined)
            throw "LabelSet: label undefined";
        this.labels.push(label);
        label.setLabelSet(this);
    };
    ;
    return LabelSet;
}());
//# sourceMappingURL=LabelSet.js.map