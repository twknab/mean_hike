var Hike = require('mongoose').model('Hike'); // grab our Mongoose models
var User = require('mongoose').model('User');

module.exports = {
    addHike: function(req, res) {
        /*
        Validates and creates a new Hike, or returns errors.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        // If not a valid session, redirect home, else begin new Hike process:
        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(500).redirect('/');
        } else {
            console.log('Starting new Hike validation...Data submitted:', req.body);

            Hike.schema.methods.validateHike(req.body, function(validated) {
                /*
                Performs Hike validation instance methods; returns either errors object or validated object containing validated Hike.

                Parameters:
                - `req.body` - New Hike form object data from addHike() function in Angular Hike factory.
                - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains either `errors` object with errors, or `validated` object with successfully validated Hike.
                */

                // Returned errors object:
                console.log(validated);

                // If there are any errors send them:
                if (Object.keys(validated.errors).length > 0) {
                    console.log("Validation Failed.");
                    console.log("Errors creating Hike:");
                    for (var property in validated.errors) {
                        if (validated.errors.hasOwnProperty(property)) {
                            console.log(validated.errors[property].message);
                        }
                    }
                    return res.status(500).json(validated.errors);
                }

                // Else if no errors, add hike to User's hike's array:
                else {
                    console.log('Validation Passed.');
                    console.log('Hike created...Adding Hike to User\'s `hikes` array...');
                    User.findOne({_id: req.session.userId})
                        .then(function(foundUser) {
                            /*
                            Returns User object `foundUser` if user is successfully found.
                            */

                            // Add hike ID to user's `hikes` array:
                            foundUser.addHike(validated.validatedHike._id);

                            // Generate hiking time estimate:
                            // Note: We send the distance and gain values from our validated hike to generate the travel time (from a custom built module that our model accesses). Please see the model's `genHikeTimeEst()` for more details.
                            validated.validatedHike.genHikeTimeEst(validated.validatedHike.distance, validated.validatedHike.gain);

                            console.log('Hike successfully added.');

                            // Send back validated object:
                            console.log('Hike process completed successfully.')
                            return res.json(validated);
                        })
                        .catch(function(err) {
                            /*
                            If error is returned when trying to query User, return it.
                            */

                            console.log('Errors finding user by session...');
                            return res.status(500).json(err);
                        })
                };
            });
        };
    },
    mostRecent: function(req, res) {
        /*
        Gets most recent hikes that have been created or updated.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(500).redirect('/');
        } else {
            console.log("Getting most recent hikes...");

            User.findOne({_id: req.session.userId})
                .populate({
                    path: 'hikes',
                    options: {
                        sort: '-updatedAt',
                        limit: 3,
                    }
                })
                .exec()
                .then(function(UserAndHikes) {
                    return res.json(UserAndHikes);
                })
                .catch(function(err) {
                    return res.status(500).json(err);
                })
        }

    },
    incompletePreTrips: function(req, res) {
        /*
        Gets all hikes *without* a pre-trip completed.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(500).redirect('/');
        } else {
            console.log("Getting all hikes without pre-trips started...");
            User.findOne({_id: req.session.userId})
                .populate({
                    path: 'hikes',
                    match: { preTrip: {$exists: false}},
                    options: {
                        sort: '-updatedAt',
                    }
                })
                .exec()
                .then(function(UserPreTripHikes) {
                    return res.json(UserPreTripHikes);
                })
                .catch(function(err) {
                    return res.status(500).json(err);
                })
        }

    },
    getCurrentHike: function(req, res) {
        /*
        Gets current hike by ID.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(500).redirect('/');
        } else {
            console.log("Querying for current hike...", req.body);
            Hike.findOne({_id: req.body.id})
                .then(function(hike) {
                    console.log("Hike found:", hike);
                    return res.json(hike);
                })
                .catch(function(err) {
                    console.log("Error retreiving hike:", err);
                    return res.status(500).json(err);
                })
        }

    },
};
