/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class LinkLabel {
    id: number;
    name: string;
    options;
    linkType: LinkType;

    constructor(id: number, name: string, options) {
        this.id = id;
        this.name = name;
        this.options = options;
    }
    
    public setLinkType(linkType: LinkType) {
        this.linkType = linkType;
    }

}
