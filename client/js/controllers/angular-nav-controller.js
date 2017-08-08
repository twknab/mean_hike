app.controller('navController', ['$scope', 'userFactory', 'userMessages', '$location', '$routeParams', function($scope, userFactory, userMessages, $location, $routeParams) {
    /*
    Sets up `navController` to handle logged-in User dashboard-side navigation actions:

    Dependencies:
    - `$scope` - Angular scope object.
    - `userFactory` - Angular factory which handles User API requests.
    - `userMessages` - Angular service which handles user alert messages.
    - `$location` - Location provider service which gives us access to our application's URLs.
    - `$routeParams` - Angular service which allows you to retreive route parameters.

    Notes: This controller is primarily for dashboard-side navigations. Users must be logged in with a valid session in order to perform any of these actions. Please see comments in the individual functions below to better understand how they work.
    */

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    /*
    The callback functions below only runs if one of the $scope methods below utilizes a factory method. The callback is sent to the factory, and will run after the factory receives a response from the server API. Please see individual callback functions for how each work.
    */
    var cb = {
        auth: function(authStatus) {
            /*
            Runs after `$scope.auth()` function completes, ensuring a user is authorized before setting `$scope.user` to retrieved user.

            Parameters:
            - `authStatus` - An object returned from our factory, via a response from our API, containing the following properties:
                - `status` - a `true` or `false` value of session validity.
                - `authStatus` - an object containing the User object, if the session is validated.
            */

            if (!authStatus.status) {
                console.log('Session invalid.');
                // Clear out any existing message alerts using `userMessages` service:
                userMessages.clearAlerts();
                // Send a logout success message using `userMessages` service:
                userMessages.addAlert({ type: 'danger', hdr: 'Error!', msg: 'You must be logged in to view this page.' });
                // Redirect home:
                $location.url('/');
            } else {
                console.log('Session valid.', authStatus.user);
                // Set User Data:
                $scope.user = authStatus.user;
                // Deletes password hash from front end
                delete $scope.user.password;
            }
        },
        logout: function() {
            /*
            Runs after `$scope.logout()` function completes; redirects to index.
            */

            console.log("Redirecting home...");
            // Clear out any existing message alerts:
            userMessages.clearAlerts();
            // Send a logout success message:
            userMessages.addAlert({ type: 'success', hdr: 'Logout Success!', msg: 'You\'ve been successfully logged out.' });
            // Redirects home (login/registration page):
            $location.url('/');
        },
    };

    //----------------------------------//
    //---------- AUTHORIZE USER --------//
    //----------------------------------//
    /*
    Development Note: Presently, we run a quick session check to authorize our user before making any navigation actions available to them. This strategy may be altered in the future as I button up security within most API routes themselves, however this functionality may be preserved in order to validate any navigation actions which do not communicate with the server (ie, scope methods that run the $location service only, without pinging the API routes for data).
    */

    $scope.auth = function() {
        /*
        Authorize a user prior to setting `$scope.user`.
        */

        console.log("Authorizing user...");
        // Run `auth` factory method and pass in the `auth` callback function above to run when complete:
        userFactory.auth(cb.auth);
    };
    // Run Authorize function on Login:
    $scope.auth();

    //--------------------------------//
    //---------- NAVIGATION ----------//
    //--------------------------------//

    $scope.userAccount = function(username) {
        /*
        Loads User account page.

        Parameters:
        - `username` - a valid username of whose account to display.
        */

        console.log('Loading User Account...');
        $location.url('/account/' + username);
    };

    $scope.home = function() {
        /*
        Loads dashboard page.
        */

        $location.url('/dashboard');
    };

    $scope.recentHikes = function() {
        /*
        Opens recent hikes accordian when clicking `Recent Hikes` from dashboard top navigation.
        */

        // Sets first accordian to open:
        $scope.status.isFirstOpen = true;
        // Closes new hike accordian:
        $scope.status.newHike = false;
    };

    $scope.newHike = function() {
        /*
        Opens new hike accordian when clicking `New Hike` from dashboard top navigation.
        */

        $scope.status.newHike = true;
    };

    $scope.newPreTrip = function() {
        /*
        Opens pre-trip accordian when clicking `New Pre-Trip` from top dashboard navigation.
        */

        $scope.status.newPreTrip = true;
    };

    $scope.logout = function() {
        /*
        Log out a user when clicking `Logout` from top navigation.
        */

        console.log('Logout process starting...', $scope.user);
        // Run `logout` factory method, passing in `logout` callback above to run when complete:
        userFactory.logout(cb.logout);
    };

}]);
