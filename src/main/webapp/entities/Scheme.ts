/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Scheme {
    id: number;
    name: string;
    visElements: Array<VisElement>;
    spanTypes: Array<SpanType>;
    labelSets: Array<LabelSet>;
    linkTypes: Array<LinkType>;

    constructor(id: number, name: string, visElements: Array<VisElement>, spanTypes: Array<SpanType>, labelSets: Array<LabelSet>, linkTypes: Array<LinkType>) {
        this.id = id;
        this.name = name;
        this.visElements = visElements;
        this.spanTypes = spanTypes;
        this.labelSets = labelSets;
        this.linkTypes = linkTypes;
    }

}
