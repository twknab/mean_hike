app.controller('allHikesController', ['$scope', 'hikeFactory', 'userFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, hikeFactory, userFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
        userMessages.addAlert({
          type: 'danger',
          hdr: 'Error!',
          msg: 'You must be logged in to view this page.'
        });
        // Redirect home:
        $location.url('/');
      } else {
        // Else clear alerts, set `$scope.user` to the validated user and remove the password property:
        // Clear out any existing user messages:
        userMessages.clearAlerts();
        // Set User Data:
        $scope.user = authValidation.user;
        // Get all hikes:
        $scope.getAllHikes();
        // Get stats:
        $scope.getStats();
      }
    },
    all: function(allHikes) {
      /*
      Runs after `$scope.getAllHikes()` completes; returns `allHikes` object which contains all hikes for user including all pre-trip and post-trip data, sorted by `updatedAt`.

      Parameters:
      - `allHikes` - An object returned from our factory, via a response from our API, containing all hikes.
      */

      $scope.hikes = allHikes;
    },
    stats: function(allStats) {
      /*
      Runs after `$scope.getStats()` completes; returns `allStats` object which contains all stats for completed hikes only. Returns `distance` and `gain` objects.

      Parameters:
      - `allStats` - An object returned from our factory containing `distance` and `gain` values.
      */

      // Setup stats object:
      $scope.stats = {};

      // Add stats value returned from server:
      $scope.stats.distance = allStats.distance;
      $scope.stats.gain = allStats.gain;
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

  $scope.auth();

  $scope.getAllHikes = function() {
    /*
    Gets all hikes for a user and if successful sets `$scope.hikes` to user's hikes.
    */

    hikeFactory.allHikes(cb.all);
  };

  $scope.getStats = function() {
    /*
    Gets all stats for stats section.
    */

    userFactory.getStats(cb.stats);
  };

}]);
