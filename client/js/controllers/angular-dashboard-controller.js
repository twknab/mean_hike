app.controller('dashboardController', ['$scope', 'dashboardFactory', 'userFactory', '$location', '$routeParams', function($scope, dashboardFactory, userFactory, $location, $routeParams) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        // Sets $scope.user to retrieved logged in user:
        user: function(authStatus) {
            if (!authStatus.status) {
                console.log('Session invalid.');
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
        // Sets Welcome Alert to False (Never Display Again):
        welcomeSetFalse: function() {
            console.log("Attempting to reload page...");
            // Get a fresh copy of the user on angular's side:
            $scope.getUser();
        },
        // Loads Login/Registration Page:
        logout: function() {
            console.log("Redirecting home...");
            $location.url('/');
        },
        // // Displays any Errors:
        // error: function(err) {
        //     console.log('Errors returned from server:', err);
        //     $scope.errors = err;
        // },
    };

    //----------------------------------//
    //---------- AUTHORIZE USER --------//
    //----------------------------------//

    // Get Logged In a User:
    $scope.getUser = function() {
        console.log("Get logged in user...");
        userFactory.auth(cb.user);
    };

    // Run Auth on Login:
    $scope.getUser();

    //--------------------------------//
    //---------- NAVIGATION ----------//
    //--------------------------------//

    // View User Account:
    $scope.userAccount = function(username) {
        console.log('Loading User Account...');
        console.log(username);
        $location.url('/account/' + username);
    };

    // Load Dashboard:
    $scope.home = function() {
        $location.url('/dashboard');
    };

    // Recent Hikes Top Navigation -- Open Recent Hikes Accordian:
    $scope.recentHikes = function() {
        $scope.status.isFirstOpen = true;
        $scope.status.newHike = false;
    };

    // New Hike Top Navigation -- Open New Hike Accordian:
    $scope.newHike = function() {
        $scope.status.newHike = true;
    };

    // New Pre-Trip Navigation -- Open New Pre-Trip Accordian:
    $scope.newPreTrip = function() {
        $scope.status.newPreTrip = true;
    };

    // Logout User:
    $scope.logout = function() {
        console.log('Login Process: Ang Controller running...data submitted:', $scope.user);
        userFactory.logout(cb.logout);
    };


    //-----------------------------------------//
    //------- ANGULAR UI ALERT ACTIONS  -------//
    //-----------------------------------------//

    // Dashboard Alerts:
    $scope.alerts = [
        { type: 'info', hdr: 'What Now?', msg: 'Add a New Hike to queue up a new hike. Prep for your trip before you go, by ticking the box to initiate a Pre-Trip report. When you get back, tick the box again to fill out a Post-Trip report and to mark the hike completed. View a Hike Report to see all your info in one place.' }
    ];

    // Close Dashboard Alerts:
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    // Set Welcome Messaeg Preference to False:
    $scope.welcomeMessageFalse = function() {
        userFactory.welcomeMessageFalse(cb.welcomeSetFalse)
    };


    //----------------------------------//
    //------ ANGULAR UI ACCORDIAN ------//
    //----------------------------------//

    // Angular UI Accordian - Open One at a Time Variable:
    $scope.oneAtATime = true;

    // Accordian Status Variables:
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false,
        newHike: false,
        newPreTrip: false,
    };


}]);
