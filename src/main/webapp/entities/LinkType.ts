/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class LinkType {
    name: string;
    startSpanType: SpanType;
    endSpanType: SpanType;
    linkLabels: Array<LinkLabel>;

    constructor(name: string, startSpanType: SpanType, endSpanType: SpanType, linkLabels: Array<LinkLabel>) {
        this.name = name;
        this.startSpanType = startSpanType;
        this.endSpanType = endSpanType;
        this.linkLabels = linkLabels;
    }

}
