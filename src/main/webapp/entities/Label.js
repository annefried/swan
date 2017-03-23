/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var Label = (function () {
    function Label(id, name) {
        this.id = id;
        this.name = name;
    }
    Label.prototype.setLabelSet = function (labelSet) {
        this.labelSet = labelSet;
    };
    ;
    return Label;
}());
//# sourceMappingURL=Label.js.map