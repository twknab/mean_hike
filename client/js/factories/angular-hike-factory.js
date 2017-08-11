app.factory('hikeFactory', ['$http', function($http) {
    /*
    This `hikeFactory`, handles all Hike related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.newHike = function(newHike, newHikeCallback, errorsCallback) {
        /*
        Sends new Hike data to API for validation; runs a callback function depending upon if new Hike is created and returned, or if errors are returned.

        Parameters:
        - `newHike` - New Hike object containing all form data.
        - `newHikeCallback` - Callback which runs if new Hike creation is successful.
        - `errorsCallback` - Callback which runs if errors are returned during User creation.
        */

        console.log('Sending Hike data to API for validation and creation...');
        $http.post('/api/hike', newHike)
            .then(function(validated) {
                /*
                If new Hike is successfully created, the new Hike object will be returned.

                Parameters:
                - `validated` - Validation object containing success messages.
                */

                console.log('SUCCESSSSS!');

                // Run success callback:
                newHikeCallback(validated.data);
            })
            .catch(function(err) {
                /*
                Returns errors if newly created Hike is unsuccessful.

                Parameters:
                - `err` - Errors object containing errors.
                */

                console.log('Error attempting to create new Hike:', err.data);
                // Run callback with errors:
                errorsCallback(err.data); // runs errors callback if errors
            })
    };

    // Return Factory Object:
    return factory;
}]);
