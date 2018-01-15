app.controller('hikeUpdateController', ['$scope', 'userFactory', 'hikeFactory', 'userMessages', '$location', '$routeParams', '$anchorScroll', function($scope, userFactory, hikeFactory, userMessages, $location, $routeParams, $anchorScroll) {

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
        // Clear out any existing user messages:
        userMessages.clearAlerts();
        // Set User Data:
        $scope.user = authValidation.user;
        // Get current hike:
        $scope.getHike();
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
    updatedHike: function(validated) {
      /*
      Runs if hike updates successfully; returns to dashboard.

      Parameters:
      - `validated` - Object returned from API request containing a `messages` object, which contains any success messages.
      */

      // Iterate through messages and add them to alerts:
      for (var key in validated.messages) {
        if (validated.messages.hasOwnProperty(key)) {
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
    updateHikeError: function(err) {
      /*
      Runs if errors are returned after `$scope.updateHike()`.

      Parameters:
      - `err` - Errors object returned.
      */


      /*
      Note: The below is commented out but ought to be changed to alert the user nothing has been changed (rather than errors, as these are now handled via highlighted fields).
      */

      // Iterate through errors and add them to alerts:
      // for (var key in err) {
      //   if (err.hasOwnProperty(key)) {
      //     userMessages.addAlert({
      //       type: 'danger',
      //       hdr: 'Error!',
      //       msg: err[key].message
      //     });
      //   }
      // }

      // Add error class to any field who was returned with error:
      for (var key in err) {
        if (err.hasOwnProperty(key)) {

          // Uses jQlite (built-in) to grab DOM element and add a class:
          angular.element(document.querySelector('#' + key)).addClass('is-invalid').parent().after("<p class='margin-left-xsm err-msg'>" + err[key].message + "</p>");

        }
      };

      $scope.getHike();

      // Scroll to errors:
      $scope.scrollTo('top-update-hike');
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

  //---------------------------//
  //-------- UPDATE HIKE ------//
  //---------------------------//

  $scope.updateHike = function() {
    /*
    Update a hike.
    */

    // Clear any old alerts:
    userMessages.clearAlerts();

    // Clear out any `is-invalid` error classes already existing from past submissions.
    // Note: This seems really ugly to me, and please, if you're reading this, help me find a more elegant solution! Help me! ☹️
    angular.element(document.querySelector('#updateHikeForm')).children().children().children().removeClass('is-invalid');

    // Remove all error messages beneath flagged input fields:
    angular.element(document.querySelectorAll('.err-msg')).remove();

    hikeFactory.updateHike($scope.hike, cb.updatedHike, cb.updateHikeError);
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
