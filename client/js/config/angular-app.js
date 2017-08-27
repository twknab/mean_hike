// Define Module:
var app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

// Define Routes:
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/_login.html', // login page
            controller: 'userController',
        })
        .when('/account/:username', {
            templateUrl: 'html/_user-account.html', // user account page
            controller: 'userUpdateController',
        })
        .when('/about', {
            templateUrl: 'html/_about.html', // login page
            controller: 'userController',
        })
        .when('/dashboard', {
            templateUrl: 'html/_dashboard.html', // dashboard page
            controller: 'dashboardController',
        })
        .when('/hikes/:id/pre-trip', {
            templateUrl: 'html/_pre-trip.html', // pre-trip page
            controller: 'preTripController',
        })
        .when('/hikes', {
            templateUrl: 'html/_all-hikes.html', // all hikes page
            controller: 'allHikesController',
        })
        .when('/hikes/:id', {
            templateUrl: 'html/_hike.html', // hike page
            controller: 'hikeController',
        })
        // .when('/hikes/:id/edit', {
        //     templateUrl: 'html/_edit-hike.html', // edit hike page
        //     controller: 'editHikeController',
        // })
        // .when('/hikes/add-gear-list', {
        //     templateUrl: 'html/_add-gear-list.html', // add gear list page
        //     controller: 'addGearListController',
        // })
        // .when('/hikes/edit-gear-list', {
        //     templateUrl: 'html/_edit-gear-list.html', // edit gear list pages
        //     controller: 'editGearListController',
        // })
        // .when('/hikes/:id/post-trip', {
        //     templateUrl: 'html/_post-trip.html', // post trip page
        //     controller: 'postTripController',
        // })
        .otherwise({
            redirectTo: '/', // otherise load root
        });
    $locationProvider // setup html5 mode to remove hashbangs from url
        .html5Mode(true)
        .hashPrefix('!');
        /*
            Note: Because HTML5 mode is enabled, you're going to have to
            rewrite your ExpressJS routing (see `server/config/app.js`)
        */
});
