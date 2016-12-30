/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class Document {
    id: number;
    name: string;
    states: Array<State>;

    constructor(id: number, name: string, states: Array<State>) {
        this.id = id;
        this.name = name;
        this.states = states;
    }

};
