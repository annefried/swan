/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Line {
    lineLength: number;
    tokens: Array<Token>;
    
    constructor(lineLength: number, tokens: Array<Token>) {
        this.lineLength = lineLength;
        this.tokens = tokens;
    }
}
