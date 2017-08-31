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

    // Return Factory Object:
    return factory;
}]);
