/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var Project = (function () {
    function Project(id, name, scheme, users, documents, projectManager, watchingUsers) {
        this.id = id;
        this.name = name;
        this.scheme = scheme;
        this.users = users;
        this.documents = documents;
        this.projectManager = projectManager;
        this.watchingUsers = watchingUsers;
    }
    return Project;
}());
;
//# sourceMappingURL=Project.js.map