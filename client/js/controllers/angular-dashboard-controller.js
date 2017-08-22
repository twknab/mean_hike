app.controller('dashboardController', ['$scope', 'dashboardFactory', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, dashboardFactory, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {
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
                // Run getRecentHikes() on page load:
                $scope.getRecentHikes();
                // Get hikes needing pre-trips (for dropdown):
                $scope.getPreTripList();
            }
        },
        welcomeSetFalse: function() {
            /*
            Set user's Welcome Message Status to false so welcome message is no longer displayed.
            */

            console.log("Attempting to reload page...");
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
                console.log("Messages found.");

                // Send each message to the `userMessages` service to be added as an alert:
                for (var key in validated.messages) {
                    if (validated.messages.hasOwnProperty(key)) {
                        console.log(validated.messages[key]);
                        userMessages.addAlert({ type: 'success', hdr: validated.messages[key].hdr, msg: validated.messages[key].msg });
                    }
                }

                // Get alert messages:
                $scope.successAlerts = userMessages.getAlerts();
                console.log($scope.successAlerts);
            }

            // Sets first accordian to open:
            $scope.status.isFirstOpen = true;
            // Closes new hike accordian:
            $scope.status.newHike = false;

            // Get recent hikes again:
            $scope.getRecentHikes();

            // Scroll to recent Hikes:
            $anchorScroll(recentHikes);


        },
        hikeError: function(err) {
            /*
            Runs after `$scope.addHike()` completes; clears form and updates recent hikes list.
            */

            console.log("Errors from server attemping to create new Hike...", err);
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
            console.log($scope.recentHikes);
        },
        preTrip: function(PreTripHikes) {
            /*
            Runs after `$scope.startPreTrip()` completes; updates scope variable to hold hikes still waiting on a pre-trip.
            */

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

        console.log("Authorizing logged in user (and fetch them)...");
        userFactory.auth(cb.user);
    };

    // Run auth() on page load:
    $scope.auth();

    $scope.getRecentHikes = function() {
        /*
        Get 3 most recent hikes for User.
        */

        console.log("Getting 3 most recent hikes...");
        hikeFactory.getRecent(cb.recentHikes);
    };

    $scope.getPreTripList = function() {
        /*
        Get any trips whom do not currently have a pre-trip created; this is used to generate data for the pre-trip dropdown.
        */

        console.log("Getting hikes still needing a pre-trip....");
        hikeFactory.getPreTrip(cb.preTrip);
    };



    //----------------------------//
    //-------- ADD NEW HIKE ------//
    //----------------------------//

    /*
    Development note: attempting to create the model `newHike` below, via `ng-model="newHike.name"` for example, within the angular-ui accordian template was not taking. This was odd as defining the model simply in the template seemed to work in my login/registration angular controllers (I didn't have to first create an empty object.) Perhaps because this form is nested inside of an angular-ui accordian, there is something within the digest cycle that I do not understand. This all being said, simply defining the empty object `newHike` below resolved my model not sending data.
    */

    // Create empty `newHike` object:
    $scope.newHike = {};

    $scope.addHike = function() {
        /*
        Create a new Hike, sending it off for validation and creation, or for errors to be returned:
        */

        console.log('Attempting to validate and create new Hike...Data submitted:', $scope.newHike);
        hikeFactory.newHike($scope.newHike, cb.hike, cb.hikeError);
    };

    //--------------------------------//
    //-------- ADD NEW PRE-TRIP ------//
    //--------------------------------//

    /*
    The functions in this section assist in handling the pre-trip drop down.
    */

    $scope.startPreTrip = function(selectedHike) {
        console.log('Starting pre-trip process...');
        console.log(selectedHike);
        console.log('//////////-------///////////');
    };

    //-----------------------------------------//
    //------- ANGULAR UI ALERT ACTIONS  -------//
    //-----------------------------------------//

    // Generate a Welcome Alert:
    $scope.weclomeAlerts = [
        { type: 'info', hdr: 'What Now?', msg: 'Add a New Hike to queue up a new hike. Prep for your trip before you go, by ticking the box to initiate a Pre-Trip report. When you get back, tick the box again to fill out a Post-Trip report and to mark the hike completed. View a Hike Report to see all your info in one place.' }
    ];

    $scope.closeWelcomeAlert = function(index) {
        /*
        Close welcome alert.

        Parameters:
        - `index` - Index value of alert to be removed.
        */

        // Remove alert and update `$scope.successAlerts` to most recent:
        $scope.successAlerts = userMessages.removeAlert(index);
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
