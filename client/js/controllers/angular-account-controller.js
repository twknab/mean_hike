app.controller('accountController', ['$scope', 'userFactory', '$location', '$routeParams', '$uibModal', '$log', function($scope, userFactory, $location, $routeParams, $uibModal, $log) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        // Runs after $scope.getUser() function completes:
        user: function(foundUser) {
            // If someone tries to spoof the URL:
            if (foundUser.user.username != $routeParams.username ) {
                console.log("THIS IS NOT THE CORRECT ROUTE!");
                // Redirect to correct user dashboard:
                $location.url('/account/' + foundUser.user.username);
            }
            $scope.user = foundUser.user;
            // Delete user password hash:
            delete $scope.user.password;
        },
        // // Runs if errors after $scope.login() function completes:
        // loginError: function(err) {
        //     console.log('Errors returned from server:', err);
        //     $scope.loginErrors = {}; // resets errors if any already existing
        //     $scope.loginErrors = err;
        // },
    };

    // Gets currently logged in user:
    $scope.getUser = function() {
        console.log("Getting currently logged in user...");
        userFactory.auth(cb.user);
    };

    // Run getUser() on page load:
    $scope.getUser();

    //----------------------------//
    //-------- FORM ACTIONS ------//
    //----------------------------//


    // Cancel User Update:
    $scope.cancel = function() {
        console.log("Cancelling user account update...");
        $location.url('/dashboard');
    };


}]);
