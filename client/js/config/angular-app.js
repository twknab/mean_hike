// Define Module:
var app = angular.module('app', ['ngRoute']);

// Define Routes:
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'html/_index.html', // root route partial
            controller: 'loginController',
        })
        .when('/dashboard', {
            templateUrl: 'html/_dashboard.html', // root route partial
            controller: 'dashboardController',
        })
        .otherwise({
            redirectTo: '/',
        })
});
