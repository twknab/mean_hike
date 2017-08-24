// Grab our Mongoose models
var Hike = require('mongoose').model('Hike'),
    User = require('mongoose').model('User'),
    PreTrip = require('mongoose').model('PreTrip');

module.exports = {
    addPreTrip: function(req, res) {
        /*
        Validates and creates a new PreTrip, or returns errors.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        // If not a valid session, redirect home, else begin new PreTrip process:
        if (typeof(req.session.userId) == 'undefined') {
            console.log("This route is inaccessible without a valid session.");
            return res.status(500).redirect('/');
        } else {
            console.log('Starting new PreTrip validation...Data submitted:', req.body);

            PreTrip.schema.methods.validatePreTrip(req.body, function(validated) {
                /*
                Performs PreTrip validation instance methods; returns either errors object or validated object containing validated PreTrip.

                Parameters:
                - `req.body` - New PreTrip form object data from addPreTrip() function in Angular Pre-Trip factory.
                - `function(validated)` - A callback function which runs after all validation methods have completed.

                Notes:
                The `validated` object in the callback function above returns an object containing an `errors` object if errors, or a `validated` object containing the validated PreTrip.
                */

                // Returned errors object:
                console.log(validated);

                // If there are any errors send them:
                if (Object.keys(validated.errors).length > 0) {
                    console.log("Validation Failed.");
                    console.log("Errors creating PreTrip:");
                    for (var property in validated.errors) {
                        if (validated.errors.hasOwnProperty(property)) {
                            console.log(validated.errors[property].message);
                        }
                    }
                    return res.status(500).json(validated.errors);
                }

                // Else if no errors, set new PreTrip to Hike's `preTrip` field:
                else {
                    console.log('Validation Passed.');
                    console.log('PreTrip created...Setting new PreTrip to Hike\'s `preTrip` field...');
                    Hike.findOne({_id: req.body.hikeId})
                        .then(function(foundHike) {
                            /*
                            Returns Hike object as `foundHike` if query successful.
                            */

                            // Set preTrip ID to Hike's `preTrip` array:
                            foundHike.addPreTrip(validated.validatedPreTrip._id);

                            console.log('Pre-Trip successfully added.');

                            // Send back validated object:
                            console.log('Pre-trip process completed successfully.')
                            return res.json(validated);
                        })
                        .catch(function(err) {
                            /*
                            If error is returned when trying to query Hike, return it.
                            */

                            console.log('Errors finding Hike by ID...');
                            return res.status(500).json(err);
                        })
                };
            });
        };
    },
};
