app.controller('dashboardController', ['$scope', 'dashboardFactory', 'userFactory', '$location', '$routeParams', function($scope, dashboardFactory, userFactory, $location, $routeParams) {

    // Callbacks
    var cb = {
        auth: function(authStatus) {
            if (!authStatus.status) {
                console.log('Session invalid.');
                // Redirect home:
                $location.url('/');
            } else {
                console.log('Session valid.');
                // Set User Data:
                $scope.user = authStatus.user;
                // Deletes password hash from front end
                delete $scope.user.password;
                // Get All Dashboard Data
                console.log("Dashboard loaded...");
            }
        },
        logout: function() {
            console.log("Redirecting home...");
            $location.url('/');
        },
        error: function(err) {
            console.log('Errors returned from server:', err);
            $scope.errors = err;
        },
    };

    // Authorize a User:
    $scope.auth = function() {
        userFactory.auth(cb.auth);
    };

    // Run Auth on Login:
    $scope.auth();

    // Load Homepage:
    $location.url('/dashboard');

    // Dashboard Alerts:
    $scope.alerts = [
        { type: 'info', hdr: 'What Now?', msg: 'Add a New Hike to queue up a new hike. Prep for your trip before you go, by ticking the box to initiate a Pre-Trip report. When you get back, tick the box again to fill out a Post-Trip report and to mark the hike completed. View a Hike Report to see all your info in one place.' }
    ];

    // Close Dashboard Alerts:
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
    };

    // Logout User:
    $scope.logout = function() {
        console.log('Login Process: Ang Controller running...data submitted:', $scope.user);
        userFactory.logout(cb.logout);
    };

}]);
