app.controller('preTripController', ['$scope', 'preTripFactory', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, preTripFactory, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

    // Callbacks
    var cb = {
        // Sets $scope.user to retrieved logged in user:
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
                // Deletes password hash from front end
                delete $scope.user.password;
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

            console.log('Successfully retrieved hike...', retrievedHike);
            $scope.hike = retrievedHike;
        },
        newPreTrip: function(preTrip) {
            /*
            Runs if pre-trip is successfully created; returns to dashboard.

            Parameters:
            - `preTrip` - PreTrip object returned.
            */

            $location.url('/dashboard');
        },
        newPreTripError: function(err) {
            /*
            Runs if errors are returned after `$scope.preTrip()` from the server.

            Parameters:
            - `err` - Errors object returned.
            */

            console.log('Errors returned from server when trying to create pre-trip:', err);
            // Scroll to errors:
            // $location.hash('preTripReport');
            // Reset any existing errors:
            $scope.newPreTripErrors = {};
            // Set errors to whatever is returned:
            $scope.newPreTripErrors = err;

            $anchorScroll(BIG_ERRORS);
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

    //--------------------------------//
    //-------- ADD NEW PRE-TRIP ------//
    //--------------------------------//

    $scope.addPreTrip = function() {
        /*
        Creates a new pretrip.
        */

        console.log("Starting new pre-trip validation process...");

        if (($scope.preTrip == undefined) || (Object.keys($scope.preTrip).length < 1)) {
            preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
        }

        else {
            // Add Hike ID to Pre-Trip object for use on server:
            $scope.preTrip.hikeId = $routeParams.id;

            console.log('^%^%^%^%^%^%^%^%^%^%^%^%^');
            console.log('ROUTE ID', $routeParams.id);
            console.log('PreTrip', $scope.preTrip);
            console.log('^%^%^%^%^%^%^%^%^%^%^%^%^');

            preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
        }


    };

}]);
