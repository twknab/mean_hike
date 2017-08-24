app.controller('userUpdateController', ['$scope', 'userFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, userFactory, userMessages, $location, $routeParams, $anchorScroll) {
    /*
    Sets up `userUpdateController` to handle User Account update page actions:

    Dependencies:
    - `$scope` - Angular scope object.
    - `userFactory` - Angular factory which handles User API requests.
    - `userMessages` - Angular service which handles user alert messages.
    - `$location` - Location provider service which gives us access to our application's URLs.
    - `$routeParams` - Angular service which allows you to retreive route parameters.

    Notes: This controller is used when viewing the User Account page and when performing any user update actions (ie, a username, email, or password update).
    */

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    /*
    The callback functions below only runs if one of the $scope methods below utilizes a factory method. The callback is sent to the factory, and will run after the factory receives a response from the server API. Please see individual callback functions for how each work.
    */
    var cb = {
        user: function(authValidation) {
            /*
            Runs after `$scope.auth()` completes; checks if session is valid, and if username on record matches URL pattern. If so, sets `$scope.user` to authValidation User object.

            Parameters:
            - `authStatus` - An object returned from our factory, via a response from our API, containing the following properties:
                - `status` - a `true` or `false` value of session validity.
                - `user` - an object containing the User object, if the session is validated.
            */

            // If session status is not validated, redirect to index, else continue data binding:
            if (!authValidation.status) {
                console.log('Session invalid.');
                // Clear out any existing message alerts using `userMessages` service:
                userMessages.clearAlerts();
                // Send a logout success message using `userMessages` service:
                userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: 'You must be logged in to view this page.' });
                // Redirect home:
                $location.url('/');
            } else {
                // If URL username does not match session username, redirect to appropriate account URL:
                if (authValidation.user.username != $routeParams.username ) {
                    console.log("Route paramter for username does not match logged in session...redirecting...");
                    // Redirect to correct user dashboard:
                    $location.url('/account/' + authValidation.user.username);
                }
                // Set `$scope.user` to User recieved from API request:
                $scope.accountName = authValidation.user.username;
                $scope.user = authValidation.user;
                // Delete user password hash for security:
                delete $scope.user.password;
                // Update all alert messages in event of new alert:
                $scope.successAlerts = userMessages.getAlerts();
            }

        },
        update: function(validated) {
            /*
            Runs after `$scope.updateUser()` function completes -- updates alerts and gets currently logged in User.

            Parameters:
            - `validated` - Object returned from API request containing a `messages` object, which contains any success messages.
            */

            // Clear any existing alerts from last time:
            userMessages.clearAlerts();
            // Check if any success messages sent, if so, iterate through the object and generate messages using `userMessages` service:
            if (Object.keys(validated.messages).length > 0) {
                console.log("Messages found.");

                // Send each message to the `userMessages` service to be added as an alert:
                for (var key in validated.messages) {
                    if (validated.messages.hasOwnProperty(key)) {
                        console.log(validated.messages[key]);
                        userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                    }
                }
            }
            // Run auth() to fetch updated User and to check account URL path:
            $scope.auth();
            // Scroll to top of panel where success messages display:
            $anchorScroll(updateUser);
        },
        updateError: function(err) {
            /*
            Runs if errors are returned to the factory after an API request attempt to update a user.

            Parameters:
            - `err` - Object containing any errors generated by update attempt; each error is its own property with a corresponding value.
            */

            console.log('Errors returned from server when trying to Update User:', err);
            $scope.updateErrors = {}; // resets errors if any already existing
            userMessages.clearAlerts(); // resets any success messages existing
            // Set `$scope.updateErrors` to returned errors object from API request:
            $scope.updateErrors = err;
            // Scroll to top of panel where error messages display:
            $anchorScroll(updateUser);
        },
    };

    //---------------------------------//
    //-------- PAGE LOAD ACTIONS ------//
    //---------------------------------//

    $scope.auth = function() {
        /*
        Authorize a user session, and if successful, set User with valid session to `$scope.user`.
        */

        console.log("Authorize logged in user (and fetch them)...");
        // Run `auth` factory method passing in the `auth` callback function above to run when complete:
        userFactory.auth(cb.user);
    };

    // Run auth() on page load:
    $scope.auth();

    //----------------------------//
    //-------- FORM ACTIONS ------//
    //----------------------------//

    $scope.updateUser = function() {
        /*
        Updates a User by calling upon factory methods and performing validations; If the update is successful, `cb.update()` will run, otherwise, `cb.updateError()` will run passing along any errors.
        */

        console.log("Updating user...");
        console.log("Data submitted:", $scope.user);
        // Reset any on-page alerts or errors for new Update attempt:
        $scope.successAlerts = [];
        $scope.updateErrors = {};
        // Call `update()` factory method, passing along `cb.update` (if successful) or `cb.updateError` (which runs if unsuccessful).
        userFactory.update($scope.user, cb.update, cb.updateError);
    };

    $scope.cancel = function() {
        /*
        Cancels a User update by redirecting to the dashboard.
        */

        console.log("Cancelling user account update...");
        $location.url('/dashboard');
    };

    //----------------------------------//
    //------- ANGULAR UI ALERTS  -------//
    //----------------------------------//

    $scope.closeSuccessAlert = function(index) {
        /*
        Close a success alert.

        Parameters:
        - `index` - Index value of success alert to be removed.
        */

        // Remove alert and update `$scope.successAlerts` to most recent:
        $scope.successAlerts = userMessages.removeAlert(index);
    };
}]);
