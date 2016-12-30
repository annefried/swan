/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class State {
    id: number;
    completed: boolean;
    lastEdit: number;
    user: User;

    constructor(id: number, completed: boolean, lastEdit: number, user: User) {
        this.id = id;
        this.completed = completed;
        this.lastEdit = lastEdit;
        this.user = user;
    }

}
