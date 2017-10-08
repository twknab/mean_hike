var Hike = require('mongoose').model('Hike'); // grab our Mongoose models
var User = require('mongoose').model('User');
var PreTrip = require('mongoose').model('PreTrip');
var PostTrip = require('mongoose').model('PostTrip');
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
            return res.status(401).send({ redirect:"/"});
        } else {
            Hike.schema.methods.validateHike(req.body, function(validated) {
                /*
                Performs Hike validation instance methods; returns either errors object or validated object containing validated Hike.

                Parameters:
                - `req.body` - New Hike form object data from addHike() function in Angular Hike factory.
                - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains either `errors` object with errors, or `validated` object with successfully validated Hike.
                */

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
            return res.status(401).send({ redirect:"/"});
        } else {
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
            return res.status(401).send({ redirect:"/"});
        } else {
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
            return res.status(401).send({ redirect:"/"});
        } else {
            Hike.findOne({_id: req.body.id})
                .populate('preTrip')
                .populate('postTrip')
                .exec()
                .then(function(hike) {
                    console.log("***** THIS IS THE HIKE *******");
                    console.log(hike);
                    console.log("******************************")
                    return res.json(hike);
                })
                .catch(function(err) {
                    console.log("Error retreiving hike:", err);
                    return res.status(500).json(err);
                })
        }

    },
    getAllHikes: function(req, res) {
        /*
        Gets all hikes for user with current session, includes populating all pre-trip and post-trip data.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(401).send({ redirect:"/"});
        } else {
            User.findOne({_id: req.session.userId})
                .populate({
                    path: 'hikes',
                    populate: { path: 'preTrip' },
                    populate: { path: 'postTrip' },
                    options: {
                        sort: '-updatedAt',
                    }
                })
                .exec()
                .then(function(user) {
                    return res.json(user);
                })
                .catch(function(err) {
                    console.log("Error retreiving all Hikes for User:", err);
                    return res.status(500).json(err);
                })
        }

    },
    update: function(req, res) {
        /*
        Validates updating a hike.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            return res.status(401).send({ redirect:"/"});
        } else {

            Hike.schema.methods.validateUpdateHike(req.body, function(validated) {
                /*
                Performs update Hike validation instance methods; returns object containing `errors` and `messages`.

                Parameters:
                - `req.body` - Updated Hike form object data from updateHike() function in Angular Hike factory.
                - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains `errors` object with any errors and `messages` object with any messages.
                */

                // If there are any errors send them:
                if (Object.keys(validated.errors).length > 0) {
                    console.log("Validation Failed.");
                    console.log("Errors updating Hike:");
                    for (var property in validated.errors) {
                        if (validated.errors.hasOwnProperty(property)) {
                            console.log(validated.errors[property].message);
                        }
                    }
                    return res.status(500).json(validated.errors);
                }

                // Else if no errors, return a success message:
                else {
                    res.json(validated);
                };
            });
        }

    },
    destroy: function(req, res) {
        /*
        Destroys a hike and all associated pre/post trips.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        if (typeof(req.session.userId) == 'undefined') {
            return res.status(401).send({ redirect:"/"});
        } else {
            Hike.findOne({_id: req.body.id})
                .populate('preTrip')
                .populate('postTrip')
                .exec()
                .then(function(foundHike) {
                    // If Post-Trip, delete it:
                    if (foundHike.postTrip) {
                        var deletePostTrip = PostTrip.findOneAndRemove({_id: foundHike.postTrip._id})
                        deletePostTrip.exec();
                    }

                    // If Pre-Trip, delete it:
                    if (foundHike.preTrip) {
                        var deletePreTrip = PreTrip.findOneAndRemove({_id: foundHike.preTrip._id})
                        deletePreTrip.exec();
                    }

                    var deleteHike = Hike.findOneAndRemove({_id: foundHike._id})
                    deleteHike.exec();
                    return res.json({message: "Success deleting hike."});
                })
                .catch(function(err) {
                    console.log("Error querying for hike for deletion:", err);
                    return res.status(500).json(err);
                })

        }

    },
};
