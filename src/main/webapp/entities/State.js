/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var State = (function () {
    function State(id, completed, lastEdit, user) {
        this.id = id;
        this.completed = completed;
        this.lastEdit = lastEdit;
        this.user = user;
    }
    return State;
}());
//# sourceMappingURL=State.js.map