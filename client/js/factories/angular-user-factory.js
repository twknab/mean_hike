app.factory('userFactory', ['$http', function($http) {
    /*
    This `userFactory`, handles all User related API requests.

    Dependencies:
    - `$http` - Angular's $http service allows us to make HTTP related requests to and receive responses from our server controller (aka server API).
    */

    // Setup empty factory object:
    var factory = {};

    factory.register = function(user, registerCallback, errorsCallback) {
        /*
        Sends registration data to API for validation; runs a callback function depending upon if new User is returned, or if errors are returned.

        Parameters:
        - `user` - User registration object containing all form data.
        - `registerCallback` - Callback which runs if User creation is successful.
        - `errorsCallback` - Callback which runs if errors are returned during User creation.
        */

        console.log('Registration process starting...', user);
        $http.post('/api/user/register', user) // sends `user`
            .then(function(newUser) {
                /*
                Returns newly created User.

                Parameters:
                - `newUser` - Newly created User object.
                */

                console.log(newUser.data);
                // Run registration success callback:
                registerCallback(newUser.data); // runs callback if successful
            })
            .catch(function(err) {
                /*
                Returns errors if newly created User is unsuccessful.

                Paramters:
                - `err` - Errors object containing errors.
                */

                console.log(err);
                console.log('Error registering user:', err.data);
                // Run errors callback:
                errorsCallback(err.data); // runs errors callback if errors
            })
    };

    factory.login = function(user, loginCallback, errorsCallback) {
        /*
        Sends login data to API for validation; runs callback if retreived User is found and validated, else runs a callback with errors.

        Parameters:
        - `user` - Login registration object containing all form data.
        - `registerCallback` - Callback which runs if User retrieval is successfully validated.
        - `errorsCallback` - Callback which runs if errors are returned during User retrieval.
        */

        console.log('Login process starting...');
        $http.post('/api/user/login', user) // sends `user`
            .then(function(foundUser) {
                /*
                Returns `foundUser` if user is found and validated.

                Parameters:
                - `foundUser` - User object.
                */

                console.log(foundUser.data);
                // Run login success callback:
                loginCallback(foundUser.data);
            })
            .catch(function(err) {
                /*
                Returns errors if retreived User attempt is unsuccessful.

                Paramters:
                - `err` - Errors object containing errors.
                */

                console.log(err);
                console.log('Error logging in user:', err.data);
                // Run errors callback:
                errorsCallback(err.data);
            })
    };

    factory.auth = function(authCallback) {
        /*
        Authorize a User's session.

        Paramters:
        - `authCallback` - Callback to run after session status has been determined.
        */
        $http.get('/api/user/auth')
            .then(function(authStatus) {
                /*
                Returns `authStatus` object if query is successful:

                Parameters:
                - `authStatus` - Object contianing `status` property with `true` or `false` status depending upon User session status, and `user` object, containing authorized User object if successful.
                */

                console.log("Does user have a valid session?:", authStatus.data.status);
                authCallback(authStatus.data);
            })
            .catch(function(err) {
                console.log('Error authorizing user:', err.data);
                authCallback(err.data);
            })
    };

    factory.welcomeMessageFalse = function(welcomeCallback) {
        /*
        Sets Welcome Message status to False.

        Paramters:
        - `welcomeCallback` - Callback to run after welcome message status has been updated.
        */

        $http.get('/api/user/welcome')
            .then(function(updatedUser) {
                /*
                Returns User whose WelcomeMsgStatus is now updated to False.

                Parameter:
                `updatedUser` - User object.
                */

                console.log(updatedUser.data);
                welcomeCallback();
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.
                */

                console.log('Error setting welcome message to false:', err.data);
            })
    };

    factory.update = function(user, updateCallback, errorsCallback) {
        /*
        Send update account data to API for validation.

        Parameters:
        - `user` - User account update form data.
        - `updateCallback` - Callback which runs if update is succesful.
        - `errorsCallback` - Callback which runs if errors.
        */

        $http.post('/api/user/update', user)
            .then(function(validated) {
                /*
                Returns `validated` object containing messages if update is successful.

                Parameters:
                - `validated` - Object containing `messages` property with object containing messages.
                */

                console.log(validated.data);
                updateCallback(validated.data);
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.
                */

                console.log('Error attempting update user:', err.data);
                errorsCallback(err.data)
            })
    };

    // Logout:
    factory.logout = function(logoutCallback) {
        /*
        Runs logout function on server API.

        Parameters:
        - `logoutCallback` - Callback function to run after logout completes.
        */
        console.log('Logout process starting...');
        $http.post('/api/user/logout')
            .then(function() {
                /*
                Runs logout callback.
                */

                console.log('User has been successfully logged out.');
                logoutCallback();
            })
            .catch(function(err) {
                /*
                Returns errors if unsuccessful.
                */

                console.log(err);
                console.log('Error logging out:', err.data);
            })
    };

    // Return Factory Object:
    return factory;
}]);
