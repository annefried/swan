/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var Scheme = (function () {
    function Scheme(id, name, visElements, spanTypes, labelSets, linkTypes) {
        this.id = id;
        this.name = name;
        this.visElements = visElements;
        this.spanTypes = spanTypes;
        this.labelSets = labelSets;
        this.linkTypes = linkTypes;
    }
    return Scheme;
}());
//# sourceMappingURL=Scheme.js.map