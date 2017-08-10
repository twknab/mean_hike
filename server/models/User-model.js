/*
To better understand what's contained in this file, please read the notes below:

The roles of this file are to:
    - Set the schema for the User model and import any req'd dependenices.
    - Validate User database updates, such as Login, Registration and Update validations.
    - The various validation methods mentioned above, are composed of smaller instance methods, which perform a validations.
    - If instance method validations fail, an error object is returned. If instance method validations pass, in most cases, `undefined` is returned.

Note: To help the reader, I've organized the code into the following headings. Due to the length of this file, you might wish to `CTRL + F` and search within this file for each method you'd like to investigate.

<<---------------------------

1. DEPENDENCIES
2. SCHEMA
3. LOGIN VALIDATION
4. REGISTRATION VALIDATION
5. UPDATE VALIDATION
6. PRIVATE INSTANCE METHODS:

    - Duplicate Check Validations:
        - __checkUsernameDuplicates() - Check for duplicate Username.
        - __checkEmailDuplicates() - Check for duplicate Email.

    - All Fields / Login Length:
        - __checkAllRegFields() - All registration fields req'd check.
        - __checkAllLoginFields() - All login fields req'd check.
        - __checkLoginLength() - Login length check.

    - Username Validations:
        - __alphaNum_Username() - Alphanumeric and underscore regex check.
        - __checkUsernameLength() - Check username length.
        - __updateUsername() - Update username.

    - Email Validations:
        - __emailMatch() - Check if email and confirm email match.
        - __validateEmailFormat() - Check if email format is valid.
        - __checkEmailLength() - Check email length.
        - __updateEmail() - Update email:

    - Password Validations:
        - __passwordMatch() - Check if password and password confirm match.
        - __strongPassword() - Ensure password is strong.
        - __hashPassword() - Hashes password for encryption.
        - __verifyPassword() - Compares password to hash password on record.
        - __checkPassword() - If password is verified, returns validated User, else returns errors.

7. MODEL CREATION AND EXPORT

--------------------------->>
*/

/*********************************/
/*********************************/
/******** 1. DEPENDENCIES ********/
/*********************************/
/*********************************/

// Setup dependencies:
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-as-promised'),
    Schema = mongoose.Schema;


/***************************/
/***************************/
/******** 2. SCHEMA ********/
/***************************/
/***************************/

// Setup a schema:
var UserSchema = new Schema({
    username: {
        type: String,
        minlength: [2, 'Username must be at least 2 characters.'],
        maxlength: [30, 'Username must not be greater than 30 characters.'],
        required: true,
        trim: true,
        dropDups: true,
    }, // end username field
    email: {
        type: String,
        minlength: [5, 'Email must be at least 5 characters.'],
        maxlength: [50, 'Email must not be greater than 50 characters.'],
        required: true,
        trim: true,
        dropDups: true,
    }, // end email field
    password: {
        type: String,
        required: true,
        trim: true,
    }, // end password field
    hikes: [{ // holds hikes belonging to User
        type: Schema.Types.ObjectId,
        ref: 'Hike'
    }], // end hikes array
    WelcomeMsgStatus: { // if true, welcome msg will display
        type: Boolean,
        default: true,
    }, // end welcome msg status
}, {
    timestamps: true,
});

/********************************************/
/********************************************/
/******** 3. REGISTRATION VALIDATION ********/
/********************************************/
/********************************************/

/*--------------------------------------*/
/*---- USER REGISTRATION VALIDATION ----*/
/*--------------------------------------*/

UserSchema.methods.validateRegistration = function(formData, callback) {
    /*
    Validates full registration data utilizing private instance validation methods.

    Parameters:
    - `formData` - Registration data object to be validated (for new User creation.
    - `callback` - Callback function to run once validation completes (please see the `register()` method in `user-controller.js` to examine the callback function).

    The following is validated within this method:
    - all fields must be filled out.
    - username or email cannot already exist.
    - username must contain alphanumerical characters only.
    - email and confirmation email must match.
    - email must be in a valid format.
    - password must match confirmation password.
    - password must be strong:
        - 12-20 characters
        - includes 2 lowercase
        - includes 1 uppercase
        - includes 1 symbol
        - includes 1 number
        - may not include your username
        - may not contain basic sequences

    Note: Please see the individual private instance functions for each specific validation.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or validated user:
    var validated = {
        errors: {}, // will hold errors
        validatedUser: {}, // will store validated user object
    };

    console.log("Beginning Phase One User Registration Validation now...");

    /*
    Run all validations and gather messages as an object. Please see each individual instance method at the bottom of this document to see how it works.

    If the validation fails, an error objectis returned. If the validation passes, in most cases, `undefined` is returned.
    */

    // Run phase one validations (all validations other than checking for duplicates):
    var validations = {
        allRegFields: self.__checkAllRegFields(formData),
        username: self.__alphaNum_Username(formData.username),
        emailMatch: self.__emailMatch(formData.email, formData.emailConfirm),
        emailFormat: self.__validateEmailFormat(formData.email),
        pwdMatch: self.__passwordMatch(formData.password, formData.passwordConfirm),
        pwdStrong: self.__strongPassword(formData.password, formData.username),
    };

    // If all fields fail validation, run callback right away and send errors, as other validations do not matter if all fields are not filled out:
    if (validations.allRegFields) {
        validated.errors.allRegFields = {
            message: validations.allRegFields.message
        }
        callback(validated);
    }

    // Else, all fields are filled out -- begin all other validations:
    else {

        // If username alphanumeric and underscore only validation failed, add error to errors object:
        if (validations.username) {
            validated.errors.username = {
                message: validations.username.message
            }
        }

        // If email and confirmation email validation failed, add error to our errors object:
        if (validations.emailMatch) {
            validated.errors.email = {
                message: validations.emailMatch.message
            }
        }

        // If email format validation failed, add error to errors object:
        if (validations.emailFormat) {
            validated.errors.emailFormat = {
                message: validations.emailFormat.message
            }
        }

        // If password and password confirmation match failed, add error to errors object:
        if (validations.pwdMatch) {
            validated.errors.password = {
                message: validations.pwdMatch.message
            }
        }

        // If strong password validation failed, add error to errors object:
        if (validations.pwdStrong) {
            validated.errors.passwordStrength = {
                message: validations.pwdStrong.message
            }
        }

        // If there are any errors at this point in Phase One, send them:
        if (Object.keys(validated.errors).length > 0) {
            console.log("Failed Phase One Basic Validations. Errors validating:", validated.errors);
            // Run callback with errors list:
            callback(validated);
        } else {
            console.log('Passed Phase One Basic Validation. Beginning Phase Two (Checking for Duplicates)...');

            // Run duplicate check for Username first (and then Email):
            self.__checkUsernameDuplicates(formData.username, function(usernameDuplicateError) {
                // If duplicate username error is returned, add it to errors object:
                if (usernameDuplicateError) {
                    validated.errors.usernameDuplicate = {
                        message: usernameDuplicateError.message,
                    }
                }

                // Run duplicate check for Email now:
                self.__checkEmailDuplicates(formData.email, function(emailDuplicateError) {
                    // If duplicate email error is returned, add it to errors object:
                    if (emailDuplicateError) {
                        validated.errors.emailDuplicate = {
                            message: emailDuplicateError.message,
                        }
                    }

                    // Check for errors in Phase Two, if errors are found, run callback with errors:
                    if (Object.keys(validated.errors).length > 0) {
                        console.log("Failed Phase Two validations, duplicates detected, returning errors now...");
                        callback(validated);
                    }

                    // Else, if no errors, create user, hash password and send back:
                    else {
                        console.log("Passed Phase Two validations.");
                        User.create(formData)
                            .then(function(newUser) {
                                /*
                                Creates a new User and applies any mongoose validations; if successful, User object is returned as `newUser`, else, catch function below runs, returning errors.
                                */

                                // Hash password:
                                newUser.__hashPassword(newUser.password);
                                // Add validated user to validated object:
                                validated.validatedUser = newUser;
                                // Send back validated object with validated user attached:
                                callback(validated);
                            })
                            .catch(function(regErr) {
                                /*
                                Catches any errors if create() function with built-in mongoose validations fail; returns errors as `regErr`.
                                */

                                // Log errors and runcallback with errors:
                                console.log('Error trying to create user!', regErr);
                                callback(regErr);
                            })
                    };
                });
            });
        };
    };
};

/*************************************/
/*************************************/
/******** 4. LOGIN VALIDATION ********/
/*************************************/
/*************************************/

/*-------------------------------*/
/*---- USER LOGIN VALIDATION ----*/
/*-------------------------------*/

UserSchema.methods.validateLogin = function(formData, callback) {
    /*
    Validates full login data utilizing private instance validation methods.

    Parameters:
    - `formData` - Login data object to be validated (for existing User validation and retrieval).
    - `callback` - Callback function to run once validation completes (please see the `login()` method in `user-controller.js` to examine the callback function).

    The following is validated within this method:
    - all fields must be filled out.
    - login id must be greater than 2 characters, less than 30 characters.
    - password must be greater than 12 characters, less than 50 characters.
    - login id is looked up by username, then email and errors sent if any (user may login with username OR email).
    - if user is found, password is verified with retreived user.

    Note: Please see the individual private instance functions for each specific validation.
    */

    // Save `this` as as self:
    var self = this;

    // Create validation object to hold any errors or validated user:
    var validated = {
        errors: {},
        validatedUser: {},
    };

    console.log("Beginning Phase One User Login Validation now...");

    // Run all Phase One validations and gather messages as a dictionary:
    var validations = {
        allLoginFields: self.__checkAllLoginFields(formData),
        loginLength: self.__checkLoginLength(formData),
    };

    // If all fields error is returned, run callback and send errors right away, as other validations do not matter at this point:
    if (validations.allLoginFields) {
        console.log('Error: All login fields have not been submitted.');
        validated.errors.allLoginFields = {
            message: validations.allLoginFields.message
        };
        callback(validated);
    }

    // Else, all fields are filled out -- begin all other validations:
    else {

        console.log("All fields submitted...Checking min/max length...")

        // If login ID and password length fails validation, add error to errors object and send back errors right away (as we need proper login length to validate username):
        if (validations.loginLength) {
            validated.errors.loginLength = {
                message: validations.loginLength.message
            }
            callback(validated);
        }

        // Else, if login ID is proper length, see if you can find user by email or username using login ID. Note: This is so that the user may enter in either their username, or email, and we'll look for either one:
        else {

            console.log("Passed Phase One validations...starting Phase Two validations now...(using login ID to find user by username or email)...");

            // Attempt to lookup user by username, if not found, attempt to lookup by email -- verify password afterwards:

            // Check if User exists by using login ID to lookup user by username first:
            User.findOne({
                    username: formData.loginId
                })
                .then(function(foundUserByUsername) {
                    // If returned user is empty (no match):
                    if (!foundUserByUsername) {
                        // Check if User exists by using login ID to lookup user by email next:
                        User.findOne({
                                email: formData.loginId
                            })
                            .then(function(foundUserByEmail) {
                                // If empty user is returned (no match) add error to errors object:
                                if (!foundUserByEmail) {
                                    validated.errors.loginNotFound = {
                                        message: new Error('Username or Email provided is not registered.').message
                                    };
                                    // Run callback with errors:
                                    callback(validated);
                                }
                                /*
                                Else, if user is found by email, check password, passing in the user whom was found by email, the password submitted from the login form (for verification), the validated object and the callback function, which will run after the password is either successfully or unsuccessfully verified. Please see the `__checkPassword()` instance method below to better understand how this works.
                                */
                                else {
                                    // Else, if user is found by email, check password:
                                    console.log("Checking password....");
                                    foundUserByEmail.__checkPassword(foundUserByEmail, formData.password, validated, callback);
                                }
                            })
                            .catch(function(err) {
                                /*
                                Catches errors if findOne mongoose query fails while using login ID to query for email.
                                */
                                console.log('Error performing query for user by email.', err);
                                validated.errors.email = {
                                    message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY EMAIL QUERY"').message
                                };
                                // Run callback with errors:
                                callback(validated);
                            })
                    } else {
                        // Else, if user found by username, check password, passing in the user, the password submitted, the validated object and the callback function. Please see the `__checkPassword()` instance method below to better understand how this works.
                        console.log("Checking password...");
                        foundUserByUsername.__checkPassword(foundUserByUsername, formData.password, validated, callback);
                    }

                })
                .catch(function(err) {
                    /*
                    Catches errors if findOne mongoose query fails while using login ID to query for a username.
                    */
                    console.log("Error performing query for user by username.", err);
                    validated.errors.username = {
                        message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY USERNAME QUERY".').message
                    };
                    callback(validated);
                })
        };
    };
};

/**************************************/
/**************************************/
/******** 5. UPDATE VALIDATION ********/
/**************************************/
/**************************************/

/*--------------------------------*/
/*---- USER UPDATE VALIDATION ----*/
/*--------------------------------*/

UserSchema.methods.validateUpdate = function(formData, callback) {
    /*
    Validates full update user account data utilizing private instance validation methods.

    Parameters:
    - `formData` - User update data object to be validated.
    - `callback` - Callback function to run once validation completes (please see the `update()` method in `user-controller.js` to examine the callback function).

    The following is validated:
        - username and email must not be taken.
        - username must be greater than 2 characters, less than 30 characters.
        - email address must be valid format.
        - email address and confirmation must match.
        - password must be greater than 12 characters, less than 50 characters.
        - password and password confirmation must match.

    Note: Please see the individual private instance functions for each specific validation.

    This is the general flow of our validations (psuedo-code):

    First, if no change is detected in the username entered, or the email, or if
    the password has not been submitted, run the callback and send a message to
    the controller for the view.

    Otherwise, begin validations:

    I. PHASE ONE VALIDATIONS:

        If username has changed:
            - generate alphanumerical errors
            - generate min and max length errors

        If email has changed:
            - generate email formatting errors
            - check that matches email confirmation
            - generate min and max length errors

        If password submitted but not confirmation password:
            - Send error that confirmation is req'd

        If password and confirmation password submitted:
            - check for strong password
            - check that matches password confirmation
            - if passes, hash and update password

    II. PHASE TWO VALIDATIONS:

        Check if there are errors at this point:
            - Run callback with errros

        Else, if no errors, perform username and email duplication validations:

            - Run duplicate checks on Username and Email (this must be done step-wise due to asynchronicity).
            - If errors, add them to the errors object (which is otherwise empty, if having made it to Phase Two).
            - If nothing changed, send message saying so.
            - If no errors, and email or username does not match that on record, update it.
            - After both queries are complete, run the callback, passing in the errors object.
    */

    // Save `this` as as self:
    var self = this;

    // Create errors object to hold any errors or messages we want to send to our view:

    /*
    Development Note: It probably would be best to create a separate object to hold
    messages, however for simplicity, I've chosen to attach errors, and messages to
    the same `validated` object. This object is then passed into the callback function.
    In the controller, a check is made if messages or errors are present, and are
    handled accordingly (see `user-controller.js`).
    */

    var validated = {
        errors: {},
        messages: {},
    };

    // Begin phase one validations, checking for most basic validations, before
    // proceeding to checking for duplicates in phase two:
    console.log('Beginning Phase One validations now...');

    // If username submitted differs from that in document record, begin performing username validations:
    if (formData.username != self.username) {
        // Run alphanumerical and underscore validation:
        console.log('Username change detected. Checking for alphanumeric and underscore only...');
        var alphaNum_validate = self.__alphaNum_Username(formData.username);

        // Run min and max length validation:
        console.log('Checking for min and max length of new username...');
        var minMaxValidate = self.__checkUsernameLength(formData.username);

        // If username fails alphanumeric and underscore validation, add it to errors object:
        if (alphaNum_validate) {
            validated.errors.usernameAlphaNum_ = {
                message: alphaNum_validate.message
            }
        }

        // If username fails minimum and maximum validation, add it to errors object:
        if (minMaxValidate) {
            validated.errors.usernameMinMax = {
                message: minMaxValidate.message
            }
        }
    }

    // If email submitted differs from that in existing document record (or if confirmation email field is not undefined or is not an empty object). This detects if user has changed the email or email confirmation fields:
    if (formData.email != self.email || (formData.emailConfirm != undefined && formData.emailConfirm != "")) {

        // Run valid email format validation:
        console.log('Email change detected. Checking valid email format...');
        var emailFormatValidate = self.__validateEmailFormat(formData.email);

        // Run email and email confirm validation:
        console.log('Checking if email address matches email confirmation...');
        var emailConfirmValidate = self.__emailMatch(formData.email, formData.emailConfirm);

        // Run min and max length validation:
        console.log('Checking for min and max length of new email...');
        var minMaxValidate = self.__checkEmailLength(formData.email);

        // If errors are returned from either validation, add it to errors object:
        if (emailFormatValidate) {
            validated.errors.emailFormat = {
                message: emailFormatValidate.message
            }
        }
        if (emailConfirmValidate) {
            validated.errors.emailConfirm = {
                message: emailConfirmValidate.message
            }
        }
        if (minMaxValidate) {
            validated.errors.emailMinMax = {
                message: minMaxValidate.message
            }
        }
    }

    // If the password or the password confirmation are not filled out:
    if ((formData.password && formData.passwordConfirm == undefined) || (formData.password == undefined && formData.passwordConfirm)) {
        validated.errors.passwordMatch = {
            message: 'Password and Password Confirmation fields are both required to update your password.'
        };
    }

    // If both a password and password confirmation are submitted:
    if (formData.password && formData.passwordConfirm) {
        // Run password and password confirm validation:
        console.log('Password and password confirmation change detected. Checking if password matches password confirmation...');
        var passwordConfirmValidate = self.__passwordMatch(formData.password, formData.passwordConfirm)

        // Run strong password validation:
        console.log('Checking if password submitted is strong...');
        var passwordStrong = self.__strongPassword(formData.password, formData.username);

        // If errors are returned from either validation, add it to errors object:
        if (passwordConfirmValidate) {
            validated.errors.passwordConfirm = {
                message: passwordConfirmValidate.message
            }
        } else if (passwordStrong) {
            validated.errors.strongPassword = {
                message: passwordStrong.message
            }
        }
        // If neither error is returned, hash password and update it:
        else {
            // Hash password and update it:
            console.log("Password passed confirmation and strength validations. Hashing now...");
            self.__hashPassword(formData.password);

            // Add a success message to the validated object noting that the password was successfully updated.
            validated.messages.passwordUpdated = {
                hdr: "Password Updated!",
                msg: "Your password was succesfully updated.",
            };
            console.log("Completed password hashing:", self.password);
        }
    }


    // If there are any errors at this point, return your callback with
    // errors -- do not check for duplicates until Phase One passes without error:
    if (Object.keys(validated.errors).length > 0) {
        console.log("Failed Phase One validations, returning errors now...");
        callback(validated);
    }

    // Else, if no errors are returned from Phase One validations, proceed with Phase Two:
    else {
        console.log("Passed Phase One validations. Starting Phase Two validations...");

        // Run duplicate check for Username first (and then Email):
        self.__checkUsernameDuplicates(formData.username, function(usernameDuplicateError) {
            /* If an error is returned AND the username submitted does not match the username on document record, add the error to the errors object. Note: The reason we have to make sure the username does not match that on record is otherwise, a user whom does not change their username and submits the form will be flagged as having found a username duplicate. Thus, we only choose to log the duplicate error if a duplicate error was returned AND the user changed their username from that which is on record:
            */
            if (usernameDuplicateError && formData.username != self.username) {
                validated.errors.usernameDuplicate = {
                    message: usernameDuplicateError.message,
                }
            }

            // Run duplicate check for Email now:
            self.__checkEmailDuplicates(formData.email, function(emailDuplicateError) {
                // If error is returned AND email submitted does not match one on record (for same explanations as above--to only catch email duplicate errors for those whom actually have attempted to change their username), add the error to the erros object:
                if (emailDuplicateError && formData.email != self.email) {
                    validated.errors.emailDuplicate = {
                        message: emailDuplicateError.message,
                    }
                }

                // Check for errors through Phase Two, if found, run callback with errors:
                if (Object.keys(validated.errors).length > 0) {
                    console.log("Failed Phase Two validations, duplicates detected, returning errors now...");
                    callback(validated);
                }

                // Else, if no errors, update username and run callback passing in empty errors object:
                else {
                    console.log("Passed Phase Two validations.");

                    /* If Phase Two validations have completed, but no user details have been changed, generate a message and run callback right away.

                    Note: This may not be the cleanest way to do this, and possibly could have been done initially in our validation, however I got this working to this point and kept it here as it seemed to not make a big difference and flowed with my thought processes...however, this could likely be improved.

                    We essentially want to make sure that if no details have been attempted to have been updated, that we alert the user that nothing has changed. This checks if the username, email, and password fields have not been altered or have any data worthy of validation -- if these requirements are satisfied, a no change message is sent.
                    */
                    if (formData.username == self.username && formData.email == self.email && (formData.password == undefined || !formData.password)) {
                        console.log('No changes in username, email or password have been detected.');

                        // Send message that no changes were made to the account:
                        validated.messages.noChange = {
                            hdr: "Nothing Changed!",
                            msg: "You haven't made any changes to your account. Try again or ",
                        };
                    }

                    // If email does not match one on record (and has passed al validations to get to this point), update it:
                    if (formData.email != self.email) {
                        console.log('Updating email now...');

                        // Update email:
                        self.__updateEmail(formData.email);

                        // Send success message that email has been updated:
                        validated.messages.emailUpdated = {
                            hdr: "Email Updated!",
                            msg: "Your email address was successfully updated.",
                        };
                        console.log("Email update now complete.");
                    }

                    // If, username does not match one on record, update it:
                    if (formData.username != self.username) {
                        console.log('Updating username now...');

                        // Update username:
                        self.__updateUsername(formData.username);

                        // Send success message:
                        validated.messages.usernameUpdated = {
                            hdr: "Username Updated!",
                            msg: "Your username was successfully updated.",
                        };
                        console.log("Username update complete.");
                    }

                    // Run callback, sending validate object which should contain no errors and only success messages for any of the changes (or lack therof) that were made:
                    callback(validated);
                }
            })
        })
    }

};


/*********************************************/
/*********************************************/
/******** 6. PRIVATE INSTANCE METHODS ********/
/*********************************************/
/*********************************************/

/*-------------------------------------*/
/*---- Duplicate Check Validations ----*/
/*-------------------------------------*/

UserSchema.methods.__checkUsernameDuplicates = function(username, callback) {
    /*
    Checks if duplicate username is found via a case insensitive mongoose query.

    Parameters:
    - `username` - The username to be validated.
    - `callback` - The callback function to be executed at the query completion.
    */

    console.log('Checking username for duplicates (case insensitive query)...');

    // Look for existing user by a case insensitive query using `username`:
    User.findOne({
            username: {
                $regex: new RegExp("^" + username + "$", "i")
            }
        })
        .then(function(matchedUser) {
            /*
            Returns query results; if successful a User object will exist, if no matches, object will be empty.
            */

            // If matched user is found, run callback with error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this username.');
                var err = new Error('Username already in use by another user.');
                callback(err);
            }

            // Else, if returned object is empty, and no User is retreived, run callback sendings `undefined` (no error):
            else {
                callback(undefined);
            }
        })
        .catch(function(err) {
            /*
            Catches any errors returned if findOne mongoose query fails to execute properly.
            */

            // Log any errors and run callback sending errors:
            console.log('Error querying mongoDB for duplicate username...Please contact administrator.', err);
            callback(err);
        })
};

UserSchema.methods.__checkEmailDuplicates = function(email, callback) {
    /*
    Checks if duplicate email is found via a case insensitive mongoose query.

    Parameters:
    - `email` - The email to be validated.
    - `callback` - The callback function to be executed at the query completion.
    */

    console.log('Checking email for duplicates (case insensitive query)...');

    // Look for existing user by case insensitive email query:
    User.findOne({
            email: {
                $regex: new RegExp("^" + email + "$", "i")
            }
        })
        .then(function(matchedUser) {
            // If matched user is found by email address and an object is returned, run callback and send an error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this email address.');
                var err = new Error('Email address already in use by another user.');
                callback(err);
            }

            // Else, run callback sending `undefined` (no error):
            else {
                callback(undefined);
            }
        })
        .catch(function(err) {
            /*
            Catches any errors if our findOne mongoose query fails to execute properly.
            */
            console.log('Error querying mongoDB for duplicate email address...Please contact administrator.', err);
            callback(err);
        })
};

/*-----------------------------------*/
/*---- All Fields / Login Length ----*/
/*-----------------------------------*/

UserSchema.methods.__checkAllRegFields = function(regFormData) {
    /*
    Checks if all registration fields are filled out; there should be 5 fields.

    Parameters:
    - `regFormData` - Registration form data object sent from User controller.
    */

    // If less than 5 fields have been submitted, create error and return it:
    if (Object.keys(regFormData).length < 5) {
        // Format Error Object for Angular:
        var err = new Error('All fields are required.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__checkAllLoginFields = function(loginFormData) {
    /*
    Checks if all login fields are filled out; there should be 2 fields.

    Parameters:
    - `loginFormData` - Login form data object sent from User controller.
    */

    // If less than 2 fields have been submitted, create error and return it:
    if (Object.keys(loginFormData).length < 2) {
        var err = new Error('All fields are required.');
        return err;
    }

    /*
    Else, check if the fields submitted are not empty objects and send error if so. Note: this is in the event the user submits login data, than erases both fields -- the empty `loginId` and `password` objects submitted will flag the error below:
    */
    else {
        if (Object.keys(loginFormData.loginId).length < 1 || Object.keys(loginFormData.password).length < 1) {
            var err = new Error('All fields are required.');
            return err;
        }

        // Else, return `undefined` (no error):
        else {
            return undefined;
        }
    }
};

UserSchema.methods.__checkLoginLength = function(loginFormData) {
    /*
    Checks if all login fields are proper min and max length.

    Parameters:
    - `loginFormData` - Login form data object sent from User controller.
    */

    // Capture `this` variable:
    var self = this;

    console.log('Login ID and password detected...checking length...');

    // Check if loginFormData contains keys:
    if (Object.keys(loginFormData).length > 0) {
        console.log("Login form submitted.")
        // If login ID length is less than 2 but greater than 30 characters, flag an error, OR if password length is less than 12 or greater than 50 characters, flag an error:
        if (loginFormData.loginId.length < 2 || loginFormData.loginId.length > 30 || loginFormData.password.length < 12 || loginFormData.password.length > 50) {
            var err = new Error('Username or Email must be between 2-30 characters. Password must be between 12-50.');
            return err;
        } else {
            // Else, return `undefined` (no error):
            return undefined;
        }
    }

    // Else, in the event this function runs with an empty object, send it off to check all req'd fields function (note: this is probably unnecessary but I chose to put this in to secure this function a bit more -- but it may be unnecessary. Development Note: Investigate this further.)
    else {
        self.__checkAllLoginFields(loginFormData);
    }
};


/*--------------------------------*/
/*----- Username Validations -----*/
/*--------------------------------*/

UserSchema.methods.__alphaNum_Username = function(username) {
    /*
    Checks if username does NOT contain only letters, numbers and underscores.

    Parameters:
    - `username` - Username to be validated.
    */

    // Test regex object against username, if username is NOT returned as `true` (aka returned as `false`), send error (this means the username did not contain only alphanumerical and underscore characters):
    if (!(/^[a-z0-9_]+$/i.test(username))) {
        var err = new Error('Username may contain only letters, numbers or underscores.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__checkUsernameLength = function(username) {
    /*
    Checks username length is between minimum or maximum characters.

    Parameters:
    - `username` - Username to be validated.

    Note: This only runs when we are updating the User via the update user account page. Development Note: We could try and turn on the validations option using FindOneandUpdate, however I chose against this option having difficulty getting it to work (perhaps an area to improve):
    */

    // If username length is less than 2 char, generate an error and return it:
    if (username.length < 2) {
        var err = new Error('Username must be at least 2 characters.');
        return err;
    }

    // Else if username is greater than 30 characters, generate error and return it:
    else if (username.length > 30) {
        var err = new Error('Username must be no greater than 30 characters.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__updateUsername = function(username) {
    /*
    Update a username.

    Parameters:
    - `username` - Validated username to be updated.
    */

    var self = this;
    self.username = username;
    self.save();
};

/*---------------------------------*/
/*------- Email Validations -------*/
/*---------------------------------*/

UserSchema.methods.__emailMatch = function(email, emailConfirm) {
    /*
    Checks email and confirmation email fields match (via new User registration).

    Parameters:
    - `email` - Email address submitted from registration data.
    - `emailConfirm` - Confirmation email address submitted.
    */

    // If email and confiramtion email do not match, generate error and return it:
    if (email !== emailConfirm) {
        var err = new Error('Email and Confirmation Email fields must match.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__validateEmailFormat = function(email) {
    /*
    Checks if email does NOT match valid formatting.

    Parameters:
    - `email` - email to be validated.
    */

    // If email does not match the regex code, than it is invalid: generate error and return it:
    if (!(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(email))) {
        var err = new Error('Email address must have valid formatting.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__checkEmailLength = function(email) {
    /*
    Checks if email length is proper min and max length.

    Parameters:
    - `email` - Email to be validated.

    Note: This only runs on our user update function, for the same reasons mentioned in __checkUsernameLength(). Beacause we chose not to use findOneAndUpdate with the mongoose validations option set to true, we have to manually validate the length (Development Note: this could be an area to improve).
    */

    // If email is less than 5 characters, generate error and send it:
    if (email.length < 5) {
        var err = new Error('Email must be at least 5 characters.');
        return err;
    }

    // Else if email length is greater than 50 characters, generate error and send it:
    else if (email.length > 50) {
        var err = new Error('Email must be no greater than 50 characters.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

UserSchema.methods.__updateEmail = function(email) {
    /*
    Updates email address for User.

    Parameters:
    - `email` - Validated email address to be updated.
    */

    var self = this;
    self.email = email;
    self.save();
};

/*--------------------------------*/
/*----- Password Validations -----*/
/*--------------------------------*/

UserSchema.methods.__passwordMatch = function(password, passwordConfirm) {
    /*
    Checks if password and confirmation password submitted from Registration data match.

    Parameters:
    - `password` - Password submitted via User registration.
    - `password Confirm` - Confirmation password submitted via User registration.
    */

    // If password does not match confirmation password, generate error and return it:
    if (password !== passwordConfirm) {
        var err = new Error('Password fields must match.');
        return err;
    }

    // Else, return undefein
    else {
        return undefined;
    }
};

UserSchema.methods.__strongPassword = function(password, username) {
    /*
    Checks if password is strong and does not contain username or basic sequences

    Parameters:
    - `password` - Password to be validated as strong.
    - `username` - Username to confirm is not contained within password.
    */

    var strongPassword = /^(?!.*(.)\1{2})(?=(.*[\d]){1,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){1,})(?!(?=.*(asdf|qwerty|123|\s)))(?:[\da-zA-Z@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){12,20}$/;

    // Development Note: Improve the way that you generated the above regex object. This works, but doesn't seem quite right (for example, try making a comment via `//` right above that declaration)

    // If password does NOT match for strong password requirements, if not, generate an error and return it:
    if (!strongPassword.test(password)) {
        console.log('Failed strong password detection.');
        var err = new Error('Password must be strong. Requirements: between 12-20 characters, includes 2 lowercase, 1 uppercase, 1 symbol, 1 number and may not include your username or basic sequences.');
        return err;
    }

    // Else, strong password has passed, but now check to ensure the username is not contained within the password:
    else {
        console.log('Passed strong password detection.');
        // Check if password contains username
        console.log('Checking if username is contained in password...');

        // Create regex pattern with username case insensitive:
        var usernameRegEx = new RegExp(username, "i");

        // If username matches characters within password, generate error and return it:
        if (usernameRegEx.test(password)) {
            console.log('Failed, Username is contained in password. Not strong.');
            var err = new Error('Password cannot contain username.');
            return err;
        }

        // Else, return `undefined`, as password has passed all phases of validation (strong and does not contain username).
        else {
            console.log('Passed, Username not found in password.');
            return undefined;
        }
    }
};

UserSchema.methods.__hashPassword = function(password) {
    /*
    Hash a password and update password for a User.

    Parameters:
    - `password` - Validated password to be hashed and updated
    */

    // Capture `this` variable:
    var self = this;

    // Hash password then save it:
    console.log('Hashing password...');
    bcrypt.hash(password, 12) // will return a promise
        .then(function(hash) {
            /*
            Returns hashed password.
            */

            // Save hashed password:
            console.log('Password has been hashed:', hash);
            self.password = hash; // updates p/w entry to hash
            self.save();

            // Send back undefined (we don't need anything) as there is no error:
            return undefined;
        })
        .catch(function(err) {
            /*
            Catch any errors if password hasing fails to execute properly.
            */

            // Log error and return it:
            console.log(err);
            var error = new Error('Password hashing failed.');
            console.log(err.message);
            return error;
        });
};

UserSchema.methods.__verifyPassword = function(enteredPassword) {
    /*
    Hash a string and compare it against a stored string; we use this to verify our user password, and returns `true` if password matches, or `false` if password does not match encrpyted string.

    Parameters:
    - `enteredPassword` - Password to be validated against stored document hashed string.
    */

    console.log("Verifying password now...");
    return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.__checkPassword = function(userObj, password, validate, callback) {
    /*
    Checks if password is valid, and if so, attaches the user submitted to the validated object and runs a callback passing it in.

    Parameters:
    - `userObj` - User object whose password we are validating.
    - `password` - Password that we are validating.
    - `vaidate` - Validate object that we can attach a validatd user to if password verification is successful.
    - `callback` - Callback function which runs after password has been varified, returning validated object containing either the validated user or password verification error.
    */

    // Run verify password private function (accepts `password` string to be verified):
    userObj.__verifyPassword(password)
        .then(function() {
            /*
            Runs if password verification result is `true`; attaches validated user to `validate` object and returns it:
            */

            console.log("Password has been verified.");
            validate.validatedUser = userObj;
            callback(validate);
        })
        .catch(function(err) {
            /*
            Catches any errors if Password verification fails.
            */

            // Generate a new error, attach it to errors object and run callback, passing it along:
            console.log("Password is incorrect. Access denied.");
            validate.errors.passwordFail = {
                message: new Error('Login failed. Please check your login credentials and try again.').message
            };
            // Run callback:
            callback(validate);
        })
};

/***************************************/
/***************************************/
/****** 7. MODEL CREATION & EXPORT *****/
/***************************************/
/***************************************/

// Instantiate Mongoose Model:
var User = mongoose.model('User', UserSchema);

// Export Model:
module.exports = User;
