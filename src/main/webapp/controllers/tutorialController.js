/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular
        .module('app')
        .controller('tutorialController', ['$scope', '$rootScope', '$window', '$http', '$uibModal', function ($scope, $rootScope, $window, $http, $uibModal) {

                if (($window.sessionStorage.role != 'admin') && ($window.sessionStorage.role != 'user') && ($window.sessionStorage.role != 'projectmanager')) {
                    window.location = "/discanno/signin.html";
                } else {
                    console.log("start");
                    
                    // Instance the tour
                    var tour = new Tour({
                      steps: [
                      {
                        element: "#my-element",
                        title: "Title of my step",
                        content: "Content of my step"
                      },
                      {
                        element: "#my-other-element",
                        title: "Title of my step",
                        content: "Content of my step"
                      }
                    ]});

                    // Initialize the tour
                    tour.init();

                    // Start the tour
                    tour.start();
                }
            }
        ]);