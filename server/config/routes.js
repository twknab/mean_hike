// Load Controllers:
var UserController = require('./../controllers/user-controller');
var HikeController = require('./../controllers/hike-controller');
var PreTripController = require('./../controllers/pre-trip-controller');
var PostTripController = require('./../controllers/post-trip-controller');

// Server-Side Routes:
module.exports = function(app) {
    console.log('Server side routes loaded...');
    app.post('/api/user/register', UserController.register) // register a user
        .post('/api/user/login', UserController.login) // login a user
        .get('/api/user/auth', UserController.auth) // authorize a user session
        .post('/api/user/update', UserController.update) // update a user
        .get('/api/user/welcome', UserController.welcomeSetFalse) // turn off welcome msg
        .get('/api/user/info', UserController.infoSetFalse) // turn off info msg
        .get('/api/user/stats', UserController.stats) // get user completed hike stats
        .post('/api/user/logout', UserController.logout) // logout a user
        .post('/api/hike', HikeController.addHike) // creates new hike
        .get('/api/hike', HikeController.mostRecent) // gets 3 most recent hikes
        .post('/api/hike/show', HikeController.getCurrentHike) // gets hike by id
        .get('/api/hike/show', HikeController.getAllHikes) // gets all hikes for user
        .post('/api/hike/update', HikeController.update) // update a hike
        .post('/api/hike/destroy', HikeController.destroy) // destroy a hike & all associated pre/post trips
        .get('/api/hike/pre-trip', HikeController.incompletePreTrips) // gets hikes with incomplete pre-trips
        .post('/api/hike/pre-trip', PreTripController.addPreTrip) // creates new pre-trip
        .post('/api/hike/pre-trip/show', PreTripController.getPreTrip) // gets a pre-trip
        .post('/api/hike/pre-trip/update', PreTripController.update) // update a pre-trip
        .post('/api/hike/pre-trip/destroy', PreTripController.destroy) // destroy a pre-trip
        .post('/api/hike/post-trip', PostTripController.addPostTrip) // creates new post-trip
        .post('/api/hike/post-trip/show', PostTripController.getPostTrip) // gets a post-trip
        .post('/api/hike/post-trip/update', PostTripController.update) // update a post-trip
        .post('/api/hike/post-trip/destroy', PostTripController.destroy) // destroy a post-trip
};
