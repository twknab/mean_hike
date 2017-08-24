// Load Controllers:
var UserController = require('./../controllers/user-controller');
var HikeController = require('./../controllers/hike-controller');

// Server-Side Routes:
module.exports = function(app) {
    console.log('Server side routes loaded...');
    app.post('/api/user/register', UserController.register) // register a user
        .post('/api/user/login', UserController.login) // login a user
        .get('/api/user/auth', UserController.auth) // authorize a user session
        .post('/api/user/update', UserController.update) // update a user
        .get('/api/user/welcome', UserController.welcomeSetFalse) // turn off welcome msg
        .post('/api/user/logout', UserController.logout) // logout a user
        .post('/api/hike', HikeController.addHike) // creates new hike
        .get('/api/hike', HikeController.mostRecent) // gets 3 most recent hikes
        .get('/api/hike/pre-trip', HikeController.incompletePreTrips) // gets hikes with incomplete pre-trips
        .post('/api/hike/current', HikeController.getCurrentHike) // gets hike by id
};
