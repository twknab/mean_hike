/*
    Note: This controller is used only for dashboard-side, session-validated,
    users. This controller initially checks for a valid session, and sends to
    the index if not valid. If valid, any number of nav functions are available,
    all of which are used on various logged-in pages.
*/


app.controller('navController', ['$scope', 'dashboardFactory', 'userFactory', '$location', '$routeParams', function($scope, dashboardFactory, userFactory, $location, $routeParams) {

    //----------------------------------//
    //-------- CALLBACK FUNCTIONS ------//
    //----------------------------------//
    var cb = {
        // Check for valid session, else direct home:
        auth: function(authStatus) {
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
        // Loads Login/Registration Page:
        logout: function() {
            console.log("Redirecting home...");
            $location.url('/');
        },
    };

    //----------------------------------//
    //---------- AUTHORIZE USER --------//
    //----------------------------------//

    // Authorize a User:
    $scope.auth = function() {
        console.log("Authorizing user...");
        userFactory.auth(cb.auth);
    };

    // Run Auth on Login:
    $scope.auth();

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

}]);
