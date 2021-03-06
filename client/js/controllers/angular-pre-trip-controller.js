app.controller('preTripController', ['$scope', 'preTripFactory', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, preTripFactory, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
        // Get current hike:
        $scope.getHike();
        $scope.scrollTo('top-pretrip');
      }
    },
    hike: function(retrievedHike) {
      /*
      Runs after `$scope.getHike()` completes; sets hike to retrieved hike.

      Parameters:
      - `retrievedHike` - Hike object returned.
      */

      $scope.hike = retrievedHike;

      // Get alert messages:
      $scope.alerts = userMessages.getAlerts();
    },
    newPreTrip: function(validated) {
      /*
      Runs if pre-trip is successfully created; returns to dashboard.

      Parameters:
      - `validated` - Returns validated object cotaning `messages` and `validatedPreTrip` properties. Also contains `errors` property but should be empty.
      */

      for (var key in validated.messages) {
        if (validated.messages.hasOwnProperty(key)) {
          userMessages.addAlert({
            type: 'success',
            hdr: validated.messages[key].hdr,
            msg: validated.messages[key].msg
          });
        }
      }

      $scope.scrollTo('top');
      $location.url('/dashboard');
    },
    newPreTripError: function(err) {
      /*
      Runs if errors are returned after `$scope.preTrip()` from the server.

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

      $scope.alerts = userMessages.getAlerts();

      // Scroll to errors:
      $scope.scrollTo('top-pretrip');
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

  $scope.getHike = function() {
    /*
    Gets hike based upon current route parameter.
    */

    var hikeId = {
      id: $routeParams.id,
    };

    hikeFactory.getHike(hikeId, cb.hike);
  };

  $scope.groupSizes = [{
      size: 'Solo Hike',
      description: 'Solo Hike',
    },
    {
      size: '2-3 people',
      description: '2-3 people',
    },
    {
      size: '4-5 people',
      description: '4-5 people',
    },
    {
      size: '6+ people',
      description: '6+ people',
    }
  ];

  //--------------------------------//
  //-------- ADD NEW PRE-TRIP ------//
  //--------------------------------//

  $scope.addPreTrip = function() {
    /*
    Creates a new Pre-Trip.
    */

    // Clear any old alerts:
    userMessages.clearAlerts();

    // Clear out any `is-invalid` error classes already existing from past submissions.
    // Note: This seems really ugly to me, and please, if you're reading this, help me find a more elegant solution! Help me! ☹️
    angular.element(document.querySelector('#addPreTripForm')).children().children().children().children().removeClass('is-invalid');

    // Remove all error messages beneath flagged input fields:
    angular.element(document.querySelectorAll('.err-msg')).remove();

    if (($scope.preTrip == undefined) || (Object.keys($scope.preTrip).length < 1)) {
      preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
    } else {
      // Add Hike ID to Pre-Trip object for use on server:
      $scope.preTrip.hikeId = $routeParams.id;

      preTripFactory.newPreTrip($scope.preTrip, cb.newPreTrip, cb.newPreTripError);
    }
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
