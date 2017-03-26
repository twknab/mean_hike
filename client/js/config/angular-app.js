// Define Module:
var app = angular.module('app', ['ngRoute']);

// Define Routes:
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/_index.html', // root route partial
            controller: 'loginController',
        })
        .when('/dashboard', {
            templateUrl: 'html/_dashboard.html', // root route partial
            controller: 'dashboardController',
        })
        .when('/hikes', {
            templateUrl: 'html/_all-hikes.html', // root route partial
            controller: 'allHikesController',
        })
        .when('/hikes/:id/edit', {
            templateUrl: 'html/_edit-hike.html', // root route partial
            controller: 'editHikeController',
        })
        .when('/hikes/:id/pre-trip', {
            templateUrl: 'html/_pre-trip.html', // root route partial
            controller: 'preTripController',
        })
        .when('/hikes/new-gear-list', {
            templateUrl: 'html/_new-gear-list.html', // root route partial
            controller: 'newGearListController',
        })
        .when('/hikes/edit-gear-list', {
            templateUrl: 'html/_edit-gear-list.html', // root route partial
            controller: 'editGearListController',
        })
        .when('/hikes/:id/post-trip', {
            templateUrl: 'html/_post-trip.html', // root route partial
            controller: 'postTripController',
        })
        .when('/hikes/:id/report', {
            templateUrl: 'html/_report.html', // root route partial
            controller: 'reportController',
        })
        .otherwise({
            redirectTo: '/',
        });
    $locationProvider
        .html5Mode(true)
        .hashPrefix('!');
});
