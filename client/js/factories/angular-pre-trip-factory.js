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

        console.log('Pre-trip process querying server...', preTrip);
        $http.post('/api/hike/pre-trip', preTrip)
            .then(function(newPreTrip) {
                console.log(newPreTrip.data);
                success(newPreTrip.data);
            })
            .catch(function(err) {

                // If user fails to have valid session:
                if (err.data.redirect) {
                    $window.location.href = err.data.redirect;
                }

                console.log('Error from DB when creating new pre-trip:', err.data);
                error(err.data);
            })
    };

    // Return Factory Object:
    return factory;
}]);
