app.factory('dashboardFactory', ['$http', function($http) {
    /*
    This `dashboardFactory`, handles all dashboard related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.login = function(user, createCallback, errorsCallback) {
        /*
        Sends login data to our API to be validated; runs a callback depending upon if retreived user is returned or if errors are returned.

        Parameters:
        - `user` - User login object containing all form data.
        - `createCallback` - Callback which runs if User retreival is successful.
        - `errorsCallback` - Callback which runs if errors during User retreival.
        */

        // console.log('Dashboard factory login method received data...', user);
        // $http.post('/login', user)
        //     .then(function(newUser) {
        //         console.log('Data returned from API via $http POST:', newUser.data);
        //         createCallback(newUser.data);
        //     })
        //     .catch(function(err) {
        //         console.log(err);
        //         console.log('Errors returned from API during User login:', err.data);
        //         errorsCallback(err.data);
        //     })
    };

    // Return Factory Object:
    return factory;
}]);
