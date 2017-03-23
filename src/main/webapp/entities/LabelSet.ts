/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class LabelSet {
    id: number;
    name: string;
    exclusive: boolean;
    appliesToSpanTypes: Array<SpanType>;
    labels: Array<Label>;

    constructor(id: number, name: string, exclusive: boolean, appliesToSpanTypes: Array<SpanType> = [], labels: Array<Label> = []) {
        this.id = id;
        this.name = name;
        this.exclusive = exclusive;
        this.appliesToSpanTypes = appliesToSpanTypes;
        this.labels = labels;

        for (var i = 0; i < this.appliesToSpanTypes.length; i++) {
            this.appliesToSpanTypes[i].addSelectableLabel(this);
        }

        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].setLabelSet(this);
        }
    }

    public addLabel(label: Label) {
        if (label === undefined) throw "LabelSet: label undefined";
        this.labels.push(label);
        label.setLabelSet(this);
    };

}
