/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class User {
    id: number;
    prename: string;
    lastName: string;
    email: string;
    role;   // TODO enum

    constructor(id: number, prename: string, lastName: string, email: string, role) {
        this.id = id;
        this.prename = prename;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

};
