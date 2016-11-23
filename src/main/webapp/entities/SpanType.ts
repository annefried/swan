/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class SpanType {
    id: number;
    tag: string;    // TODO change to name
    selectableLabels = {};

    constructor(id: number, name: string) {
        this.id = id;
        this.tag = name;
    }

    public addSelectableLabel(labelSet) {   // TODO typing
        if (labelSet !== undefined)
            this.selectableLabels[labelSet.id] = labelSet;
    };

}
