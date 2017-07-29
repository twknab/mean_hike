/*
    Note: Our validator functions  live primarily in our `User-model.js` file
    (as instance methods). In our controller methods below, I've opted to add in
    a module file, called `user-validator.js` which then runs these various instance
    methods for validation. Each instance method returns either an error, or if no
    error, returns `undefined`. The user-validator methods accept form data and
    a callback function. In our callbacks below, we choose to assess our returned
    errors list, and if no errors, proceed with our database actions.
*/

// Grab our Mongoose Model:
var User = require('mongoose').model('User'),
    validate = require('./../modules/user-validator');

module.exports = {
    // Register a user
    register: function(req, res) {
        console.log('Server talking..registration data rec\'d:', req.body);

        // Run validate.registration() method, passing our entire form data and
        // a callback function, which runs after our validations complete.
        validate.registration(req.body, function(err) {
            /*
                Note: As our callback functions runs, it checks for errors. If no
                errors, it attempts to create the user, sets up session and sends
                them back. If errors are generated during this process they are
                returned. If errors are initially detected (before creation attepmpt),
                these too are returned.
            */

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                return res.status(500).json(err.errors);
            }

            // If no errors, create user and run built-in and pre-save validations:
            else {

                /*
                    Note: All user data is validated in our validate.register()
                    method, while the actual user instance is then created below,
                    after we've verified no errors.
                */

                console.log('There were no errors:');
                User.create(req.body)
                    .then(function(newUser) {
                        // Hash password:
                        newUser.hashPassword(newUser.password);
                        // newUser.save();
                        // Create session for newly registered user:
                        req.session.userId = newUser._id;
                        return res.json(newUser);
                    })
                    .catch(function(err) {
                        console.log('Error trying to create user!', err);
                        // Note: The following variation in our errors message is
                        // due to the different way that built-in validators format
                        // their error messages, compared to our custom and Pre-Save
                        // validations. A development improvement may be to simply format
                        // the errors in the same structure in our model instance methods,
                        // so here in our controller we can just hand back the list and not
                        // have to worry about any variation.
                        if (err.errors == null) {
                            console.log('Pre-Save Validation detected...');
                            return res.status(500).json({
                                custom: {
                                    message: err.message
                                }
                            });
                        } else {
                            console.log('Built-in Validation detected....');
                            return res.status(500).json(err.errors)
                        };
                    })
            }

        });
    },
    // Login a user
    login: function(req, res) {
        console.log('Login Data Submitted:', req.body);

        // Again, we pass in a callback function to our validate method, which will run once validations complete.
        // In a nut shell, we send our form data to be validated, along with our callback, which runs after.
        // This is the same strategy that is deployed in the above register() function:
        validate.login(req.body, function(err) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                console.log("Errors logging user in:", err.errors);
                return res.status(500).json(err.errors);
            }

            // If no errors, lookup user by username or email, and set session data for retrieved and validated user:
            else {

                // Check if User exists (check by username first):
                User.findOne({ username: req.body.login_id })
                    .then(function(foundUser) {
                        // If returned user is empty (no match):
                        if (!foundUser) {
                            // Check if User exists by email instead:
                            User.findOne({ email: req.body.login_id })
                                .then(function(foundEmail) {
                                    // If empty user is returned (no match):
                                    if (!foundEmail) {
                                        err.errors.email = {
                                            message: new Error('Username or Email provided is not registered.').message
                                        };
                                        // Return errors:
                                        return res.status(500).json(err.errors);
                                    }
                                    // Else, if user is found by email, run password auth:
                                    else {
                                        // Else, check password and log user in:
                                        console.log("Checking password....");
                                        __checkPassword(foundEmail, req.body.password);
                                    }
                                })
                                .catch(function(err) {
                                    // This will only catch if the email query itself failed:
                                    err.errors.email = {
                                        message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY EMAIL QUERY"').message
                                    };
                                    // Return Errors:
                                    return res.status(500).json(err.errors);
                                })
                        }

                        else {
                            // Else, check password and log user in:
                            console.log("Checking password...");
                            __checkPassword(foundUser, req.body.password);
                        }

                    })
                    .catch(function(err) {
                        // This will only catch of the username query failed:
                        console.log("There's been an error.");
                        console.log(err)
                        err.errors.username = {
                            message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY USERNAME QUERY".').message
                        };
                        return res.status(500).json(err.errors);
                    })
            }

            // Internal function merely for confirming password match:
            function __checkPassword(userObj, password) {
                userObj.verifyPassword(password)
                    .then(function() {
                        console.log("Password has been verified.");
                        console.log("Setting up session for verified user...");
                        req.session.userId = userObj._id;
                        return res.json(userObj);
                    })
                    .catch(function(err2) {
                        console.log("Password is incorrect. Access denied.");
                        err.errors.password = {
                            message: new Error('Password is incorrect.').message
                        };
                        return res.status(500).json(err.errors);
                    })
            };

        });
    },
    // Update a user
    update: function(req, res) {
        /*
        Validates user data before updating user.

        The following is validated:
        - username and email must not be taken. (modify check duplicates)
        - username must be greater than 2 characters, less than 30 characters. (should run in pre-save)
        - email address must be valid format. (function exists)
        - email address and confirmation must match. (function exists)
        - password must be greater than 12 characters, less than 50 characters. (function exists)
        - password and password confirmation must match. (function exists)

        Note: Please see the individual instance functions for each specific validation.
        */

        // Show data submitted:
        console.log('Updating user :', req.body);

        // Prior to validation, get user based upon session so we can compare existing
        // document values to those submitted for validation:
        User.findOne({ _id: req.session.userId })
            .then(function(foundUser) {
                /*
                    Note: When we run our validation instance method below,
                    we have to pass a callback into the validation function.
                    This code will run after our queries finish retrieving data.
                    Promises are not available to us here.

                    If we didn't pass the callback function in, we'd receive an `undefined`,
                    as our queries cannot complete by the time our javascript interpreter
                    moves onto the next line. Thus, our lovely callback spiral..
                */

                // Validate our user update, and pass in our callback which runs after validations finish:
                foundUser.validateUpdate(req.body, function(validationErrors){

                    /* >> NOTE: THE CODE BELOW IS THE CALLBACK << */
                    /* This code only runs AFTER all our validators finish! */

                    // Returned errors object:
                    console.log(validationErrors);

                    // If there are any errors send them:
                    if (Object.keys(validationErrors.errors).length > 0) {
                        console.log("Errors updating user:", validationErrors.errors);
                        return res.status(500).json(validationErrors.errors);
                    }

                    // Else if no errors, send back new user:
                    else {
                        return res.json(foundUser);

                    }

                });

            })
            .catch(function(err) { // Catch any errors if our query fails.
                console.log(err);
                return res.status(500).json(err)
            })

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
