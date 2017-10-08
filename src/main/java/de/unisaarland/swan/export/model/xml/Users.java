/*
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.export.model.xml;

import java.util.Set;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;

/**
 * This is a POJO for the XML export mapping entities to the export model.
 *
 * @author Julia Dembowski
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder={ "prename", "lastname", "email"})
public class Users {

	private String prename;

	private String lastname;

	private String email;

	public String getPrename() { return prename; }

	public void setPrename(String prename) { this.prename = prename; }

	public String getLastname() { return lastname; }

	public void setLastname(String lastname) { this.lastname = lastname; }

	public String getEmail() { return email; }

	public void setEmail(String email) { this.email = email; }
}
