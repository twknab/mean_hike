app.controller('postTripUpdateController', ['$scope', 'postTripFactory', 'userFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, postTripFactory, userFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
        // Get current post-trip:
        $scope.getPostTrip();
      }
    },
    postTrip: function(retrievedPostTrip) {
      /*
      Runs after `$scope.getPostTrip()` completes; sets postTrip to retrieved postTrip.

      Parameters:
      - `retrievedPostTrip` - PreTrip object returned.
      */

      $scope.postTrip = retrievedPostTrip;
      $scope.setDate(retrievedPostTrip.start_date, retrievedPostTrip.end_date);

      // Get alert messages:
      $scope.alerts = userMessages.getAlerts();
    },
    updatedPostTrip: function(validated) {
      /*
      Runs if post-trip is successfully updated; returns to dashboard.

      Parameters:
      - `validated` - Returns validated object containing any success messages as 'messages' object.
      */

      // Iterate through success msgs and add them:
      for (var key in validated.messages) {
        if (validated.messages.hasOwnProperty(key)) {
          console.log(validated.messages[key]);
          userMessages.addAlert({
            type: 'success',
            hdr: validated.messages[key].hdr,
            msg: validated.messages[key].msg
          });
        }
      }

      $location.url('/dashboard');
      $scope.scrollTo('top');
    },
    updatePostTripError: function(err) {
      /*
      Runs if errors are returned after `$scope.updatePostTrip()` runs.

      Parameters:
      - `err` - Errors object returned.
      */


      for (var key in err) {
        if (err.hasOwnProperty(key)) {
          userMessages.addAlert({
            type: 'danger',
            hdr: 'Error!',
            msg: err[key].message
          });
        }
      }

      $scope.getPostTrip();

      // Scroll to errors:
      $scope.scrollTo('top-update-posttrip');
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

  $scope.getPostTrip = function() {
    /*
    Sends API request to get current post-trip based on hike ID.
    */

    var hikeId = {
      id: $routeParams.id,
    }

    postTripFactory.getPostTrip(hikeId, cb.postTrip);
  };

  //--------------------------------//
  //-------- UPDATE POST-TRIP ------//
  //--------------------------------//

  $scope.updatePostTrip = function() {
    /*
    Sends API request to validate and update a Post-Trip by Id.
    */

    // Clear any old alerts:
    userMessages.clearAlerts();

    postTripFactory.updatePostTrip($scope.postTrip, cb.updatedPostTrip, cb.updatePostTripError);
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

  $scope.setDate = function(start, end) {
    $scope.postTrip.start_date = new Date(start);
    $scope.postTrip.end_date = new Date(end);
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
