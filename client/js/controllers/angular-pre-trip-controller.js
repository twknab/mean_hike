app.controller('preTripController', ['$scope', 'preTripFactory', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, preTripFactory, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
                // Clear out any existing message alerts using `userMessages` service:
                userMessages.clearAlerts();
                // Send a logout success message using `userMessages` service:
                userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: 'You must be logged in to view this page.' });
                // Redirect home:
                $location.url('/');
            } else {
                // Else clear alerts, set `$scope.user` to the validated user and remove the password property:
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

            $scope.hike = retrievedHike;

            // Get alert messages:
            $scope.alerts = userMessages.getAlerts();
        },
        newPreTrip: function(validated) {
            /*
            Runs if pre-trip is successfully created; returns to dashboard.

            Parameters:
            - `validated` - Returns validated object cotaning `messages` and `validatedPreTrip` properties. Also contains `errors` property but should be empty.
            */

            for (var key in validated.messages) {
                if (validated.messages.hasOwnProperty(key)) {
                    console.log(validated.messages[key]);
                    userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                }
            }

            $location.url('/dashboard');
        },
        newPreTripError: function(err) {
            /*
            Runs if errors are returned after `$scope.preTrip()` from the server.

            Parameters:
            - `err` - Errors object returned.
            */


            for (var key in err) {
                if (err.hasOwnProperty(key)) {
                    userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: err[key].message });
                }
            }

            $scope.alerts = userMessages.getAlerts();

            // Scroll to errors:
            $anchorScroll('preTripReport');
        },
    };

    //-----------------------------------//
    //-------- PAGE LOAD FUNCTIONS ------//
    //-----------------------------------//

    $scope.auth = function() {
        /*
        Authorize a user session, and if successful, set User with valid session to `$scope.user`.
        */

        userFactory.auth(cb.user);
    };

    // Run auth() on page load:
    $scope.auth();

    $scope.getHike = function() {
        /*
        Gets hike based upon current route parameter.
        */

        hikeFactory.getHike($routeParams.id, cb.hike);
    };

    $scope.groupSizes = [
        {
            size: 'Solo Hike',
            description: 'Solo Hike',
        },
        {
            size: '2-3 people',
            description: '2-3 people',
        },
        {
            size: '4-5 people',
            description: '4-5 people',
        },
        {
            size: '6+ people',
            description: '6+ people',
        }
    ];

    //--------------------------------//
    //-------- ADD NEW PRE-TRIP ------//
    //--------------------------------//

    $scope.addPreTrip = function() {
        /*
        Creates a new Pre-Trip.
        */

        // Clear any old alerts:
        userMessages.clearAlerts();



        if (($scope.preTrip == undefined) || (Object.keys($scope.preTrip).length < 1)) {
            preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
        }

        else {
            // Add Hike ID to Pre-Trip object for use on server:
            $scope.preTrip.hikeId = $routeParams.id;
            preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
        }
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
