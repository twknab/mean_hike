app.controller('preTripUpdateController', ['$scope', 'preTripFactory', 'userFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, preTripFactory, userFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
        // Get current pre-trip:
        $scope.getPreTrip();
      }
    },
    preTrip: function(retrievedPreTrip) {
      /*
      Runs after `$scope.getPreTrip()` completes; sets preTrip to retrieved preTrip.

      Parameters:
      - `retrievedPreTrip` - PreTrip object returned.
      */

      $scope.preTrip = retrievedPreTrip;

      // Get alert messages:
      $scope.alerts = userMessages.getAlerts();
    },
    updatedPreTrip: function(validated) {
      /*
      Runs if pre-trip is successfully updated; returns to dashboard.

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
    },
    updatePreTripError: function(err) {
      /*
      Runs if errors are returned after `$scope.updatePreTrip()` runs.

      Parameters:
      - `err` - Errors object returned.
      */

      // Add error class to any field who was returned with error:
      for (var key in err) {
        if (err.hasOwnProperty(key)) {

          // Uses jQlite (built-in) to grab DOM element and add a class:
          angular.element(document.querySelector('#' + key)).addClass('is-invalid').parent().after("<p class='margin-left-xsm err-msg'>" + err[key].message + "</p>");

        }
      };

      $scope.getPreTrip();

      // Scroll to errors:
      $anchorScroll($scope.alerts);
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

  $scope.getPreTrip = function() {
    /*
    Sends API request to get current pre-trip based on hike ID.
    */

    var hikeId = {
      id: $routeParams.id,
    }

    preTripFactory.getPreTrip(hikeId, cb.preTrip);
  };

  //-------------------------------//
  //-------- UPDATE PRE-TRIP ------//
  //-------------------------------//

  $scope.updatePreTrip = function() {
    /*
    Sends API request to validate and update a Pre-Trip by Id.
    */

    // Clear any old alerts:
    userMessages.clearAlerts();

    // Clear out any `is-invalid` error classes already existing from past submissions.
    // Note: This seems really ugly to me, and please, if you're reading this, help me find a more elegant solution! Help me! ☹️
    angular.element(document.querySelector('#updatePreTripForm')).children().children().children().children().removeClass('is-invalid');

    // Remove all error messages beneath flagged input fields:
    angular.element(document.querySelectorAll('.err-msg')).remove();

    preTripFactory.updatePreTrip($scope.preTrip, cb.updatedPreTrip, cb.updatePreTripError);
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
