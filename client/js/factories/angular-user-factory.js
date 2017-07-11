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
        console.log('Factory talking...', user);
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

    // Return Factory Object:
    return factory;
}]);
