angular
        .module('app', [
            'ngRoute',
            'ngAnimate',
            'ui.bootstrap',
            'ui.bootstrap.tpls',
            'd3',
            'cfp.hotkeys'
        ])
        .config(Config);


function Config($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'dashboard'
            })
            .when('/dashboard', {
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'dashboard'
            })
            .when('/explorer', {
                templateUrl: 'templates/explorer.html',
                controller: 'explorerController',
                controllerAs: 'explorer'
            })
            .when('/projects', {
                templateUrl: 'templates/projects/projects.html',
                controller: 'projectsController',
                controllerAs: 'projects'
            })
            .when('/annotators', {
                templateUrl: 'templates/users/users.html',
                controller: 'annotatorsController',
                controllerAs: 'annotators'
            })
            .when('/annotation', {
                templateUrl: 'templates/annotation.html',
                controller: 'annotationController',
                controllerAs: 'annotation'
            })
            .when('/profile', {
                templateUrl: 'templates/profile.html',
                controller: 'profileController',
                controllerAs: 'profile',
            })
            .when('/signin', {
                templateUrl: '/signin.html',
                controller: 'LoginController',
                controllerAs: 'signin',
            })
            .when('/schemes', {
                templateUrl: 'templates/schemes/schemes.html',
                controller: 'schemesController',
                controllerAs: 'schemes',
            });
}