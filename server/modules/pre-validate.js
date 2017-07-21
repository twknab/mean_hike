/*
    Note: Normally I like to do my validations using a combination of
    built-in mongoose validators along with pre-save methods. In the
    case of this project, we are to confirm email and password fields.
    Because the email and password fields are not actual properties of
    our database model for a User, we don't have access to built-in
    validators.

    Because I could not find a way to perform my validations within my models
    file, prior to instance creation, I chose to create a module instead
    to validate the extra fields which are not present in the User model.

    However, because I'm using a mixture of this module, the built-in
    validators, and the pre-save hooks, my validations were occurring in
    "layers", and my user might receive a list of errors, to submit again,
    to receive another set of errors that were validated at the next layer.
    This is bad user experience and could confuse users or deter them.
    Thus, I chose to put *most all* of my validations into this module,
    leaving only the "checking for duplicates" (for username and email)
    to be done as pre-save instance methods. As a backup, I still have
    the built-in validators configured in the model itself, but is not
    likely they'll ever get flagged as this validation below should catch
    most everything.

    Now, a user will only receive two sets of errors if their username
    or email is a duplicate, else they'll get a nice list of all
    issues all at once to be corrected. A smoother UX.
*/

// Grab any dependencies:
var mongoose = require('mongoose'),
    User = require('mongoose').model('User');

module.exports = {
    // Validates user registration generating one list of error objects to hand back:
    registration : function(user, callback) {
        // Create Error Object which will hold all Errors:
        var err = {
            errors: {}
        };

        // Check if all 5 fields are filled out:
        /*--------------------*/
        /*---- ALL FIELDS ----*/
        /*--------------------*/
        if (Object.keys(user).length < 5) {
            // Format Error Object for Angular:
            err.errors.allFields = {
                message: new Error('All fields are required.').message
            };
            callback(err);
        }
        // If all fields are filled in proceed with validations:
        else {
            /*--------------------*/
            /*----- USERNAME -----*/
            /*--------------------*/
            // Check if username contains only alphanumerical + underscores
            if (!(/^[a-z0-9_]+$/i.test(user.username))) {
                err.errors.usernameFormat = {
                    message: new Error('Username may contain only letters, numbers or underscores.').message
                };

            }

            // Check if username is between 2 and 30 characters:
            if (user.username.length <= 1 || user.username.length >= 31) {
                err.errors.usernameLength = {
                    message: new Error('Username must be between 2 and 30 characters long.').message
                };
            }

            /*--------------------*/
            /*------- EMAIL ------*/
            /*--------------------*/
            // Check if email fields match:
            if (user.email !== user.emailConfirm) {
                err.errors.emailMatch = {
                    message: new Error('Email fields are required and must match.').message
                };
            }
            // Check if email is in proper email format:
            if (!(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(user.email))) {
                err.errors.emailFormat = {
                    message: new Error('Email must contain only letters, numbers and have valid formatting.').message
                };
            }

            // Check if email is between 5 and 50 characters
            if (user.email.length <= 4 || user.email.length >= 51) {
                err.errors.emailLength = {
                    message: new Error('Email must be between 5 and 50 characters long.').message
                };
            }

            /*--------------------*/
            /*----- PASSWORD -----*/
            /*--------------------*/
            // Check if password fields match:
            if (user.password !== user.passwordConfirm) {
                err.errors.passwordMatch = {
                    message: new Error('Password fields are required and must match.').message
                };
            }

            // Check if password is strong password:
                /*
                    PASSWORD RULES:
                    - Must have at least 2 lowercase
                    - Must have at least 1 uppercase
                    - Must have at least 1 symbol
                    - Must be 12-20 characters
                    - No more than 2 consecutive characters
                    - Voided sequences: username, `asdf`, `123`, `qwerty` or Username
                    - Note: This occurs in 2 steps: (1) basic character validations, (2) username regex check
                */
            var strongPassword = /^(?!.*(.)\1{2})(?=(.*[\d]){1,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){1,})(?!(?=.*(asdf|qwerty|123|\s)))(?:[\da-zA-Z@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){12,20}$/;
            if (!strongPassword.test(user.password)) {
                console.log('Failed strong password detection.');
                err.errors.strongPassword = {
                    message: new Error('Password must be strong. Requirements: between 12-20 characters, includes 2 lowercase, 1 uppercase, 1 symbol, 1 number and may not include your username or basic sequences.').message
                };
            } else {
                console.log('Passed strong password detection.');
                // Check if password contains username
                console.log('Checking if username is contained in password...');
                var usernameRegEx = new RegExp(user.username, "i"); // creates regex pattern with username case insensitive
                if (usernameRegEx.test(user.password)) { // checks password for any matching username
                    console.log('Failed, Username is contained in password. Not strong.');
                    err.errors.strongPassUsername = {
                        message: new Error('Password cannot contain username.').message
                    };
                } else {
                    console.log('Passed, Username not found in password.');
                }
            }

            // Run callback with any errors after validation:
            // Note: Built-in mongoose validators followed by pre-save instance methods will run after this.
            console.log('/// ERRORS LIST ///');
            console.log(err.errors); // should be full list of all errors above in successive formatting: Username > Email > Password
            callback(err);

        } // end else for all fields

    }, // end registration validation method
    login : function(user, callback) {
        // Create Error Object which will hold all Errors:
        var err = {
            errors: {}
        };

        /*--------------------*/
        /*---- ALL FIELDS ----*/
        /*--------------------*/
        // Check if both fields are filled out:
        if (!user.login_id && !user.password){
            err.errors.allFields = {
                message: new Error('All fields are required.').message
            };
            callback(err);
        }

        else {
            // Check if username and password field are right number of characters:
            console.log('Login ID and password detected...checking length...');
            if (user.login_id.length < 3 | user.password.length < 12) {
                err.errors.username = {
                    message: new Error('Login username or email must be at least 3 characters, Password must be at least 12.').message
                };
                callback(err);
            }

            /*--------------------*/
            /*----- USERNAME -----*/
            /*--------------------*/
            // Check if user exists (check by username first):
            User.findOne({ username: user.login_id })
                .then(function(foundUser) {
                    // If returned user is empty (no match):
                    if (!foundUser) {
                        // Check if user exists by email instead:
                        User.findOne({ email: user.login_id })
                            .then(function(foundEmail) {
                                // If empty user is returned (no match):
                                if (!foundEmail) {
                                    err.errors.email = {
                                        message: new Error('Username or Email provided is not registered.').message
                                    };
                                    // Run callback returning errors:
                                    callback(err);
                                }
                                // If email is found, run password authorization:
                                else {
                                    console.log("Checking password....");
                                    /*---------------------------*/
                                    /*----- VERIFY PASSWORD -----*/
                                    /*---------------------------*/
                                    // Verifies password and runs callback after:
                                    checkPassword(foundEmail);
                                }
                            })
                            .catch(function(err) {
                                // This will only catch if the email query itself failed:
                                err.errors.email = {
                                    message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY EMAIL QUERY"').message
                                };
                                // Run Callback:
                                callback(err);
                            })
                    }
                    else {
                        console.log("Checking password...");
                        /*---------------------------*/
                        /*----- VERIFY PASSWORD -----*/
                        /*---------------------------*/
                        // Verifies password and runs callback after:
                        checkPassword(foundUser);
                    }
                })
                .catch(function(err) {
                    // This will only catch of the username query failed:
                    console.log("There's been an error.");
                    console.log(err)
                    err.errors.username = {
                        message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY USERNAME QUERY".').message
                    };
                    callback(err);
                })

        }

        // Internal function merely for confirming password match:
        function checkPassword(userObj) {
            userObj.verifyPassword(user.password)
                .then(function() {
                    console.log("Password has been verified.");
                    callback(err, userObj);
                })
                .catch(function() {
                    err.errors.password = {
                        message: new Error('Password is incorrect.').message
                    };
                    callback(err);
                })
        };

    }, // end login validation method
}
