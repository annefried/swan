/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular
        .module('app')
        .controller('tutorialController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$q', function ($scope, $rootScope, $window, $http, $uibModal, $q) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {
                    
                    // TODO refactor
                    // Request list of users from backend
                    $scope.getUsers = function () {
                        $http.get("tempannot/user").then(function (response) {
                            var res = JSOG.parse(JSON.stringify(response.data));
                            $scope.users = res.users;
                        });

                    };
                    
                    $scope.existsAnnotater = function (users) {
                        for (var i = 0; i < users.length; i++) {
                            var u = users[i];
                            if (u.role === 'user') {
                                return true;
                            }
                        }
                        
                        return false;
                    };
                    
                    /**
                     * TODO schemesController same methods
                     * 
                     * Request list of all schemes.
                     * @returns http-Object of query
                     */
                    $scope.loadSchemes = function () {
                        var httpSchemes = $http.get("tempannot/scheme/schemes").success(function (response) {
                            $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
                        }).error(function (response) {
                            $rootScope.addAlert({type: 'danger', msg: 'No connection to server'});
                        });
                        return httpSchemes;
                    };

                    /**
                     * TODO schemesController same methods
                     * 
                     * Request list of all Projects.
                     * @returns http-Object of query
                     */
                    $scope.loadProjects2 = function () {
                        var httpProjects = $http.get("tempannot/project").then(function (response) {
                            $scope.projects = JSOG.parse(JSON.stringify(response.data)).projects;
                        }, function (err) {
                            $rootScope.addAlert({type: 'danger', msg: 'No Connection to Server.'});
                        });
                        return httpProjects;
                    };
                    
                    var style = "<div class='popover tour'>" +
                                    "<div class='arrow'></div>" +
                                    "<h3 class='popover-title'></h3>" +
                                    "<div class='popover-content'></div>" +
                                    "<div class='popover-navigation'>" +
                                      "<button class='btn btn-default' data-role='next'>Next »</button>" +
                                      "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                    "</div>" +
                                  "</div>";
                    
                    // Instance the tour
                    // Note: Unfortunately bootstrap-tour is a little buggy when
                    // the tour redirects to another page. Therefore dummy entries
                    // were added with 1 ms duration as a workaround. Additionally
                    // the corresponding controllers have to check for the tour
                    // in the $rootScope and resume if specified
                    var tour = new Tour({
                        storage: $window.localStorage, // localStorage is needed for multipage tour
//                        debug:true, // uncomment for debugging
                        template: style,
                        steps: [
                        {
                            path: "/discanno/#/tutorial",
                            element: "#1-features",
                            title: "Get to know all the DiscAnno features",
                            content: "Make yourself familiar with all the supported features."
                        },
                        {
                            path: "/discanno/#/tutorial",
                            element: "#2-tips",
                            title: "Tips",
                            content: "These tips can make your annotating life easier."
                        }
                    ]});
                    
                    $scope.getUsers();
                    var httpProjects = $scope.loadProjects2();
                    var httpSchemes = $scope.loadSchemes();
                    $q.all([httpSchemes, httpProjects]).then(function () {

                        // Prepare schemes steps
                        
                        // Dummy entry
                        tour.addStep({
                            path: "/discanno/#/schemes",
                            element: "#1-schemes-header",
                            duration: 1,
                            title: "Schemes",
                            content: "In the scheme section you can manage all your schemes."
                        });

                        if ($scope.schemes.length > 0) {
                            tour.addStep({
                                path: "/discanno/#/schemes",
                                element: "#1-schemes-header",
                                title: "Schemes",
                                content: "In the scheme section you can manage all your schemes."
                            });
                            tour.addStep({
                                path: "/discanno/#/schemes",
                                element: "#scheme-name",
                                title: "Schemes",
                                content: "Great you already added some schemes! Then lets move on with your projects.",
                                placement: "bottom"
                            });
                        } else {
                            
                        }
                        
                        
                        // Prepare users steps
                        
                        // Dummy entry
                        tour.addStep({
                            path: "/discanno/#/annotators",
                            element: "#1-users-header",
                            duration: 1,
                            title: "Users",
                            content: "In the users section you can manage all your users."
                        });
                        
                        tour.addStep({
                            path: "/discanno/#/annotators",
                            element: "#1-users-header",
                            title: "Users",
                            content: "In the users section you can manage all your users."
                        });
                            
                        if ($scope.existsAnnotater($scope.users)) {
                            tour.addStep({
                                path: "/discanno/#/annotators",
                                element: "#users-role",
                                title: "Projects",
                                content: "Great you already added an annotater!",
                                placement: "right"
                            });
                        } else {
                            
                        }
                        
                        
                        // Prepare projects steps
                        
                        // Dummy entry
                        tour.addStep({
                            path: "/discanno/#/projects",
                            element: "#1-projects-header",
                            duration: 1,
                            title: "Projects",
                            content: "In the projects section you can manage all your projects. You can follow the progress, add documents, annotaters to the projects"
                        });
                            
                        if ($scope.projects.length > 0) {
                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#1-projects-header",
                                title: "Projects",
                                content: "In the projects section you can manage all your projects. You can follow the progress, add documents, annotaters to the projects"
                            });
                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#project-name",
                                title: "Projects",
                                content: "Great you already added some projects!",
                                placement: "bottom"
                            });
                        } else {
                            
                        }
                        
                        tour.addStep({
                            path: "/discanno/#/projects",
                            element: "#project-scheme-view",
                            title: "Projects",
                            content: "Have a look at your assigned scheme."
                        });
                        
                        tour.addStep({
                            path: "/discanno/#/projects",
                            element: "#project-edit",
                            title: "Projects",
                            content: "Add or remove annotater and project manager."
                        });
                        
                        tour.addStep({
                            path: "/discanno/#/projects",
                            element: "#project-export",
                            title: "Projects",
                            content: "Export the project in the UIMA format. To take a tour through the annotation tool, logg in as an annotater.",
                            placement: "left"
                        });
                    
                        // Initialize the tour
                        $rootScope.tour = tour;
                        tour.init();

                        // Start the tour
                        $scope.startTour = function () {
                            tour.restart();
                        };
                        
                    });
                    
                }
                
            }
        ]);