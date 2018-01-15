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
      templateUrl: 'html/_update_user.html', // user account page
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
      templateUrl: 'html/_pre_trip.html', // pre-trip page
      controller: 'preTripController',
    })
    .when('/hikes/:id/pre-trip/edit', {
      templateUrl: 'html/_update_pre_trip.html', // pre-trip page
      controller: 'preTripUpdateController',
    })
    .when('/hikes', {
      templateUrl: 'html/_all_hikes.html', // all hikes page
      controller: 'allHikesController',
    })
    .when('/hikes/:id', {
      templateUrl: 'html/_hike.html', // hike page
      controller: 'hikeController',
    })
    .when('/hikes/:id/post-trip', {
      templateUrl: 'html/_post_trip.html', // post trip page
      controller: 'postTripController',
    })
    .when('/hikes/:id/post-trip/edit', {
      templateUrl: 'html/_update_post_trip.html', // post-trip page
      controller: 'postTripUpdateController',
    })
    .when('/hikes/:id/edit', {
      templateUrl: 'html/_update_hike.html', // edit hike page
      controller: 'hikeUpdateController',
    })
    // .when('/hikes/add-gear-list', {
    //     templateUrl: 'html/_add-gear-list.html', // add gear list page
    //     controller: 'addGearListController',
    // })
    // .when('/hikes/edit-gear-list', {
    //     templateUrl: 'html/_edit-gear-list.html', // edit gear list pages
    //     controller: 'editGearListController',
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
