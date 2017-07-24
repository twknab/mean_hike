// Load Controllers:
var UserController = require('./../controllers/user-controller');

// Server-Side Routes:
module.exports = function(app) {
    console.log('Server side routes loaded...');
    app.post('/api/register', UserController.register)
        .post('/api/login', UserController.login)
        .get('/api/login', UserController.auth)
        .get('/api/login/user', UserController.getLoggedIn)
        .get('/api/welcome', UserController.welcomeSetFalse)
        .post('/api/logout', UserController.logout)
};
