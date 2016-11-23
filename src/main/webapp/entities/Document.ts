/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
