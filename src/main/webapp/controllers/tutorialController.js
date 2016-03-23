/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular
        .module('app')
        .controller('tutorialController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$q', function ($scope, $rootScope, $window, $http, $uibModal, $q) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'annotator') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {
                    
                    // TODO refactor
                    // Request list of users from backend
                    $scope.getUsers = function () {
                        var httpUsers = $http.get("discanno/user").success(function (response) {
                            $scope.users = JSOG.parse(JSON.stringify(response)).users;
                        }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                        });
                        return httpUsers;
                    };
                    
                    $scope.existsAnnotator = function (users) {
                        for (var i = 0; i < users.length; i++) {
                            var u = users[i];
                            if (u.role === 'annotator') {
                                return true;
                            }
                        }
                        
                        return false;
                    };
                    
                    $scope.existsDocumentsInProjects = function (projects) {
                        for (var i = 0; i < projects.length; i++) {
                            var proj = projects[i];
                            if (proj.documents.length > 0) {
                                var doc = proj.documents[0];
                                return {"docId": doc.id,
                                        "docName": doc.name,
                                        "projectName": proj.name,
                                        "completed": doc.completed};
                            }
                        }
                        return undefined;
                    };
                    
                    /**
                     * TODO schemesController same methods
                     * 
                     * Request list of all schemes.
                     * @returns http-Object of query
                     */
                    $scope.loadSchemes = function () {
                        var httpSchemes = $http.get("discanno/scheme/schemes").success(function (response) {
                            $scope.schemes = JSOG.parse(JSON.stringify(response)).schemes;
                        }).error(function (response) {
                            $rootScope.checkResponseStatusCode(response.status);
                        });
                        return httpSchemes;
                    };

                    var style = "<div class='popover tour'>" +
                                    "<div class='arrow'></div>" +
                                    "<h3 class='popover-title'></h3>" +
                                    "<div class='popover-content'></div>" +
                                    "<div class='popover-navigation'>" +
                                      "<button class='btn btn-default' data-role='next' id='tour-next-button'>Next »</button>" +
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
                    
                    // Prepare the tour for an admin/ project manager
                    if ($window.sessionStorage.role === 'admin' || $window.sessionStorage.role === 'projectmanager') {
                        var httpUsers = $scope.getUsers();
                        var httpProjects = $rootScope.loadProjects();
                        var httpSchemes = $scope.loadSchemes();
                        $q.all([httpSchemes, httpProjects, httpUsers]).then(function () {

                            // Prepare schemes steps

                            // Dummy entry
                            tour.addStep({
                                path: "/discanno/#/schemes",
                                element: "#1-schemes-header",
                                duration: 1,
                                title: "Schemes",
                                content: "In the scheme section you can manage all your schemes."
                            });
                            tour.addStep({
                                path: "/discanno/#/schemes",
                                element: "#1-schemes-header",
                                title: "Schemes",
                                content: "In the scheme section you can manage all your schemes."
                            });

                            if ($scope.schemes.length > 0) {
                                tour.addStep({
                                    path: "/discanno/#/schemes",
                                    element: "#scheme-name",
                                    title: "Schemes",
                                    content: "Great you already added some schemes! Then let's move on with the users.",
                                    placement: "bottom"
                                });
                            } else {
                                tour.addStep({
                                    path: "/discanno/#/schemes",
                                    element: "#schemes-add-button",
                                    title: "Schemes",
                                    content: "Add a scheme to continue.",
                                    placement: "bottom",
                                    onShown: function (tour) {
                                        $("#tour-next-button").prop("disabled", true);
                                    }
                                });
                                tour.addStep({
                                    path: "/discanno/#/schemes",
                                    element: "#scheme-name",
                                    title: "Schemes",
                                    content: "Great you added a scheme! Then let's move on with the users.",
                                    placement: "bottom"
                                });
                            }


                            // Prepare users steps

                            // Dummy entry
                            tour.addStep({
                                path: "/discanno/#/users",
                                element: "#1-users-header",
                                duration: 1,
                                title: "Users",
                                content: "In the users section you can manage all your users."
                            });

                            tour.addStep({
                                path: "/discanno/#/users",
                                element: "#1-users-header",
                                title: "Users",
                                content: "In the users section you can manage all your users."
                            });

                            if ($scope.existsAnnotator($scope.users)) {
                                tour.addStep({
                                    path: "/discanno/#/users",
                                    element: "#1-users-header",
                                    title: "Users",
                                    content: "Great you already added an annotator!",
                                    placement: "right"
                                });
                            } else {
                                tour.addStep({
                                    path: "/discanno/#/users",
                                    element: "#users-add-button",
                                    title: "Users",
                                    content: "Add a user with the user role 'annotator' to continue.",
                                    placement: "bottom",
                                    onShown: function (tour) {
                                        $("#tour-next-button").prop("disabled", true);
                                    }
                                });
                                tour.addStep({
                                    path: "/discanno/#/users",
                                    element: "#user-role",
                                    title: "Users",
                                    content: "Great you added an annotator! Then let's move on with your projects.",
                                    placement: "bottom"
                                });
                            }


                            // Prepare projects steps

                            // Dummy entry
                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#1-projects-header",
                                duration: 1,
                                title: "Projects",
                                content: "In the projects section you can manage all your projects. You can follow the progress, add documents, annotators to the projects"
                            });

                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#1-projects-header",
                                title: "Projects",
                                content: "In the projects section you can manage all your projects. You can follow the progress, add documents, annotators to the projects"
                            });

                            if ($rootScope.projects.length > 0) {
                                tour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#project-name",
                                    title: "Projects",
                                    content: "Great you already added some projects!",
                                    placement: "bottom"
                                });
                            } else {
                                tour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#projects-add-button",
                                    title: "Projects",
                                    content: "Add a project to continue.",
                                    placement: "bottom",
                                    onShown: function (tour) {
                                        $("#tour-next-button").prop("disabled", true);
                                    }
                                });
                                tour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#project-name",
                                    title: "Projects",
                                    content: "Great you added a project!",
                                    placement: "bottom"
                                });
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
                                content: "Add or remove annotator and project manager."
                            });

                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#project-export",
                                title: "Projects",
                                content: "Export the project in the UIMA format. To take a tour through the annotation tool, logg in as an annotator.",
                                placement: "left"
                            });

                        });
                    
                    } // end preparation for admin/ project manager
                    else { // prepare the tour for annotator/ user
                        var httpProjects = $rootScope.loadProjects();
                        $q.all([httpProjects]).then(function () {
                            
                            // Prepare profile steps
                            
                            // Dummy entry
                            tour.addStep({
                                path: "/discanno/#/profile",
                                element: "#1-profile-header",
                                duration: 1,
                                title: "Profile",
                                content: "In the profile section you can manage your profile."
                            });
                            tour.addStep({
                                path: "/discanno/#/profile",
                                element: "#1-profile-header",
                                title: "Profile",
                                content: "In the profile section you can manage your profile."
                            });
                            tour.addStep({
                                path: "/discanno/#/profile",
                                element: "#profile-add-timelogging",
                                title: "Profile",
                                content: "You can logg here your time spent on the projects."
                            });
                            
                            
                            // Prepare project steps
                            
                            // Dummy entry
                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#1-projects-header",
                                duration: 1,
                                title: "Projects",
                                content: "In the projects section you can manage all your projects. You can follow the progress, add documents, annotators to the projects"
                            });
                            tour.addStep({
                                path: "/discanno/#/projects",
                                element: "#1-projects-header",
                                title: "Projects",
                                content: "In the projects section you can have an overview of all your projects."
                            });
                            
                            
                            if ($rootScope.projects.length > 0) {
                                var redirect = $scope.existsDocumentsInProjects($rootScope.projects);
                                
                                tour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#project-name",
                                    title: "Projects",
                                    content: "Great you already have an assigned project!",
                                    placement: "bottom",
                                    onNext: function() {
                                        $rootScope.initAnnoTool(redirect.docId, redirect.docName, redirect.projectName, redirect.completed);
                                    }
                                });
                                
                                if (redirect === undefined) {
                                    tour.addStep({
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        title: "Projects",
                                        content: "Ohhh you have no assigned documents :-(. Tell your project manager to assign you documents."
                                    });
                                } else {
                                    // Prepare annotation tool steps
                                    
                                    // Dummy entry
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#1-anno-tool",
                                        title: "Annotation Tool",
                                        duration: 1,
                                        content: "This is the heart of DiscAnno. You can annotate here the assigned documents. Tick the checkbox to mark this document as completed."
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#1-anno-tool",
                                        title: "Annotation Tool",
                                        content: "This is the heart of DiscAnno. You can annotate here the assigned documents. Tick the checkbox to mark this document as completed."
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-text",
                                        title: "Annotation Tool",
                                        content: "This section views the text. Mark words, passages or double click on words to annotate them."
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-options",
                                        title: "Annotation Tool",
                                        content: "If you marked a segment the annotation options will be viewed. These are dependent on the assigned scheme. Select at first a TargetType then the corresponding labels.",
                                        placement: "left"
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-text",
                                        title: "Annotation Tool",
                                        content: "If your scheme defined links. Simply mark the wanted segments in the text, assign the proper TargetTypes and drag & drop the start annotation to the target annotation."
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-graph",
                                        title: "Annotation Tool",
                                        content: "If your scheme enabled the graph, you have parallel a graph representation of your text. If the graph is hidden, click on the graph bar to unhide and vice versa.",
                                        placement: "left"
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-navigation",
                                        title: "Annotation Tool",
                                        content: "The navigation section enables a quick navigation between all your documents. The checkmark indicates the completed status.",
                                        placement: "left"
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-shortcuts",
                                        title: "Annotation Tool",
                                        content: "Press '?' to show all shortcuts. The shortcuts make a quick workflow possible and reduces the amount of clicks.",
                                        placement: "left"
                                    });
                                    tour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#1-anno-tool",
                                        title: "Annotation Tool",
                                        content: "Have fun with DiscAnno! The tour ends here :-)"
                                    });
                                }
                                
                            } else {
                                tour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#1-projects-header",
                                    title: "Projects",
                                    content: "Ohhh you have no assigned projects :-(. Tell your project manager to assign you projects."
                                });
                            }
                        });
                    }
                    
                    // Start the tour
                    $scope.startTour = function () {
                        // Initialize the tour
                        $rootScope.tour = tour;
                        tour.init();
                        tour.restart();
                    };
                    
                }
                
            }
        ]);