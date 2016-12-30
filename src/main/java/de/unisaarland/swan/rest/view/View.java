/* 
 * Copyright (C) SWAN (Saar Web-based ANotation system) contributors. All rights reserved.
 * Licensed under the GPLv2 License. See LICENSE in the project root for license information.
 */
package de.unisaarland.swan.rest.view;

/**
 * These are views for the JSON mapper in the REST services to create
 * customized JSON files from the same entities but different JSON outputs.
 *
 * @author Timo Guehring
 */
public class View {
    
    public static class Schemes {}
    public static class SchemeByDocId {}
    public static class SchemeById {}
    public static class Annotations {}
    public static class Documents {}
    public static class Links {}
    public static class UsersWithProjects {}
    public static class Users {}
    public static class Login {}
    public static class Tokens {}
    public static class Projects {}
    public static class ProjectsForUser {}
    public static class Timelogging {}
    
}
