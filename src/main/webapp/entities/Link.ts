/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Link {
    id: number;
    user: User;
    document: DocumentEntity;
    annotation1: AnnotationEntity;
    annotation2: AnnotationEntity;
    linkLabels: Array<LinkLabel>;

    constructor(id: number, user: User, document: DocumentEntity, annotation1: AnnotationEntity, annotation2: AnnotationEntity, linkLabels: Array<LinkLabel>) {
        this.id = id;
        this.user = user;
        this.document = document;
        this.annotation1 = annotation1;
        this.annotation2 = annotation2;
        this.linkLabels = linkLabels;
    }
}
