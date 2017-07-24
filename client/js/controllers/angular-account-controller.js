app.controller('accountController', ['$scope', 'userFactory', '$location', '$routeParams', '$uibModal', '$log', function($scope, userFactory, $location, $routeParams, $uibModal, $log) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        // Runs after $scope.getUser() function completes:
        user: function(foundUser) {
            $scope.loginErrors = {};
            $scope.user = {};
            $location.url('/dashboard');
        },
        // // Runs if errors after $scope.login() function completes:
        // loginError: function(err) {
        //     console.log('Errors returned from server:', err);
        //     $scope.loginErrors = {}; // resets errors if any already existing
        //     $scope.loginErrors = err;
        // },
    };

    //--------------------------//
    //-------- NAVIGATION ------//
    //--------------------------//

    // Cancel User Update:
    $scope.cancel = function() {
        console.log("Cancelling user account update...");
        $location.url('/dashboard');
    };


}]);
