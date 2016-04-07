/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular
        .module('app')
        .controller('tutorialController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', '$q', function ($scope, $rootScope, $window, $http, $uibModal, $q) {

                // Note: Unfortunately bootstrap-tour is a little buggy when
                // the tour redirects to another page. Therefore dummy entries
                // were added with 1 ms duration as a workaround. Additionally
                // the corresponding controllers have to check for the tour
                // in the $rootScope and resume if specified.
                // For modals, the first step must have a delay of 1000, 
                // allowing time for loading and updating the DOM.

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
                if (($window.sessionStorage.role != 'admin')
                        && ($window.sessionStorage.role != 'annotator')
                        && ($window.sessionStorage.role != 'projectmanager')) {
                    $rootScope.redirectToLogin();
                } else {

                    var httpProjects = $rootScope.loadProjects();
                    $q.all([httpProjects]).then(function () {

                        // project manager tour
                        if ($window.sessionStorage.role === 'admin' || $window.sessionStorage.role === "projectmanager") {

                            $scope.userMgmtTour = new Tour({
                                name: "DiscAnno_tutorial",
                                container: "body",
                                keyboard: true,
                                storage: window.localStorage,
                                debug: false,
                                backdrop: false,
                                backdropContainer: 'body',
                                backdropPadding: 0,
                                redirect: true,
                                orphan: false,
                                duration: false,
                                delay: false,
                                basePath: "",
                                template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title'></h3>" +
                                        "<div class='popover-content'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-default' data-role='next' id='tour-next-button'>Next »</button>" +
                                        "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                        "</div>" +
                                        "</div>",
                                steps: [
                                    {
                                        path: "/discanno/#/tutorial",
                                        element: "#navbar-pe",
                                        title: "Project manager tutorial",
                                        content: "In this tutorial, you'll learn how to create a new user account for an annotator in DiscAnno."
                                    },
                                    // USER MANAGEMENT
                                    {
                                        path: "/discanno/#/tutorial",
                                        element: "#navbar-users",
                                        title: "First, we need accounts for our annotators.",
                                        content: "Click 'Next' to see how the user management works."
                                    },
                                    {
                                        // dummy
                                        element: "#1-users-header",
                                        title: "Users",
                                        duration: 1,
                                        content: "List of users",
                                        path: "/discanno/#/users"
                                    },
                                    {
                                        element: "#1-users-header",
                                        title: "Users",
                                        content: "Here, you can see a list of all users in the database. They are identified by their email address, and can be 'annotators', 'project managers' or 'admins'.",
                                        path: "/discanno/#/users",
                                    },
                                    {
                                        element: "#addUserButton",
                                        title: "Let's add a new user",
                                        placement: "left",
                                        content: "Click here and fill out the user details for a new annotator. Make sure to choose the role 'Annotator'.",
                                        path: "/discanno/#/users",
                                        reflex: true,
                                        onShown: function () {
                                            console.log("hahllo");
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    },
                                    {
                                        element: "#submit_add_user_button",
                                        title: "Fill out valid user information",
                                        content: "Select the role 'Annotator' and then click here.",
                                        path: "/discanno/#/users",
                                        reflex: true,
                                        delay:750,
                                        onShown: function (tour) {
                                            console.log("showing...");
                                            $("#tour-next-button").prop("disabled", true);
                                        },
                                    },
                                    {
                                        element: "#1-users-header",
                                        title: "Great, annotator added!",
                                        content: "As you know how to add users now, check out the other tutorials!",
                                        path: "/discanno/#/users",
                                        onShown: function (tour) {
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    }
                                ]
                            });
                            // 
                            $scope.schemeTour = new Tour({
                                name: "DiscAnno_scheme_tutorial",
                                container: "body",
                                keyboard: true,
                                storage: window.localStorage,
                                //debug: true,
                                backdrop: false,
                                backdropContainer: 'body',
                                backdropPadding: 0,
                                redirect: true,
                                orphan: false,
                                duration: false,
                                delay: false,
                                basePath: "",
                                template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title'></h3>" +
                                        "<div class='popover-content'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-default' data-role='next' id='tour-next-button'>Next »</button>" +
                                        "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                        "</div>" +
                                        "</div>",
                                steps: [
                                    {
                                        path: "/discanno/#/tutorial",
                                        element: "#navbar-scheme",
                                        reflex: true,
                                        title: "Annotation scheme tutorial",
                                        content: "In this tutorial, you'll learn how to create a new annotation scheme from scratch. Later on, you can also load and modify an existing scheme."
                                    },
                                    // SCHEME MANAGMENT
                                    {
                                        // dummy
                                        element: "#1-schemes-header",
                                        title: "Schemes",
                                        duration: 1,
                                        content: "List of schemes",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#1-schemes-header",
                                        title: "Annotation schemes",
                                        content: "Here, you can see a list of all annotation schemes existing in the database.",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#schemes-add-button",
                                        title: "Let's create a brand-new annotation scheme!",
                                        placement: "left",
                                        content: "Click here to open the Scheme builder.",
                                        path: "/discanno/#/schemes",
                                        reflex: true,
                                        onShown: function (tour) {
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    },
                                    {
                                        element: "#scheme-name-input",
                                        title: "Scheme name",
                                        delay: 750,
                                        content: "The most important thing is to give a meaningful name to your scheme. Note that scheme names need to be unique across the database, i.e., you cannot give a name to your scheme that another project manager has used already. But good news: you can use their schemes if you want to!",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#annotation-types-input",
                                        title: "Annotation types",
                                        content: "Next, we need at least one annotation type, which will later be assigned to spans. Try 'Clause', and don't forget to click 'Add'.",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#sb_addLabelSetButton",
                                        title: "Now, let's add a label set.",
                                        placement: "right",
                                        content: "A label set applies to particular annotation types (select 'Clause'). Give a good explanatory name to your label set (e.g., 'EventType') and add some labels (e.g., 'State', 'Event'). Then click 'Add label set'.",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#scheme_add_links_div",
                                        title: "And finally, let's add link types.",
                                        placement: "left",
                                        content: "Call your link set 'Temporal relation'. Select 'Clause' as start and end types and enter some labels, e.g. 'before' and 'after. Click 'Add link set'.",
                                        path: "/discanno/#/schemes"
                                    },
                                    {
                                        element: "#sb_submitSchemeButton",
                                        title: "Done! You created your first scheme.",
                                        placement: "left",
                                        content: "Click here to save your scheme to the database.",
                                        path: "/discanno/#/schemes",
                                        reflex: true,
                                        onShown: function (tour) {
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    },
                                    {
                                        orphan: true,
                                        title: "Congrats, you have just created your first DiscAnno annotation scheme!",
                                        content: "If you have already added an annotator, check out the project management tutorial now!",
                                        path: "/discanno/#/schemes",
                                    }
                                ]});
                            $scope.peTour = new Tour({
                                name: "DiscAnno_project_explorer_tutorial",
                                container: "body",
                                keyboard: true,
                                storage: window.localStorage,
                                //debug: true,
                                backdrop: false,
                                backdropContainer: 'body',
                                backdropPadding: 0,
                                redirect: true,
                                orphan: false,
                                duration: false,
                                delay: false,
                                basePath: "",
                                template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title'></h3>" +
                                        "<div class='popover-content'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-default' data-role='next' id='tour-next-button'>Next »</button>" +
                                        "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                        "</div>" +
                                        "</div>",
                                steps: [
                                    // PROJECT MANAGEMENT

                                    {
                                        path: "/discanno/#/tutorial",
                                        element: "#navbar-pe",
                                        title: "Projects",
                                        content: "Using the Project Explorer, you can manage all your projects. You can follow the annotation progress, and add documents or annotators to the projects."
                                    },
                                    // Dummy entry
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        duration: 1,
                                        title: "Projects",
                                        content: ""
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        title: "Projects",
                                        content: "Here's a list of your projects."
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#pe_addProject_button",
                                        title: "Let's add a new project.",
                                        placement: "left",
                                        content: "Click here to add a new project.",
                                        reflex: true,
                                        onShown: function (tour) {
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#pe_createProjectButton",
                                        title: "Create a new project",
                                        delay: 750,
                                        placement: "left",
                                        content: "Enter a name for the project, and select the scheme we created earlier.",
                                        reflex: true,
                                        onShown: function (tour) {
                                            $("#tour-next-button").prop("disabled", true);
                                        }
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#pe_edit_project",
                                        title: "Edit project",
                                        placement: "right",
                                        content: "Click on the edit icon to add annotators to your project. Add the user that you created in the other tutorial. Then click 'Next'.",
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#pe_expand_documents",
                                        title: "Show documents",
                                        placement: "right",
                                        content: "Click on the 'plus' if you want to see or edit the set of documents of a project. Click on '+Document' and upload some '.txt' file.",
                                    },
                                    {
                                        element: "#1-projects-header",
                                        title: "Well, that's it.",
                                        content: "Your annotator can now log in and start working.",
                                        path: "/discanno/#/projects",
                                    },
                                    {
                                        element: "#pe_export",
                                        title: "Ah, not quite.",
                                        placement: "left",
                                        content: "When your annotators are done, you can export your data as XML or XMI files!",
                                        path: "/discanno/#/projects",
                                    },
                                    {
                                        orphan: true,
                                        title: "Okay, that's it.",
                                        content: "For more info and technical details, check out our <a href='https://github.com/annefried/discanno'>GitHub site</a>.",
                                        path: "/discanno/#/projects",
                                    }
                                ],
                            });
                        } else {
                            // logged in as annotator
                            $scope.annotTour = new Tour({
                                name: "DiscAnno_annotator_tutorial",
                                container: "body",
                                keyboard: true,
                                storage: window.localStorage,
                                //debug: true,
                                backdrop: false,
                                backdropContainer: 'body',
                                backdropPadding: 0,
                                redirect: true,
                                orphan: false,
                                duration: false,
                                delay: false,
                                basePath: "",
                                template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title'></h3>" +
                                        "<div class='popover-content'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-default' data-role='next' id='tour-next-button'>Next »</button>" +
                                        "<button class='btn btn-default' data-role='end'>End tour</button>" +
                                        "</div>" +
                                        "</div>",
                                steps: [
                                    {
                                        path: "/discanno/#/tutorial",
                                        element: "#navbar-profile",
                                        placement: "left",
                                        title: "Annotator tutorial",
                                        content: "In this tutorial, you'll learn how to use DiscAnno effectively as an annotator. Let's check out the profile page."
                                    },
                                    {
                                        path: "/discanno/#/profile",
                                        element: "#1-profile-header",
                                        placement: "right",
                                        duration: 1,
                                        title: "Annotator tutorial",
                                        content: "In this tutorial, you'll learn how to use DiscAnno effectively as an annotator. Let's check out the profile page."
                                    },
                                    {
                                        path: "/discanno/#/profile",
                                        element: "#1-profile-header",
                                        placement: "right",
                                        title: "This is your profile page.",
                                        content: "You can change your password when you click on the Edit button (the pencil). You can also log the time you've worked here."
                                    },
                                    {
                                        path: "/discanno/#/profile",
                                        element: "#navbar-pe",
                                        placement: "right",
                                        title: "Let's go on.",
                                        content: "The Project Explorer is where you find the documents assigned to you."
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        placement: "right",
                                        duration: 1,
                                        title: "Here's the list of your projects.",
                                        content: ""
                                    },
                                    {
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        placement: "right",
                                        title: "Here's the list of your projects.",
                                        content: "You can see the project manager who is responsible for a project, and when you click on the + next to a project name, you will see a list of documents that you can edit."
                                    }
                                ]
                            });
                            var annotTour = $scope.annotTour;
                            // go to editor only if project + document exists
                            if ($rootScope.projects.length > 0) {
                                var redirect = $scope.existsDocumentsInProjects($rootScope.projects);
                                annotTour.addStep({
                                    path: "/discanno/#/projects",
                                    element: "#project-name",
                                    title: "Projects",
                                    content: "Great, you already have an assigned project and document. Click 'Next' to check out the editor.",
                                    placement: "bottom",
                                    onNext: function () {
                                        $rootScope.initAnnoTool(redirect.docId, redirect.docName, redirect.projectName, redirect.completed);
                                    }
                                });
                                if (redirect === undefined) {
                                    annotTour.addStep({
                                        path: "/discanno/#/projects",
                                        element: "#1-projects-header",
                                        title: "Projects",
                                        content: "Unfortunately you have no assigned documents :-(. Tell your project manager to assign you documents."
                                    });
                                } else {

                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#1-anno-tool",
                                        title: "Annotation Tool",
                                        duration: 1,
                                        content: "This is the heart of DiscAnno. You can annotate here the assigned documents. Once you're done with a document, tick the checkbox to mark this document as completed."
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#1-anno-tool",
                                        title: "Editor",
                                        content: "This is the heart of DiscAnno. Let's check it out."
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-text",
                                        title: "Creating annotations",
                                        content: "This section views the text. Use  your mouse to mark words or passages or double click on words to annotate them. To deselect a current selection, just click anywere on an empty space in the Text box."
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-options",
                                        title: "Adding annotations",
                                        content: "If you created and select an annotation in the text box, you will see the options for annotation here. These are dependent on the assigned scheme. Select at first a Type for the annotation, then the corresponding labels.",
                                        placement: "left"
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-text",
                                        title: "Creating links",
                                        content: "If your scheme defined links, select the start annotation and drag your mouse aways from it. Possible end nodes are highlighted. Drop you mouse selection at one of them, and choose a label for your link."
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-graph",
                                        title: "Graph visualization",
                                        content: "This box shows the graph of your annotations. If the graph is hidden, click on the graph bar to unhide and vice versa. You can click on the nodes in the graph to navigate to the corresponding area in the text document.",
                                        placement: "left"
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-navigation",
                                        title: "Project navigation",
                                        content: "The navigation section enables a quick navigation between all your documents. The checkmark indicates whether the document has been completed.",
                                        placement: "left"
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        element: "#anno-shortcuts",
                                        title: "Make your life easier!",
                                        content: "Press '?' to show all shortcuts. The shortcuts make a quick workflow possible and reduces the amount of clicks. For example, you can select an annotation and press 'a', 's', 'd' or 'f' to change the span word-wise. Try it out!",
                                        placement: "left"
                                    });
                                    annotTour.addStep({
                                        path: "/discanno/#/annotation",
                                        orphan: true,
                                        title: "Annotation Tool",
                                        content: "Have fun with DiscAnno! The tour ends here :-)"
                                    });
                                }

                            }
                        }
                    });
                }
                // Start the tours
                $scope.startTourUserMgmt = function () {
                    // Initialize the tour
                    $rootScope.tour = $scope.userMgmtTour;
                    $rootScope.tour.init();
                    $rootScope.tour.restart();
                    $rootScope.tour.start();
                };
                $scope.startTourSchemes = function () {
                    // Initialize the tour
                    $rootScope.tour = $scope.schemeTour;
                    $rootScope.tour.init();
                    $rootScope.tour.restart();
                    $rootScope.tour.start();
                };
                $scope.startTourProjectExpl = function () {
                    // Initialize the tour
                    $rootScope.tour = $scope.peTour;
                    $rootScope.tour.init();
                    $rootScope.tour.restart();
                    $rootScope.tour.start();
                };
                $scope.startTourAnnotator = function () {
                    // Initialize the tour
                    $rootScope.tour = $scope.annotTour;
                    $rootScope.tour.init();
                    $rootScope.tour.restart();
                    $rootScope.tour.start();
                };
            }

        ]);