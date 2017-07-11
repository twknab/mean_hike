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
        console.log('/// LOGIN REQ BODY ///', req.body);
        preValidate.login(req.body, function(err) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                return res.status(500).json(err.errors);
            }

            // If no errors, get user:
            else {
                console.log('There were no errors:');
                User.findOne({ 'email': req.body.email })
                    .then(function(foundUser) {
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
};
