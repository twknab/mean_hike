/*
    Note: The reason we essentially send back 3 separate lists of errors here,
    is becuase our first round uses a custom module to do some basic "pre" validations.
    If any errors are flagged, those errors are sent back. If there are no errors,
    then the mongoose pre-save validations run -- if any flags, those are sent back.
    If pre-save is successful, the instance is created, and the built in mongoose
    validators run (if errors, those are sent back). Because there is a step-wise
    process by which errors are generated, as we are using 3 different strategies
    for valdiation, there are 3 potentail sets of errors that can be generated.

    - Please see the notes in the top of "./modules/pre-validate.js"
    - Please also see "./models/User-model.js" for mongoose pre-validation and built-in
    validation methods.
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
        preValidate.login(req.body, function(err) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                console.log("Errors logging user in:", err.errors);
                return res.status(500).json(err.errors);
            }

            // If no errors, get user:
            else {
                User.findOne({ 'username': req.body.username })
                    .then(function(foundUser) {
                        // Setup session for found user:
                        req.session.userId = foundUser._id;
                        return res.json(foundUser);
                    })
                    .catch(function(err) {
                        console.log('Error trying to retrieve user!', err);
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
