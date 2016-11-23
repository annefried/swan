/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Project {
    id: number;
    name: string;
    scheme: Scheme;
    users: Array<User>;
    documents: Array<Document>;
    projectManager: Array<User>;
    watchingUsers: Array<User>;

    constructor(id: number, name: string, scheme: Scheme, users: Array<User>, documents: Array<Document>, projectManager?: Array<User>,
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
