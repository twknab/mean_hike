app.factory('userFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    // Register:
    factory.register = function(user, registerCallback, errorsCallback) {
        console.log('Factory talking...', user);
        $http.post('/api/register', user)
            .then(function(newUser) {
                console.log(newUser.data);
                registerCallback(newUser.data);
            })
            .catch(function(err) {
                console.log(err);
                console.log('Error from DB:', err.data);
                errorsCallback(err.data);
            })
    };

    // Login:
    factory.login = function(user, loginCallback, errorsCallback) {
        console.log('Login process starting...');
        $http.post('/api/login', user)
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
        $http.get('/api/login')
            .then(function(authStatus) {
                console.log(authStatus.data.status);
                authCallback(authStatus.data);
            })
            .catch(function(err) {
                console.log('Error attempting to authorize user:', err.data);
                authCallback(err.data);
            })
    };

    // Get Logged In User:
    factory.getLoggedIn = function(loggedInCallback) {
        $http.get('/api/login/user')
            .then(function(retrievedUser) {
                loggedInCallback(retrievedUser.data);
            })
            .catch(function(err) {
                console.log('Error attempting to authorize user:', err.data);
                loggedInCallback(err.data);
            })
    };

    // Set Welcome Message to False:
    factory.welcomeMessageFalse = function(welcomeCallback) {
        $http.get('/api/welcome')
            .then(function(updatedUser) {
                console.log(updatedUser.data);
                welcomeCallback();
            })
            .catch(function(err) {
                console.log('Error attempting to set welcome message to false:', err.data);
            })
    };

    // Logout:
    factory.logout = function(logoutCallback) {
        console.log('Logout process starting...');
        $http.post('/api/logout')
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
