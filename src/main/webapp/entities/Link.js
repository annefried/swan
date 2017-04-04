/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var Link = (function () {
    function Link(id, user, document, annotation1, annotation2, linkLabels) {
        this.id = id;
        this.user = user;
        this.document = document;
        this.annotation1 = annotation1;
        this.annotation2 = annotation2;
        this.linkLabels = linkLabels;
    }
    return Link;
}());
//# sourceMappingURL=Link.js.map