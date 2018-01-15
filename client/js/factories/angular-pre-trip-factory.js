app.factory('preTripFactory', ['$http', function($http) {
  // Setup Factory Object:
  var factory = {};

  factory.newPreTrip = function(preTrip, success, error) {
    /*
    Sends new PreTrip data to API for validation; runs a callback function depending upon if new PreTrip is created and returned, or if errors are returned.

    Parameters:
    - `preTrip` - New PreTrip object containing all form data.
    - `success` - Callback which runs if PreTrip creation is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/pre-trip', preTrip)
      .then(function(newPreTrip) {
        success(newPreTrip.data);
      })
      .catch(function(err) {

        // If user fails to have valid session:
        if (err.data.redirect) {
          $window.location.href = err.data.redirect;
        }

        error(err.data);
      })
  };

  factory.getPreTrip = function(hikeId, success) {
    /*
    Sends API request to get Pre Trip for hike ID provided.

    Parameters:
    - `hikeId` - Hike Id that pre-trip belongs to.
    - `success` - Callback which runs if PreTrip query is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/pre-trip/show', hikeId)
      .then(function(hikeAndPreTrip) {
        /*
        If successful, a `hikeAndPreTrip` object is returned containing Hike object and populated preTrip.
        */

        // Run success callback but only send pre-trip:
        success(hikeAndPreTrip.data.preTrip);
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

  factory.updatePreTrip = function(preTrip, success, error) {
    /*
    Sends API request to validate and update a Pre Trip for hike ID provided.

    Parameters:
    - `preTrip` - Pre-Trip data to validate and update.
    - `success` - Callback which runs if PreTrip query is successful.
    - `error` - Callback which runs if errors are returned.
    */

    $http.post('/api/hike/pre-trip/update', preTrip)
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

  factory.destroyPreTrip = function(ids, success) {
    /*
    Send API request to destroy pre-trip by `id`.

    Parameters:
    - `ids` - Object containing `hikeId` which is the hike to which pre-trip belongs, and `preTripId` which is the Id of the pre-trip to destroy.
    - `success` - Callback which runs after pre-trip is destroyed.
    */

    $http.post('/api/hike/pre-trip/destroy', ids)
      .then(function() {
        /*
        Runs after pre-trip is successfully destroyed.
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
