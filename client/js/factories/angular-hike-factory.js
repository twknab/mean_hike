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

    factory.getRecent = function(recentHikesCallback) {
        /*
        Sends request to API to get recent hikes.

        Parameters:
        - `recentHikesCallback` - Callback which runs after recent hikes have been returned (see Dashboard Controller).
        */

        $http.get('/api/hike')
            .then(function(recentHikes) {
                /*
                If recent hikes are successfully queried, will be returned as `recentHikes` object.
                */

                console.log(recentHikes);

                // Run success callback passing along returned recent hikes:
                recentHikesCallback(recentHikes.data);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve recent hikes, they will be caught and returned as `err` object.
                */
                console.log(err.data);
            })
    };

    factory.getPreTrip = function(preTripCallback) {
        /*
        Semds request to API to get hikes without a completed Pre-Trip.

        Parameters:
        - `preTripCallback` - Callback which runs after hikes without a completed Pre-Trip report are returned.
        */

        $http.get('/api/hike/pre-trip')
            .then(function(incompletePreTripHikes) {
                /*
                If hikes are successfully queried, will be returned as `incompletePreTripHikes` object.
                */

                console.log(incompletePreTripHikes);

                // Run success callback passing along returned recent hikes:
                preTripCallback(incompletePreTripHikes.data);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve hikes, they will be caught and returned as `err` object.
                */
                console.log(err.data);
            })
    };

    // Return Factory Object:
    return factory;
}]);
