/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.unisaarland.discanno.rest.view;

/**
 * These are views for the JSON mapper in the REST services to create
 * customized JSON files from the same entities but different JSON outputs.
 *
 * @author Timo Guehring
 */
public class View {
    
    public static class Schemes {}      // Multiple schemes
    public static class Scheme {}       // Single scheme
    public static class Annotations {}
    public static class Documents {}
    public static class Links {}
    public static class UsersWithProjects {}
    public static class Users {}
    public static class Login {}
    public static class Tokens {}
    public static class Projects {}
    
}
