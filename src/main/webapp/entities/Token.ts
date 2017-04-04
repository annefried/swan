/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Token {
    start: number;
    end: number;
    text: string;
    
    constructor(start: number, end: number, text: string) {
        this.start = start;
        this.end = end;
        this.text = text;
    }
}
