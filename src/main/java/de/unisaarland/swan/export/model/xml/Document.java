/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Timo Guehring
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder={ "name", "user", "annotations", "links" })
public class Document {

	private String name;

	private Users user;

    private AnnotationSet annotations;

    private LinkType links;

    public String getName() {return name; }

	public void setName(String name) { this.name = name; }

	public Users getUser() { return user; }

	public void setUser(Users user) { this.user = user; }

    public AnnotationSet getAnnotations() {
        return annotations;
    }

    public void setAnnotations(AnnotationSet annotations) {
        this.annotations = annotations;
    }

    public LinkType getLinks() {
        return links;
    }

    public void setLinks(LinkType links) {
        this.links = links;
    }

}
