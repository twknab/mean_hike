app.factory('postTripFactory', ['$http', function($http) {
  // Setup Factory Object:
  var factory = {};

  factory.newPostTrip = function(postTrip, success, error) {
    /*
    Sends new PostTrip data to API for validation; runs a callback function depending upon if new PostTrip is created and returned, or if errors are returned.

    Parameters:
    - `postTrip` - New PostTrip object containing all form data.
    - `success` - Callback which runs if PostTrip creation is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/post-trip', postTrip)
      .then(function(newPostTrip) {
        success(newPostTrip.data);
      })
      .catch(function(err) {

        // If user fails to have valid session:
        if (err.data.redirect) {
          $window.location.href = err.data.redirect;
        }

        error(err.data);
      })
  };

  factory.getPostTrip = function(hikeId, success) {
    /*
    Sends API request to get Post Trip for hike ID provided.

    Parameters:
    - `hikeId` - Hike Id that post-trip belongs to.
    - `success` - Callback which runs if PostTrip query is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/post-trip/show', hikeId)
      .then(function(hikeAndPostTrip) {
        /*
        If successful, a `hikeAndPostTrip` object is returned containing Hike object and populated postTrip.
        */

        // Run success callback but only send pre-trip:
        success(hikeAndPostTrip.data.postTrip);
      })
      .catch(function(err) {

        // If user fails to have valid session:
        if (err.data.redirect) {
          $window.location.href = err.data.redirect;
        }

        // Log error:
        console.log(err.data);
      })
  };

  factory.updatePostTrip = function(postTrip, success, error) {
    /*
    Sends API request to validate and update a Post Trip for hike ID provided.

    Parameters:
    - `postTrip` - Post-Trip data to validate and update.
    - `success` - Callback which runs if PreTrip query is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/post-trip/update', postTrip)
      .then(function(validated) {
        /*
        If successful, a `validated` object is returned containing `messages` object containing messages.
        */

        // Run success callback:
        success(validated.data);
      })
      .catch(function(err) {

        // If user fails to have valid session:
        if (err.data.redirect) {
          $window.location.href = err.data.redirect;
        }

        // Run error callback:
        error(err.data);
      })
  };

  factory.destroyPostTrip = function(ids, success) {
    /*
    Send API request to destroy post-trip by `id`.

    Parameters:
    - `ids` - Object containing `hikeId` which is the hike to which post-trip belongs, and `postTripId` which is the Id of the post-trip to destroy.
    - `success` - Callback which runs after post-trip is destroyed.
    */

    $http.post('/api/hike/post-trip/destroy', ids)
      .then(function() {
        /*
        Runs after post-trip is successfully destroyed.
        */

        // Run success callback:
        success();
      })
      .catch(function(err) {
        /*
        Returns errors if unsuccessful.
        */

        // If user fails to have valid session:
        if (err.data.redirect) {
          $window.location.href = err.data.redirect;
        }
        // Otherwise log errors
        console.log(err.data);
      })
  };


  // Return Factory Object:
  return factory;
}]);
