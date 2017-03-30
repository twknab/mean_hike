app.controller('userController', ['$scope', 'userFactory', '$location', '$routeParams', function($scope, userFactory, $location, $routeParams) {

    // Callbacks
    var cb = {
        register: function(createdUser) {
            $scope.regErrors = '';
            $scope.newUser = {};
        },
        loginError: function(err) {
            console.log('Errors returned from server:', err);
            $scope.loginErrors = err;
        },
        regError: function(err) {
            console.log('Errors returned from server:', err);
            $scope.regErrors = {};
            $scope.regErrors = err;
        },
    };

    // Register User:
    $scope.register = function() {
        console.log('Login Process: Ang Controller running...data submitted:', $scope.newUser);
        userFactory.register($scope.newUser, cb.register, cb.regError);
    };

}]);
