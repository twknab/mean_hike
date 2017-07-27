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
        // Runs after $scope.updateUser() function completes:
        update: function(foundUser) {
            $scope.successAlerts.push({ type: 'success', hdr: 'Updated!', msg: 'Your profile has been successfully updated. <a class="alert_link" href="" ng-controller="navController" ng-click="home()">Return Dashboard.</a>' });
            // Run getUser():
            $scope.getUser();
        },
        updateError: function(err) {
            console.log('Errors returned from server:', err);
            $scope.updateErrors = {}; // resets errors if any already existing
            $scope.updateErrors = err;
        },
    };

    //---------------------------------//
    //-------- PAGE LOAD ACTIONS ------//
    //---------------------------------//

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

    // Update User:
    $scope.updateUser = function() {
        console.log("Updating user...");
        $scope.updateErrors = {};
        userFactory.update($scope.userUpdate, cb.update, cb.updateError);
    };

    // Cancel User Update:
    $scope.cancel = function() {
        console.log("Cancelling user account update...");
        $location.url('/dashboard');
    };

    //----------------------------------//
    //------- ANGULAR UI ALERTS  -------//
    //----------------------------------//

    // Create empty successAlerts list to hold future success messages:
    $scope.successAlerts = [];

    // Close Success Alert:
    $scope.closeSuccessAlert = function(index) {
        $scope.successAlerts.splice(index, 1); // removes message from alert array
    };

}]);
