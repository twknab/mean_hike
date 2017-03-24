app.factory('loginFactory', ['$http', function($http) {
    // Setup Factory Object:
    var factory = {};

    // Login:
    factory.login = function(user, createCallback, errorsCallback) {
        console.log('Factory talking...', user);
        $http.post('/login', user)
            .then(function(newUser) {
                console.log(newUser.data);
                createCallback(newUser.data);
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
