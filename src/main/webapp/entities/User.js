/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';
var User = (function () {
    function User(id, prename, lastName, email, role) {
        this.id = id;
        this.prename = prename;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }
    return User;
}());
;
//# sourceMappingURL=User.js.map