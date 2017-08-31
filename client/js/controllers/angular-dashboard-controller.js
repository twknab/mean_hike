app.controller('dashboardController', ['$scope', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {
    /*
    Sets up `dashboardController` to handle Dashboard related needs and page actions:

    Dependencies:
    - `$scope` - Angular scope object.
    - `dashboardFactory` - Angular factory which handles Dashboard API requests.
    - `userFactory` - Angular factory which handles User API requests.
    - `userMessages` - Angular service which handles user alert messages.
    - `$location` - Location provider service which gives us access to our application's URLs.
    - `$routeParams` - Angular service which allows you to retreive route parameters.

    Notes: This controller is used when viewing the Dashboard page after logging in, and when performing any dashboard actions.
    */

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    /*
    The callback functions below only runs if one of the $scope methods below utilizes a factory method. The callback is sent to the factory, and will run after the factory receives a response from the server API. Please see individual callback functions for how each work.
    */
    var cb = {
        // Sets $scope.user to retrieved logged in user:
        user: function(authValidation) {
            /*
            Runs after `$scope.auth()` completes; checks if session is valid, and if so sets `$scope.user` to authValidation User object.

            Parameters:
            - `authStatus` - An object returned from our factory, via a response from our API, containing the following properties:
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
                // Set User Data:
                $scope.user = authValidation.user;
                // Run getRecentHikes() on page load:
                $scope.getRecentHikes();
                // Get hikes needing pre-trips (for dropdown):
                $scope.getPreTripList();
                // Get any alerts:
                $scope.successAlerts = userMessages.getAlerts();
            }
        },
        welcomeSetFalse: function() {
            /*
            Set user's Welcome Message Status to false so welcome message is no longer displayed.
            */

            // Get a fresh copy of the User for Angular:
            $scope.auth();
        },
        hike: function(validated) {
            /*
            Runs after `$scope.addHike()` completes; shows proper messages and updates recent hikes.
            */

            // Clear form, old errors and any existing messages:
            $scope.newHikeErrors = {};
            $scope.newHike = {};
            userMessages.clearAlerts();

            // Check if any success messages sent, if so, iterate through the object and generate messages using `userMessages` service:
            if (Object.keys(validated.messages).length > 0) {
                // Send each message to the `userMessages` service to be added as an alert:
                for (var key in validated.messages) {
                    if (validated.messages.hasOwnProperty(key)) {
                        userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                    }
                }

                // Get alert messages:
                $scope.successAlerts = userMessages.getAlerts();
            }

            // Sets first accordian to open:
            $scope.status.isFirstOpen = true;
            // Closes new hike accordian:
            $scope.status.newHike = false;

            // Update recent hikes:
            $scope.getRecentHikes();

            // Update hikes needing pre-trips (for dropdown):
            $scope.getPreTripList();

            // Scroll to recent Hikes:
            $anchorScroll(recentHikes);


        },
        hikeError: function(err) {
            /*
            Runs after `$scope.addHike()` completes; clears form and updates recent hikes list.
            */

            // Reset any existing alerts
            $scope.successAlerts = userMessages.clearAlerts();
            $scope.newHikeErrors = {}; // resets errors if any already existing
            $scope.newHikeErrors = err;


        },
        recentHikes: function(UserAndHikes) {
            /*
            Runs after `$scope.recentHikes()` completes; updates scope variable to recent hikes.
            */

            $scope.recentHikes = UserAndHikes.hikes;
        },
        preTrip: function(PreTripHikes) {
            /*
            Runs after `$scope.startPreTrip()` completes; updates scope variable to hold hikes still waiting on a pre-trip.
            */

            // Set incomplete hikes list to retreived hikes:
            $scope.incompletePreTrips = PreTripHikes.hikes;
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

    $scope.getRecentHikes = function() {
        /*
        Get 3 most recent hikes for User.
        */

        hikeFactory.getRecent(cb.recentHikes);
    };

    $scope.getPreTripList = function() {
        /*
        Get any trips whom do not currently have a pre-trip created; this is used to generate data for the pre-trip dropdown.
        */

        hikeFactory.getPreTrip(cb.preTrip);
    };

    //----------------------------//
    //-------- ADD NEW HIKE ------//
    //----------------------------//

    /*
    Development note: I had to create an empty `newHike()` object below for my ng-model to take in the accordian.
    */

    // Create empty `newHike` object:
    $scope.newHike = {};

    $scope.addHike = function() {
        /*
        Create a new Hike, sending it off for validation and creation, or for errors to be returned:
        */

        hikeFactory.newHike($scope.newHike, cb.hike, cb.hikeError);
    };

    //--------------------------------//
    //-------- ADD NEW PRE-TRIP ------//
    //--------------------------------//

    /*
    The functions in this section assist in handling the pre-trip drop down.
    */

    $scope.startPreTrip = function(hikeId) {
        $location.url('/hikes/' + hikeId + '/pre-trip');
    };

    //-----------------------------------------//
    //------- ANGULAR UI ALERT ACTIONS  -------//
    //-----------------------------------------//

    // Generate a Welcome Alert:
    $scope.welcomeAlerts = [
        { type: 'info', hdr: 'Instructions:', msg: 'Add a New Hike below. Prepare for your trip by completing a Pre-Trip report. When you return, complete a Post-Trip report. View your full report to improve with each experience!' }
    ];

    $scope.closeWelcomeAlert = function(index) {
        /*
        Close welcome alert.

        Parameters:
        - `index` - Index value of alert to be removed.
        */

        $scope.welcomeAlerts.splice(index, 1);
    };

    $scope.welcomeMessageFalse = function() {
        /*
        Never show welcome message again.
        */

        // Runs `welcomeMessageFalse` factory method to send an API request and update the User's `welcomeMsgStatus` property to `false`:
        userFactory.welcomeMessageFalse(cb.welcomeSetFalse)
    };

    $scope.closeSuccessAlert = function(index) {
        /*
        Close a success alert.

        Parameters:
        - `index` - Index value of success alert to be removed.
        */

        // Remove alert and update `$scope.successAlerts` to most recent:
        $scope.successAlerts = userMessages.removeAlert(index);
    };


    //----------------------------------//
    //------ ANGULAR UI ACCORDIAN ------//
    //----------------------------------//
    /*
    The functions in this section store values that we'll use when defining our angular-ui accordian on our dashboard page.
    */

    // Set `one at a time` variable for Accordian to true so only one section displays at a time:
    $scope.oneAtATime = true;

    // Create a status object in which we'll hold accordian values to utilize on the dashboard page:
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false,
        newHike: false,
        newPreTrip: false,
    };

}]);
