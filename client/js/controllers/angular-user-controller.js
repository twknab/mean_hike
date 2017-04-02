app.controller('userController', ['$scope', 'userFactory', '$location', '$routeParams', function($scope, userFactory, $location, $routeParams) {

    // Callbacks
    var cb = {
        register: function(createdUser) {
            $scope.regErrors = '';
            $scope.newUser = {};
            $('#myModal').modal('hide'); // closes Modal window per: http://getbootstrap.com/javascript/#modals
            $('#myModal').on('hidden.bs.modal', function (e) {
                console.log('TRANSITION DONE');
                $location.url('/dashboard');
            })
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
