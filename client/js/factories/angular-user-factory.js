app.factory('userFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    // Register:
    factory.register = function(user, registerCallback, errorsCallback) {
        console.log('Factory talking...', user);
        $http.post('/api/user/register', user)
            .then(function(newUser) {
                console.log(newUser.data);
                registerCallback(newUser.data); // runs callback if successful
            })
            .catch(function(err) {
                console.log(err);
                console.log('Error from DB:', err.data);
                errorsCallback(err.data); // runs errors callback if errors
            })
    };

    // Login:
    factory.login = function(user, loginCallback, errorsCallback) {
        console.log('Login process starting...');
        $http.post('/api/user/login', user)
            .then(function(foundUser) {
                console.log(foundUser.data);
                loginCallback(foundUser.data);
            })
            .catch(function(err) {
                console.log(err);
                console.log('Error from DB:', err.data);
                errorsCallback(err.data);
            })
    };

    // Authorize a User:
    factory.auth = function(authCallback) {
        $http.get('/api/user/auth')
            .then(function(authStatus) {
                console.log("Does user have a valid session?:", authStatus.data.status);
                authCallback(authStatus.data);
            })
            .catch(function(err) {
                console.log('Error attempting to authorize user:', err.data);
                authCallback(err.data);
            })
    };

    // Set Welcome Message to False:
    factory.welcomeMessageFalse = function(welcomeCallback) {
        $http.get('/api/user/welcome')
            .then(function(updatedUser) {
                console.log(updatedUser.data);
                welcomeCallback();
            })
            .catch(function(err) {
                console.log('Error attempting to set welcome message to false:', err.data);
            })
    };

    // Update a User:
    factory.update = function(user, updateCallback, errorsCallback) {
        $http.post('/api/user/update', user)
            .then(function(validated) {
                console.log(validated.data);
                updateCallback(validated.data);
            })
            .catch(function(err) {
                console.log('Error attempting update user:', err.data);
                errorsCallback(err.data)
            })
    };

    // Logout:
    factory.logout = function(logoutCallback) {
        console.log('Logout process starting...');
        $http.post('/api/user/logout')
            .then(function() {
                console.log('User has been successfully logged out.');
                logoutCallback();
            })
            .catch(function(err) {
                console.log(err);
                console.log('Error from DB:', err.data);
            })
    };

    // Return Factory Object:
    return factory;
}]);
