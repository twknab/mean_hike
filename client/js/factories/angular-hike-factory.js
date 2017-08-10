app.factory('hikeFactory', ['$http', function($http) {
    /*
    This `hikeFactory`, handles all Hike related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.getRecent = function(getRecentCallback) {
        /*
        Gets 3 most recent hikes.
        */

        console.log('Get most recent Hikes process starting...');
        $http.get('/api/hike')
            .then(function(recentHikes) {
                /*
                Returns 3 most recent Hikes.

                Parameters:
                - `recentHikes` - 3 most recent hikes.
                */

                console.log(recentHikes.data);

                // Run success callback:
                getRecentCallback(recentHikes.data);
            })
            .catch(function(err) {
                /*
                Returns errors if newly created User is unsuccessful.

                Paramters:
                - `err` - Errors object containing errors.
                */

                console.log('Error getting recent hikes:', err.data);
                // Run callback with errors:
                getRecentCallback(err.data); // runs errors callback if errors
            })
    };

    // Return Factory Object:
    return factory;
}]);
