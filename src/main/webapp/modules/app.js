/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

angular
	.module('app', [
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',
		'ui.bootstrap.tpls',
		'd3Module',
		'cfp.hotkeys',
		'angular-clipboard'
	])
	.config(Config);

function Config($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/dashboard.html',
			controller: 'rootController',
			controllerAs: 'dashboard'
		})
		.when('/dashboard', {
			templateUrl: 'templates/dashboard.html',
			controller: 'rootController',
			controllerAs: 'dashboard'
		})
		.when('/projects', {
			templateUrl: 'templates/projects/projects.html',
			controller: 'projectsController',
			controllerAs: 'projects'
		})
		.when('/users', {
			templateUrl: 'templates/users/users.html',
			controller: 'usersController',
			controllerAs: 'users'
		})
		.when('/annotation', {
			templateUrl: 'templates/annotation.html',
			controller: 'annotationController',
			controllerAs: 'annotation'
		})
		.when('/profile', {
			templateUrl: 'templates/profile/profile.html',
			controller: 'profileController',
			controllerAs: 'profile'
		})
		.when('/signin', {
			templateUrl: '/signin.html',
			controller: 'LoginController',
			controllerAs: 'signin'
		})
		.when('/schemes', {
			templateUrl: 'templates/schemes/schemes.html',
			controller: 'schemesController',
			controllerAs: 'schemes'
		})
		.when('/tutorial', {
			templateUrl: 'templates/tutorial.html',
			controller: 'tutorialController',
			controllerAs: 'tutorial'
		});
}
