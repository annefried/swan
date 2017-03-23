/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class SpanType {
    id: number;
    name: string;  
    selectableLabels: { [id: number]: LabelSet } = {};

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public addSelectableLabel(labelSet: LabelSet) {
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };

}
