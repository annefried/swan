/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class User {
    id: number;
    prename: string;
    lastName: string;
    email: string;
    role;   // TODO enum

    constructor(id: number, prename: string, lastName: string, email: string, role) {
        this.id = id;
        this.prename = prename;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

};
