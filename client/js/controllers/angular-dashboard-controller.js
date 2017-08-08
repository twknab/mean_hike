app.controller('dashboardController', ['$scope', 'dashboardFactory', 'userFactory', 'userMessages', '$location', '$routeParams', function($scope, dashboardFactory, userFactory, userMessages, $location, $routeParams) {
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
        user: function(auth) {
            /*
            Runs after `$scope.getUser` completes; checks if session is valid, and if so sets `$scope.user` to validated User object.

            Parameters:
            - `auth` - An authorization object containing (1) a `status` property containing `true` or `false` in regards to authorization status, and (2) a `user` property will contain the validated User object.
            */

            // If authorization status is false, redirect to index:
            if (!auth.status) {
                console.log('Session invalid.');
                // Redirect home:
                $location.url('/');
            } else {
                // Else clear alerts, set `$scope.user` to the validated user and remove the password property:
                console.log('Session valid.', auth.user);
                // Clear out any existing user messages:
                userMessages.clearAlerts();
                // Set User Data:
                $scope.user = auth.user;
                // Deletes password hash from front end
                delete $scope.user.password;
            }
        },
        welcomeSetFalse: function() {
            /*
            Set user's Welcome Message Status to false so welcome message is no longer displayed.
            */

            console.log("Attempting to reload page...");
            // Get a fresh copy of the User for Angular:
            $scope.getUser();
        },
    };

    //----------------------------------//
    //---------- AUTHORIZE USER --------//
    //----------------------------------//

    $scope.getUser = function() {
        /*
        Gets validated User based upon session and runs `cb.user` callback afterwards.
        */

        console.log("Get logged in user...");
        userFactory.auth(cb.user);
    };

    // Run getUser() on login:
    $scope.getUser();

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
