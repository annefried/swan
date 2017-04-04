/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var SpanType = (function () {
    function SpanType(id, name) {
        this.selectableLabels = {};
        this.id = id;
        this.name = name;
    }
    SpanType.prototype.addSelectableLabel = function (labelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };
    ;
    return SpanType;
}());
//# sourceMappingURL=SpanType.js.map