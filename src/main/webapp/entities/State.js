/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var State = (function () {
    function State(id, completed, lastEdit, user) {
        this.id = id;
        this.completed = completed;
        this.lastEdit = lastEdit;
        this.user = user;
    }
    return State;
}());
//# sourceMappingURL=State.js.map