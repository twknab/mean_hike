/*
    Note: Although it is best practices to have all validations occur in the models,
    due to the nature of Mongoose's step-wise validations (first the pre-save validators run,
    followed by the built-in validators). The preValidate module that I built attempts
    to streamline the validation process, by sending a first round of basic errors,
    prior to any instance creation (and any pre-save methods running). At the time,
    this seemed like a cleaner way to give user's error lists in a step-wise fashion,
    so that the most basic errors were highlighted first. Essentially there are 3
    different layers of validation: (1) custom preValidate module, (2) mongoose
    pre-save methods, (3) mongoose built-in validators. In that order.

    This validation could be improved, by trying to take the pre-save validation
    module I created, and bundling it all into the pre-save functions within the
    User model. At the time of creating this project, I chose this alernative
    strategy to try and better handle my validation process. In retrospect,
    I question my initial design and may be able to streamline/improve. For now,
    at least, we've got functionality.

    -- See notes in `/pre-validate.js` file.
    -- See notes in `/User-model.js` file.
*/

// Grab our Mongoose Model:
var User = require('mongoose').model('User'),
    preValidate = require('./../modules/pre-validate');

module.exports = {
    // Register a user
    register: function(req, res) {
        console.log('/// REGISTER REQ BODY ///', req.body);
        preValidate.registration(req.body, function(err) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                return res.status(500).json(err.errors);
            }

            // If no errors, create user and run built-in and pre-save validations:
            else {

                /*
                    Note: All user data is validated in our preValidate.register()
                    method, while the actual user instance is then created below,
                    after we've verified no errors.
                */

                console.log('There were no errors:');
                User.create(req.body)
                    .then(function(newUser) {
                        // Create session for newly registered user:
                        req.session.userId = newUser._id;
                        return res.json(newUser);
                    })
                    .catch(function(err) {
                        console.log('Error trying to create user!', err);
                        if (err.errors == null) {
                            console.log('Custom Validator Function Error detected...');
                            return res.status(500).json({
                                custom: {
                                    message: err.message
                                }
                            });
                        } else {
                            console.log('Built in Mongoose Validation detected....');
                            return res.status(500).json(err.errors)
                        };
                    })
            }

        });
    },
    // Login a user
    login: function(req, res) {
        console.log('Login Data Submitted:', req.body);
        preValidate.login(req.body, function(err, validatedUser) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                console.log("Errors logging user in:", err.errors);
                return res.status(500).json(err.errors);
            }

            // If no errors, lookup user by username first:
            else {
                /*
                    Note: The below section, is part of the callback function
                    which runs within our preValidate method. Because we have an
                    additional parameter for a `validatedUser` in our callback,
                    we can pass the validated user in the preValidate method
                    to this callback, and simply setup our session data without
                    once again querying for our user (already done for us in
                    the preValidate method). Because this will only run when
                    - 0 - errors have been returned, a valid user should be
                    passed along each and every time.
                */

                console.log("Setting up session for verified user...");
                req.session.userId = validatedUser._id;
                return res.json(validatedUser);

            }

        });
    },
    // Authorize a user by checking for session data:
    auth: function(req, res) {
        if (typeof(req.session.userId) == 'undefined') { // if no session return false
            return res.status(500).json({
                status: false
            });
        } else { // if valid session, return true along with validated user
            User.findOne({_id: req.session.userId})
                .then(function(foundUser) {
                    console.log(foundUser);
                    return res.json({
                        user: foundUser,
                        status: true
                    })
                })
                .catch(function(err) {
                    console.log(err);
                    return res.status(500).json(err);
                })
        }
    },
    // Set welcome message to false:
    welcomeSetFalse: function(req, res) {
        User.findOneAndUpdate({_id: req.session.userId}, {welcome_msg_status: false})
            .then(function(foundUser) {
                console.log(foundUser);
                return res.json('User welcome message updated.');
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json(err);
            })

    },
    // Logout a user
    logout: function(req, res) {
        console.log('Logging out user...');
        // Destroy session:
        req.session.destroy();
        console.log('Session destroyed.');
        return res.json("User logged out.");
    },
};
