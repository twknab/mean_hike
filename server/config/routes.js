// Load Controllers:
var UserController = require('./../controllers/user-controller');

// Server-Side Routes:
module.exports = function(app) {
    console.log('Server side routes loaded...');
    app.post('/api/register', UserController.register)
};
