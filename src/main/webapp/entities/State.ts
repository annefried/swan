/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class State {
    id: number;
    completed: boolean;
    lastEdit: number;
    user: User;

    constructor(id: number, completed: boolean, lastEdit: number, user: User) {
        this.id = id;
        this.completed = completed;
        this.lastEdit = lastEdit;
        this.user = user;
    }

}
