app.factory('userFactory', ['$http', '$window', function($http, $window) {
    /*
    This `userFactory`, handles all User related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.register = function(user, success, error) {
        /*
        Sends registration data to API for validation; runs a callback function depending upon if new User is returned, or if errors are returned.

        Parameters:
        - `user` - User registration object containing all form data.
        - `success` - Callback which runs if User creation is successful.
        - `error` - Callback which runs if errors are returned during User creation.
        */

        $http.post('/api/user/register', user) // sends `user`
            .then(function(newUser) {
                /*
                Returns newly created User.

                Parameters:
                - `newUser` - Newly created User object.
                */

                // Run registration success callback:
                success(newUser.data); // runs callback if successful
            })
            .catch(function(err) {
                /*
                Returns errors if newly created User is unsuccessful.

                Parameters:
                - `err` - Errors object containing errors.
                */

                // Run errors callback:
                error(err.data); // runs errors callback if errors
            })
    };

    factory.login = function(user, success, error) {
        /*
        Sends login data to API for validation; runs callback if retreived User is found and validated, else runs a callback with errors.

        Parameters:
        - `user` - Login registration object containing all form data.
        - `success` - Callback which runs if User retrieval is successfully validated.
        - `error` - Callback which runs if errors are returned during User retrieval.
        */

        $http.post('/api/user/login', user) // sends `user`
            .then(function(foundUser) {
                /*
                Returns `foundUser` if user is found and validated.

                Parameters:
                - `foundUser` - User object.
                */

                // Run login success callback:
                success(foundUser.data);
            })
            .catch(function(err) {
                /*
                Returns errors if retreived User attempt is unsuccessful.

                Parameters:
                - `err` - Errors object containing errors.
                */

                // Run errors callback:
                error(err.data);
            })
    };

    factory.auth = function(authorized) {
        /*
        Authorize a User's session.

        Parameters:
        - `authorized` - Callback to run after session status has been determined.
        */
        $http.get('/api/user/auth')
            .then(function(authValidation) {
                /*
                Returns `authValidation` object if query is successful:

                Parameters:
                - `authValidation` - Object contianing `status` property with `true` or `false` status depending upon User session status, and `user` object, containing authorized User object if successful.
                */

                authorized(authValidation.data);
            })
            .catch(function(err) {
                authorized(err.data);
            })
    };

    factory.welcomeMessageFalse = function(welcome) {
        /*
        Sets Welcome Message status to False.

        Parameters:
        - `welcome` - Callback to run after welcome message status has been updated.
        */

        $http.get('/api/user/welcome')
            .then(function(updatedUser) {
                /*
                Returns User whose WelcomeMsgStatus is now updated to False.

                Parameters:
                - `updatedUser` - User object.
                */

                welcome();
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.

                Parameters:
                - `err` - Errors object returned.
                */


                // If user fails to have valid session:
                if (err.data.redirect) {
                    $window.location.href = err.data.redirect;
                }


            })
    };

    factory.getStats = function(success) {
        /*
        Get completed hike stats.

        Parameters:
        - `success` - callback which runs if stats are retrieved successfully.
        */

        $http.get('/api/user/stats')
            .then(function(stats) {
                /*
                Returns object containing `distance` and `gain` properties (total values for completed hikes).

                Parameters:
                - `stats` - Stats object containing `gain` (in feet) and `distance` (in miles) -- these are completed hike totals.
                */
                success(stats.data);
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.

                Parameters:
                - `err` - Errors object returned.
                */

                console.log("FAILURE", err);

                // If user fails to have valid session:
                if (err.data.redirect) {
                    $window.location.href = err.data.redirect;
                }

                console.log(err.data);


            })
    };

    factory.update = function(user, success, error) {
        /*
        Send update account data to API for validation.

        Parameters:
        - `user` - User account update form data.
        - `success` - Callback which runs if update is succesful.
        - `error` - Callback which runs if errors.
        */

        $http.post('/api/user/update', user)
            .then(function(validated) {
                /*
                Returns `validated` object containing messages if update is successful.

                Parameters:
                - `validated` - Object containing `messages` property with object containing messages.
                */

                success(validated.data);
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.
                */

                // If user fails to have valid session:
                if (err.data.redirect) {
                    $window.location.href = err.data.redirect;
                }

                error(err.data)
            })
    };

    factory.logout = function(loggedOut) {
        /*
        Runs logout function on server API.

        Parameters:
        - `loggedOut` - Callback function to run after logout completes.
        */
        $http.post('/api/user/logout')
            .then(function() {
                /*
                Runs logout callback.
                */

                loggedOut();
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.
                */


                // If user fails to have valid session:
                if (err.data.redirect) {
                    $window.location.href = err.data.redirect;
                }

            })
    };

    // Return Factory Object:
    return factory;
}]);
