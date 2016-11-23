/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
    }

    public addLabel(label: Label) {
        if (label === undefined) throw "LabelSet: label undefined";
        this.labels.push(label);
    };

}
