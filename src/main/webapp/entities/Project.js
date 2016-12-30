/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
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