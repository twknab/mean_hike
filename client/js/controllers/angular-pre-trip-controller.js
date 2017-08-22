app.controller('preTripController', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {

    // Callbacks
    var cb = {
        // login: function(newUser) {
        //     $scope.errors = '';
        //     $scope.person = {};
        // },
        error: function(err) {
            console.log('Errors returned from server:', err);
            $scope.errors = err;
        },
    };

    // Test:
    $scope.test = function() {
        console.log('Testing!');
    };

    $scope.test();

}]);
