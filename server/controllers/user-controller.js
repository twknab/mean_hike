var User = require('mongoose').model('User'); // grab our Mongoose model

module.exports = {
    register: function(req, res) {
        /*
        Validates and registers a new User, or returns errors.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        console.log('Starting new user validation....data submitted:', req.body);

        User.schema.methods.validateRegistration(req.body, function(validated) {
            /*
            Performs model validation instance methods; returns errors or the validated new user for session creation.

            Parameters:
            - `req.body` - Registration form object data from Registration function in User factory.
            - `callback(validated)` - A callback function which runs after validation, returning `validated` object data containing `errors` and `validated` objects).

            Notes:
            - The code below only runs after validations have completed. The `validated` object contains either an `errors` object with errors inside, or a `validated` object, with the validated user attached (see validateRegistration() inside of `User-model.js` for more).
            */

            // If there are any errors returned, send them back to Angular factory:
            if (Object.keys(validated.errors).length > 0) {
                return res.status(500).json(validated.errors);
            }

            // else, if there are no errors returned, check for validated user object:
            else {

                // Check for validatd user object:
                if (validated.validatedUser) {
                    // Setup session for successfully validated user and send back:
                    req.session.userId = validated.validatedUser._id;
                    return res.json(validated.validatedUser);
                }
                // Else, if validated object is not found, an unexpected error has occurred:
                else {
                    // Add unexpected error and send it:
                    validated.errors.unexpectedErr = {
                        message: "An unexpected server error has occurred. Please contact site administrator with the error message: REGISTRATION VALIDATE ERROR."
                    };
                    // Send back errors:
                    return res.status(500).json(validated.errors);
                }
            }
        });
    },
    login: function(req, res) {
        /*
        Validates and login an existing User, or returns errors.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        console.log('Starting existing user login process...Data submitted:', req.body);

        User.schema.methods.validateLogin(req.body, function(validated) {
            /*
            Performs login validation instance methods; returns either errors object or validated object containing validated user for login.

            Parameters:
            - `req.body` - Login form object data from login function in User factory.
            - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains either `errors` object with errors, or `validated` object with successfully validated user.
            */

            // If there are any errors send them:
            if (Object.keys(validated.errors).length > 0) {
                console.log("Errors logging user in:", validated.errors);
                return res.status(500).json(validated.errors);
            }

            // If no errors, see if verified user was returned:
            else {
                // Check for validatd user object:
                if (validated.validatedUser) {
                    // If validated property exists, user has been validated.
                    // Setup session for validated user and send user back:
                    req.session.userId = validated.validatedUser._id;
                    return res.json(validated.validatedUser);
                }
                // Else, if validated object is not found, an unexpected error has occurred:
                else {
                    // Add unexpected error and send it:
                    validated.errors.unexpectedErr = {
                        message: "An unexpected server error has occurred. Please contact site administrator with the error message: LOGIN VALIDATE ERROR."
                    };
                    return res.status(500).json(validated.errors);
                }
            }
        });
    },
    update: function(req, res) {
        /*
        Validates and updates an existing User's data, or returns errors.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        console.log('Starting update user validation...Data submitted:', req.body);

        // Find user based upon session so we can compare existing document values to those submitted for validation (to validate for what has changed as not all fields are required):
        User.findOne({
                _id: req.session.userId // look up user based upon session data
            })
            .then(function(foundUser) {
                /*
                Returns our found User.

                Parameters:
                - `foundUser` - found User object with all user data.
                */

                foundUser.validateUpdate(req.body, function(validated) {
                    /*
                    Runs model User update validation method; returns `validated` object which contains either errors or messages (success messages).

                    Parameters:
                    - `req.body` - User update object data from update user function in user factory.
                    - `callback(validated)` - Callback function which runs after validations in models file has completed. Returns an object with `errors` or success `messages`.
                    */

                    // Returned errors object:
                    console.log(validated);

                    // If there are any errors send them:
                    if (Object.keys(validated.errors).length > 0) {
                        console.log("Errors updating user:", validated.errors);
                        return res.status(500).json(validated.errors);
                    }

                    // Else if no errors, check for messages:
                    else {
                        // If messages, send back validate object containing them:
                        if (validated.messages) {
                            console.log("No changes detected.")
                            return res.json(validated);
                        }

                        // Else if no errors, send back validated object with empty errors and empty messages:
                        else {
                            return res.json(validated);
                        }
                    };
                });
            })
            .catch(function(err) {
                /*
                Catch any errors when querying for findOne using session value.

                Parameters:
                - `err` - Errors object with error messages.
                */

                // Send any query errors back:
                console.log(err);
                return res.status(500).json(err)
            })

    },
    auth: function(req, res) {
        /*
        Checks for a user's session to authorize angular's needs when displaying views and also to provide user data for certain navigation or page items.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.

        Notes:
        - This is not the only level of security. Each API route is also secured to verify a session in order to prevent spoofed data from being sent to the server or database.
        */

        // If session data is undefined, send back a False status (to be assessed in our Angular controller):
        if (typeof(req.session.userId) == 'undefined') {
            return res.status(500).json({
                status: false
            });
        }

        // Else, if session data is found, retreive the found user:
        else {
            // Find a user by session data:
            User.findOne({
                    _id: req.session.userId // Find one user by session data
                })
                .then(function(foundUser) {
                    /*
                    Returns a found User.

                    Parameters:
                    - `foundUser` - User object.
                    */

                    // Send back found User and a True status (to be assessed in our Angular controller):
                    return res.json({
                        user: foundUser,
                        status: true
                    })
                })
                .catch(function(err) {
                    /*
                    Catches any errors if our findOne query fails.
                    */

                    // Log and return errors:
                    console.log(err);
                    return res.status(500).json(err);
                })
        }
    },
    welcomeSetFalse: function(req, res) {
        /*
        Sets a user's welcome message status to false, preventing the user from ever see the welcome message again.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.

        Notes:
        - Once this is run, there is no present way for the User to reverse the status and see the message once again.
        */

        // Finds user by session and updates property:
        User.findOneAndUpdate({
                _id: req.session.userId // Finds a user by session data
            }, {
                welcome_msg_status: false // Updates user property to False
            })
            .then(function(foundUser) {
                /*
                    Returns found user.

                    Paramters:
                    - `foundUser` - User object.
                */

                // Log user and send a confirmation text:
                console.log(foundUser);
                return res.json('User welcome message updated.');
            })
            .catch(function(err) {
                /*
                Catches any error if findOne query fails:

                Parameters:
                - `err` - Errors object.
                */

                // Send errors:
                console.log(err);
                return res.status(500).json(err);
            })

    },
    logout: function(req, res) {
        /*
        Logs out a User with a current session.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        console.log('Logging out user process starting...');

        // Destroy session and send confirmation:
        req.session.destroy();
        console.log('Session destroyed.');
        return res.json("User logged out.");
    },
};
