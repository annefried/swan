/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class Scheme {
    id: number;
    name: string;
    visElements: Array<VisElement>;
    spanTypes: Array<SpanType>;
    labelSets: Array<LabelSet>;
    linkTypes: Array<LinkType>;

    constructor(id: number, name: string, visElements: Array<VisElement>, spanTypes: Array<SpanType>, labelSets: Array<LabelSet>, linkTypes: Array<LinkType>) {
        this.id = id;
        this.name = name;
        this.visElements = visElements;
        this.spanTypes = spanTypes;
        this.labelSets = labelSets;
        this.linkTypes = linkTypes;
    }

}
