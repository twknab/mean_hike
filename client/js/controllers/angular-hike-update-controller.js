app.controller('hikeUpdateController', ['$scope', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

    // Callbacks
    var cb = {
        user: function(authValidation) {
            /*
            Runs after `$scope.auth()` completes; checks if session is valid, and if so sets `$scope.user` to authValidation User object.

            Parameters:
            - `authValidation` - An object returned from our factory, via a response from our API, containing the following properties:
                - `status` - a `true` or `false` value of session validity.
                - `user` - an object containing the User object, if the session is validated.
            */

            // If authorization status is false, redirect to index:
            if (!authValidation.status) {
                console.log('Session invalid.');
                // Clear out any existing message alerts using `userMessages` service:
                userMessages.clearAlerts();
                // Send a logout success message using `userMessages` service:
                userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: 'You must be logged in to view this page.' });
                // Redirect home:
                $location.url('/');
            } else {
                // Else clear alerts, set `$scope.user` to the validated user and remove the password property:
                console.log('Session valid.', authValidation.user);
                // Clear out any existing user messages:
                userMessages.clearAlerts();
                // Set User Data:
                $scope.user = authValidation.user;
                // Get current hike:
                $scope.getHike();
            }
        },
        hike: function(retrievedHike) {
            /*
            Runs after `$scope.getHike()` completes; sets hike to retrieved hike.

            Parameters:
            - `retrievedHike` - Hike object returned.
            */

            console.log('Successfully retrieved hike for post-trip page...', retrievedHike);
            $scope.hike = retrievedHike;

            // Get alert messages:
            $scope.alerts = userMessages.getAlerts();
        },
        updatedHike: function(validated) {
            /*
            Runs if hike updates successfully; returns to dashboard.

            Parameters:
            - `validated` - Object returned from API request containing a `messages` object, which contains any success messages.
            */

            // Iterate through messages and add them to alerts:
            for (var key in validated.messages) {
                if (validated.messages.hasOwnProperty(key)) {
                    console.log(validated.messages[key]);
                    userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                }
            }

            $location.url('/dashboard');
        },
        updateHikeError: function(err) {
            /*
            Runs if errors are returned after `$scope.updateHike()`.

            Parameters:
            - `err` - Errors object returned.
            */

            console.log('Errors returned from server when trying to update hike:', err);

            // Iterate through errors and add them to alerts:
            for (var key in err) {
                if (err.hasOwnProperty(key)) {
                    console.log(err[key]);
                    userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: err[key].message });
                }
            }

            $scope.alerts = userMessages.getAlerts();

            // Scroll to errors:
            $anchorScroll('updateHikeErrors');
        },
    };

    //-----------------------------------//
    //-------- PAGE LOAD FUNCTIONS ------//
    //-----------------------------------//

    $scope.auth = function() {
        /*
        Authorize a user session, and if successful, set User with valid session to `$scope.user`.
        */

        console.log("Authorizing logged in user (and fetch them)...");
        userFactory.auth(cb.user);
    };

    // Run auth() on page load:
    $scope.auth();

    $scope.getHike = function() {
        /*
        Gets hike based upon current route parameter.
        */

        console.log("Getting current hike...", $routeParams.id);
        hikeFactory.getHike($routeParams.id, cb.hike);
    };

    //---------------------------//
    //-------- UPDATE HIKE ------//
    //---------------------------//

    $scope.updateHike = function() {
        /*
        Update a hike.
        */

        // Clear any old alerts:
        userMessages.clearAlerts();

        console.log("Starting hike update validation process...");

        hikeFactory.updateHike($scope.hike, cb.updatedHike, cb.updateHikeError);
    };

    //-----------------------------//
    //-------- ALERT ACTIONS ------//
    //-----------------------------//
    $scope.closeAlert = function(index) {
        /*
        Close an alert.

        Parameters:
        - `index` - Index value of success alert to be removed.
        */

        // Remove alert and update `$scope.successAlerts` to most recent:
        $scope.alerts = userMessages.removeAlert(index);
    };


}]);
