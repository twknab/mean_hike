app.controller('hikeController', ['$scope', 'hikeFactory', 'userFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, hikeFactory, userFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
                // Get Hike:
                $scope.getHike();

            }
        },
        hike: function(hike) {
            /*
            Runs after `$scope.getHike()` completes; returns `hike` object which contains all hike data including pre-trip and post-trip data, sorted by `updatedAt`.

            Parameters:
            - `hike` - An object returned from our factory, via a response from our API, containing all hikes.
            */

            console.log("Hike returned to controller:", hike);
            $scope.hike = hike;

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

    $scope.auth();

    $scope.getHike = function() {
        /*
        Get current hike (by route parameter) and return it (including pre and post-trip data).
        */

        console.log("Getting hike process started....");
        hikeFactory.getHike($routeParams.id, cb.hike);
    };

    //---------------------------//
    //-------- PAGE ACTIONS------//
    //---------------------------//

    $scope.startPreTrip = function(hikeId) {
        console.log('Starting pre-trip process...');
        $location.url('/hikes/' + hikeId + '/pre-trip');
    };

    $scope.startPostTrip = function(hikeId) {
        console.log('Starting post-trip process...');
        $location.url('/hikes/' + hikeId + '/post-trip');
    };



}]);
