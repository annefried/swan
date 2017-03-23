/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
import lab = d3.lab;

class AnnotationEntity {
    id: number;
    spanType: SpanType;
    labels: Array<Label>;
    start: number;
    end: number;
    text: string;
    notSure: boolean;
    
    constructor(id: number, spanType: SpanType, labels: Array<Label>, start: number, end: number, text:string, notSure: boolean = false) {
        this.id = id;
        this.spanType = spanType;
        this.labels = labels;
        this.start = start;
        this.end = end;
        this.text = text;
        this.notSure = notSure;
    }
}
