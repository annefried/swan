/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
'use strict';

class LinkType {
    name: string;
    startSpanType: SpanType;
    endSpanType: SpanType;
    linkLabels: Array<LinkLabel>;

    constructor(name: string, startSpanType: SpanType, endSpanType: SpanType, linkLabels: Array<LinkLabel>) {
        this.name = name;
        this.startSpanType = startSpanType;
        this.endSpanType = endSpanType;
        this.linkLabels = linkLabels;
    }

}
