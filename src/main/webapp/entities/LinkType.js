/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var LinkType = (function () {
    function LinkType(id, name, startSpanType, endSpanType, linkLabels) {
        this.id = id;
        this.name = name;
        this.startSpanType = startSpanType;
        this.endSpanType = endSpanType;
        this.linkLabels = linkLabels;
        for (var i = 0; i < this.linkLabels.length; i++) {
            this.linkLabels[i].setLinkType(this);
        }
    }
    return LinkType;
}());
//# sourceMappingURL=LinkType.js.map