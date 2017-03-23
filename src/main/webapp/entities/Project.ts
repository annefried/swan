/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class Project {
    id: number;
    name: string;
    scheme: Scheme;
    users: Array<User>;
    documents: Array<DocumentEntity>;
    projectManager: Array<User>;
    watchingUsers: Array<User>;

    constructor(id: number, name: string, scheme: Scheme, users: Array<User>, documents: Array<DocumentEntity>, projectManager?: Array<User>,
                    watchingUsers?: Array<User>) {

        this.id = id;
        this.name = name;
        this.scheme = scheme;
        this.users = users;
        this.documents = documents;
        this.projectManager = projectManager;
        this.watchingUsers = watchingUsers;
    }

};
