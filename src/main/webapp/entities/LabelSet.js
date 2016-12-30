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