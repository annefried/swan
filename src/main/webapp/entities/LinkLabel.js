/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var LinkLabel = (function () {
    function LinkLabel(id, name, options) {
        this.id = id;
        this.name = name;
        this.options = options;
    }
    LinkLabel.prototype.setLinkType = function (linkType) {
        this.linkType = linkType;
    };
    return LinkLabel;
}());
//# sourceMappingURL=LinkLabel.js.map