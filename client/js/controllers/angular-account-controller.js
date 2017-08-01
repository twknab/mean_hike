app.controller('accountController', ['$scope', 'userFactory', 'userMessages', '$location', '$routeParams', function($scope, userFactory, userMessages, $location, $routeParams) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        // Runs after $scope.getUser() function completes:
        user: function(foundUser) {
            // If someone tries to spoof the URL:
            if (foundUser.user.username != $routeParams.username ) {
                console.log("Route paramter for username does not match logged in session...redirecting...");
                // Redirect to correct user dashboard:
                $location.url('/account/' + foundUser.user.username);
            }

            // Set user to user sent from DB:
            $scope.accountName = foundUser.user.username;
            $scope.user = foundUser.user;

            // Delete user password hash:
            delete $scope.user.password;

            // Update any alert messages:
            $scope.successAlerts = userMessages.getAlerts();
        },
        // Runs after $scope.updateUser() function completes:
        update: function(updatedUserOrMessage) {
            // Clear any existing alerts from last time:
            userMessages.clearAlerts();

            // Check if any success messages sent:
            if (Object.keys(updatedUserOrMessage.messages).length > 0) {
                console.log("Messages found.");

                // Send each message to the `userMessages` service to be added as an alert.
                for (var key in updatedUserOrMessage.messages) {
                    if (updatedUserOrMessage.messages.hasOwnProperty(key)) {
                        console.log(updatedUserOrMessage.messages[key]);
                        userMessages.addAlert({ type: 'success', hdr: updatedUserOrMessage.messages[key].hdr, msg: updatedUserOrMessage.messages[key].msg });
                    }
                }
            }

            // Run getUser():
            $scope.getUser();
        },
        updateError: function(err) {
            console.log('Errors returned from server:', err);

            $scope.updateErrors = {}; // resets errors if any already existing
            userMessages.clearAlerts(); // resets any success messages existing

            // Set scope errors to rec'd errors object:
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
        console.log("Data submitted:", $scope.user);
        $scope.successAlerts = [];
        $scope.updateErrors = {};
        userFactory.update($scope.user, cb.update, cb.updateError);
    };

    // Cancel User Update:
    $scope.cancel = function() {
        console.log("Cancelling user account update...");
        $location.url('/dashboard');
    };

    //----------------------------------//
    //------- ANGULAR UI ALERTS  -------//
    //----------------------------------//

    // Close Success Alert:
    $scope.closeSuccessAlert = function(index) {
        // Removes alert on page:
        $scope.successAlerts.splice(index, 1);

        // Runs service to remove alert:
        userMessages.removeAlert(index);
    };


}]);
