app.controller('loginController', ['$scope', 'loginFactory', '$location', '$routeParams', function($scope, loginFactory, $location, $routeParams) {

    // Callbacks
    var cb = {
        login: function(newUser) {
            $scope.errors = '';
            $scope.person = {};
        },
        error: function(err) {
            console.log('Errors returned from server:', err);
            $scope.errors = err;
        },
    };

    // Login User:
    $scope.login = function() {
        console.log('Login Process: Ang Controller running...data submitted:', $scope.user);
        loginFactory.login($scope.user, cb.login, cb.error);
    };

}]);
