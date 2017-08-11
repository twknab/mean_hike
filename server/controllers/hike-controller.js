var Hike = require('mongoose').model('Hike'); // grab our Mongoose models
var User = require('mongoose').model('User');

module.exports = {
    // mostRecent: function(req, res) {
    //     /*
    //     Gets 3 most recent hikes.
    //
    //     Parameters:
    //     - `req`: Request object.
    //     - `res`: Response object.
    //     */
    //
    //     console.log('Fetching 3 most recent hikes...');
    //
    //     Hike.find({})
    //         .then(function(allHikes) {
    //             console.log(allHikes);
    //             return res.json(allHikes);
    //         })
    //         .catch(function(err) {
    //             console.log(err);
    //             return res.status(500).json(err);
    //         })
    //
    //
    // },
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
                    console.log("ERRORS VALIDATING")
                    console.log("Errors creating Hike:", validated.errors);
                    return res.status(500).json(validated.errors);
                }

                // Else if no errors, send back validated object:
                else {
                    console.log('PASSED VALIDATION')
                    console.log('Successfuly created Hike.');
                    return res.json(validated);
                };
            });
        };
    },
};
