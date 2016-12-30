/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

angular
    .module('d3Module', [])
    .factory('d3', [function () {

        var d3;
        d3 = window.d3;

        // returning our service so it can be used
        return d3;
    }
]);
