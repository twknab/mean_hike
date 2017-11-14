app.controller('postTripController', ['$scope', 'postTripFactory', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, postTripFactory, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
                $scope.scrollTo('top-posttrip');
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
        newPostTrip: function(validated) {
            /*
            Runs if post-trip is successfully created; returns to dashboard.

            Parameters:
            - `validated` - Returns validated object containing `messages` and `validatedPostTrip` properties. Also contains `errors` property but should be empty.
            */

            // Iterate through messages and add them to alerts:
            for (var key in validated.messages) {
                if (validated.messages.hasOwnProperty(key)) {
                    userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                }
            }

            $location.url('/dashboard');
            $scope.scrollTo('top');
        },
        newPostTripError: function(err) {
            /*
            Runs if errors are returned after `$scope.postTrip()` from the server.

            Parameters:
            - `err` - Errors object returned.
            */


            // Iterate through errors and add them to alerts:
            for (var key in err) {
                if (err.hasOwnProperty(key)) {
                    console.log(err[key]);
                    userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: err[key].message });
                }
            }

            $scope.alerts = userMessages.getAlerts();

            // Scroll to errors:
            $scope.scrollTo('top-posttrip');
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

        var hikeId = {
            id: $routeParams.id,
        };

        hikeFactory.getHike(hikeId, cb.hike);
    };

    //---------------------------------//
    //-------- ADD NEW POST-TRIP ------//
    //---------------------------------//

    $scope.addPostTrip = function() {
        /*
        Creates a new Post-Trip.
        */

        // Clear any old alerts:
        userMessages.clearAlerts();


        // If post-trip form is empty, run validation without sending hike ID (as it will fail for being empty):
        if (($scope.postTrip == undefined) || (Object.keys($scope.postTrip).length < 1)) {
            postTripFactory.newPostTrip($scope.postTrip, cb.newPostTrip, cb.newPostTripError);
        }

        else {
            // Else, add Hike ID to Post-Trip object for use on server:
            $scope.postTrip.hikeId = $routeParams.id;

            // Submit post trip for validation:
            postTripFactory.newPostTrip($scope.postTrip, cb.newPostTrip, cb.newPostTripError);
        }
    };

    //---------------------------------------//
    //------- ANGULAR UI DATE PICKER  -------//
    //---------------------------------------//
    $scope.today = function() {
      /*
      Sets date to today.
      */

      $scope.self = new Date();
    };

    $scope.clear = function() {
      /*
      Clears date.
      */

      $scope.self = null;
    };

    $scope.dateOptions = {
      /*
      Datepicker options.
      */

      showWeeks: true
    };

    $scope.startDate = function() {
      /*
      Opens start date popup.
      */

      $scope.starting_date.opened = true;
    };

    $scope.endDate = function() {
      /*
      Opens end date popup.
      */

      $scope.ending_date.opened = true;
    };

    $scope.starting_date = {
      /*
      Starting date datepicker closed by default.
      */

      opened: false
    };

    $scope.ending_date = {
      /*
      Ending date datepicker closed by default.
      */

      opened: false
    };


    //------------------------------//
    //------- ANCHOR SCROLL  -------//
    //------------------------------//

    $scope.scrollTo = function(htmlId) {
        /*
        Scrolls to an #id for an HTML element which is supplied.

        Parameters:
        - `htmlId` - HTML ID of element to scroll to.
        */

        $anchorScroll(htmlId);
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
