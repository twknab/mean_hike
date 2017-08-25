app.factory('hikeFactory', ['$http', function($http) {
    /*
    This `hikeFactory`, handles all Hike related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.newHike = function(newHike, success, error) {
        /*
        Sends new Hike data to API for validation; runs a callback function depending upon if new Hike is created and returned, or if errors are returned.

        Parameters:
        - `newHike` - New Hike object containing all form data.
        - `success` - Callback which runs if new Hike creation is successful.
        - `error` - Callback which runs if errors are returned during User creation.
        */

        console.log('Sending Hike data to API for validation and creation...');
        $http.post('/api/hike', newHike)
            .then(function(validated) {
                /*
                If new Hike is successfully created, the new Hike object will be returned.

                Parameters:
                - `validated` - Validation object containing success messages.
                */

                // Run success callback:
                success(validated.data);
            })
            .catch(function(err) {
                /*
                Returns errors if newly created Hike is unsuccessful.

                Parameters:
                - `err` - Errors object containing errors.
                */

                console.log('Error attempting to create new Hike:', err.data);
                // Run callback with errors:
                error(err.data); // runs errors callback if errors
            })
    };

    factory.getRecent = function(success) {
        /*
        Sends request to API to get recent hikes.

        Parameters:
        - `success` - Callback which runs after recent hikes have been returned (see Dashboard Controller).
        */

        $http.get('/api/hike')
            .then(function(recentHikes) {
                /*
                If recent hikes are successfully queried, will be returned as `recentHikes` object.
                */

                console.log(recentHikes);

                // Run success callback passing along returned recent hikes:
                success(recentHikes.data);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve recent hikes, they will be caught and returned as `err` object.
                */

                console.log(err.data);
            })
    };

    factory.getPreTrip = function(success) {
        /*
        Sends request to API to get hikes without a completed Pre-Trip.

        Parameters:
        - `success` - Callback which runs after hikes without a completed Pre-Trip report are returned.
        */

        $http.get('/api/hike/pre-trip')
            .then(function(incompletePreTripHikes) {
                /*
                If hikes are successfully queried, will be returned as `incompletePreTripHikes` object.
                */

                // Run success callback passing along returned recent hikes:
                success(incompletePreTripHikes.data);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve hikes, they will be caught and returned as `err` object.
                */

                console.log(err.data);
            })
    };

    factory.getHike = function(id, success) {
        /*
        Gets hike for user based upon ID and runs callback if successful.

        Parameters:
        - `id` - Id of hike to retrieve.
        - `success` - Callback which runs after hike is sucessfully retrieved.
        */

        console.log("Factory getting current hike...ID:", id);

        var hikeId = {
            id: id,
        }

        $http.post('/api/hike/show', hikeId)
            .then(function(retrievedHike) {
                /*
                If hike is successfully queried, will be returned as `retrievedHike` object.
                */

                console.log("Got hike successfully...", retrievedHike.data);

                // Run success callback passing along returned current hike:
                success(retrievedHike.data);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve hike, they will be caught and returned as `err` object.
                */

                console.log(err.data);
            })
    };

    factory.allHikes = function(success) {
        /*
        Gets all hikes for user based upon ID and runs callback if successful.

        Parameters:
        - `success` - Callback which runs after all hikes are retrieved.
        */

        console.log("Factory getting all hikes...");

        $http.get('/api/hike/show')
            .then(function(userAllHikes) {
                /*
                If all hikes successfully queried, will be returned as  `userAllHikes` -- which is a `User` object containing a `hikes` array. Note: `preTrip` and `postTrip` fields are also populated.
                */

                console.log("Got all hikes successfully...", userAllHikes.data.hikes);

                // Run success callback passing along data:
                success(userAllHikes.data.hikes);
            })
            .catch(function(err) {
                /*
                If errors occur trying to retrieve hike, they will be caught and returned as `err` object.
                */

                console.log(err.data);
            })
    };

    // Return Factory Object:
    return factory;
}]);
