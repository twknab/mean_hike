app.controller('navController', ['$scope', 'userFactory', 'hikeFactory', 'preTripFactory', 'postTripFactory', 'userMessages', '$location', '$routeParams', '$window', '$route', '$anchorScroll', function($scope, userFactory, hikeFactory, preTripFactory, postTripFactory, userMessages, $location, $routeParams, $window, $route, $anchorScroll) {
  /*
  Sets up `navController` to handle logged-in User dashboard-side navigation actions (including some page actions which navigate to other pages):

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
      Runs after `$scope.auth()` completes; checks if session is valid, and if so sets `$scope.user` to authValidation User object.

      Parameters:
      - `authStatus` - An object returned from our factory, via a response from our API, containing the following properties:
          - `status` - a `true` or `false` value of session validity.
          - `user` - an object containing the User object, if the session is validated.
      */

      if (!authStatus.status) {
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
        // Set User Data:
        $scope.user = authStatus.user;
      }
    },
    hikeDestroyed: function() {
      /*
      Runs after `$scope.deleteHike()` successfully completes.
      */

      userMessages.addAlert({
        type: 'success',
        hdr: 'Deleted!',
        msg: 'Your hike has been deleted.',
      });
      $location.url('/dashboard');
      $scope.scrollTo('top');
      $route.reload();
    },
    preTripDestroyed: function() {
      /*
      Runs after `$scope.deletePreTrip()` successfully completes.
      */

      userMessages.addAlert({
        type: 'success',
        hdr: 'Deleted!',
        msg: 'Your pre-trip has been deleted.',
      });
      $location.url('/dashboard');
      $scope.scrollTo('top');
      $route.reload();
    },
    postTripDestroyed: function() {
      /*
      Runs after `$scope.deletePostTrip()` successfully completes.
      */

      userMessages.addAlert({
        type: 'success',
        hdr: 'Deleted!',
        msg: 'Your post-trip has been deleted.',
      });
      $location.url('/dashboard');
      $scope.scrollTo('top');
      $route.reload();
    },
    logout: function() {
      /*
      Runs after `$scope.logout()` function completes; redirects to index.
      */

      // Clear out any existing message alerts:
      userMessages.clearAlerts();
      // Send a logout success message:
      userMessages.addAlert({
        type: 'success',
        hdr: 'Logout Success!',
        msg: 'You\'ve been successfully logged out.'
      });
      // Redirects home (login/registration page):
      $location.url('/');
      $scope.scrollTo('top');
    },
  };

  //---------------------------------------//
  //---------- NAVBAR LOAD ACTIONS --------//
  //---------------------------------------//

  $scope.auth = function() {
    /*
    Authorize a user session, and if successful, set User with valid session to `$scope.user`.
    */

    // Run `auth` factory method passing in the `auth` callback function above to run when complete:
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

    $location.url('/account/' + username);
    $scope.scrollTo('top');
  };

  $scope.home = function() {
    /*
    Loads dashboard page.
    */

    // Clear any messages:
    userMessages.clearAlerts();
    $location.url('/dashboard');
    $scope.scrollTo('top');
  };

  $scope.newHike = function() {
    /*
    Opens new hike accordian when clicking `+ Hike` from dashboard top navigation.
    */

    $scope.status.newHike = true;
    $scope.scrollTo('top-new-hike');
  };

  $scope.recentHikes = function() {
    /*
    Opens new Recent accordian when clicking `Recent Hikes` from dashboard top navigation.
    */

    $scope.status.isFirstOpen = true;
    $scope.scrollTo('top-recent-hikes')
  };

  $scope.viewHike = function(id) {
    /*
    Takes user to View Hike page.

    Parameters:
    - `id` - Id of hike to view.
    */

    $location.url('/hikes/' + id);
    $scope.scrollTo('top');
  };

  $scope.scrollHike = function() {
    /*
    Scrolls to hike when viewing Hike, Post or Pre Trip pages.
    */
    $scope.scrollTo('top-hike');
  };

  $scope.editHike = function(id) {
    /*
    Take user to Update Hike page.

    Parameters:
    - `id` - Id of hike to edit.
    */

    $location.url('/hikes/' + id + '/edit');
    $scope.scrollTo('top');
  };

  $scope.deleteHike = function(id) {
    /*
    Delete a hike and all pre-trips and post-trips associated with it.

    Parameters:
    - `id` - Id of hike to completely destroy.
    */

    // Delete any existing alerts:
    userMessages.clearAlerts();

    var confirm = $window.confirm('Are you sure you want to permanently delete this hike? Note: Any associated pre-trip or post-trip reports will also be permanently deleted.');

    if (confirm) {
      var hikeId = {
        id: id,
      }
      hikeFactory.destroyHike(hikeId, cb.hikeDestroyed);
    }
  };

  $scope.viewAllHikes = function() {
    /*
    Views all Hikes.
    */

    $location.url('/hikes');
    $scope.scrollTo('top');
  };


  $scope.newPreTrip = function() {
    /*
    Opens new Pre-Trip accordian when clicking `+ Pre-Trip` from dashboard top navigation.
    */

    $scope.status.newPreTrip = true;
    $scope.scrollTo('top-new-prerip');
  };

  $scope.preTrip = function() {
    /*
    Loads current pre-trip page user is working on (for navigation purposes on Pre-Trip page).
    */

    $location.url('/hikes/' + $routeParams.id + '/pre-trip');
    $scope.scrollTo('top-pre-trip');
  };

  $scope.scrollPreTrip = function() {
    /*
    Scrolls to PreTrip when viewing Hike, Post or Pre Trip pages.
    */

    $scope.scrollTo('top-pretrip');
  };


  $scope.editPreTrip = function() {
    /*
    Loads edit pre-trip page.
    */

    $location.url('/hikes/' + $routeParams.id + '/pre-trip/edit');
    $scope.scrollTo('top');
  };

  $scope.deletePreTrip = function(hikeId, preTripId) {
    /*
    Deletes a pre-trip based on id.

    Parameters:
    - `hikeId` - Id of hike to delete pre-trip from.
    - `preTripId` - Id of pre-trip to delete
    */

    // Delete any existing alerts:
    userMessages.clearAlerts();

    var confirm = $window.confirm('Are you sure you want to permanently delete this pre-trip?');

    if (confirm) {
      var ids = {
        hikeId: hikeId,
        preTripId: preTripId,
      }
      preTripFactory.destroyPreTrip(ids, cb.preTripDestroyed);
    }
  };

  $scope.postTrip = function() {
    /*
    Loads current post-trip page user is working on (for navigation purposes on Post-Trip page).
    */

    $location.url('/hikes/' + $routeParams.id + '/post-trip');
    $scope.scrollTo('top');
  };

  $scope.scrollPostTrip = function() {
    /*
    Scrolls to PostTrip when viewing Hike, Post or Pre Trip pages.
    */

    $scope.scrollTo('top-posttrip');
  };

  $scope.editPostTrip = function() {
    /*
    Loads edit post-trip page.
    */

    $location.url('/hikes/' + $routeParams.id + '/post-trip/edit');
    $scope.scrollTo('top');
  };

  $scope.deletePostTrip = function(hikeId, postTripId) {
    /*
    Deletes a pre-trip based on id.

    Parameters:
    - `hikeId` - Id of hike to delete pre-trip from.
    - `postTripId` - Id of post-trip to delete
    */

    // Delete any existing alerts:
    userMessages.clearAlerts();

    var confirm = $window.confirm('Are you sure you want to permanently delete this post-trip?');

    if (confirm) {
      var ids = {
        hikeId: hikeId,
        postTripId: postTripId,
      }
      postTripFactory.destroyPostTrip(ids, cb.postTripDestroyed);
    }
  };

  $scope.startPreTrip = function(hikeId) {
    /*
    Starts pre-trip (used for all hikes page mostly).
    */
    $location.url('/hikes/' + hikeId + '/pre-trip');
  };

  $scope.startPostTrip = function(hikeId) {
    /*
    Starts post-trip (used for all hikes page mostly).
    */
    $location.url('/hikes/' + hikeId + '/post-trip');
  };

  $scope.scrollStats = function() {
    /*
    Scrolls to stats portion on view all hikes page.
    */

    $scope.scrollTo('top-stats');
  };

  $scope.logout = function() {
    /*
    Log out a user when clicking `Logout` from top navigation.
    */

    // Run `logout` factory method, passing in `logout` callback above to run when complete:
    userFactory.logout(cb.logout);
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

}]);
