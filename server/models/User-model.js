/*

Note: There are a lot of instance methods in this models file. If you're reading this, in order to be less overwhelmed, here's the organization of the contents of the file below:

1. Dependencies
2. Schema
3. Login Validation
4. Registration Validation
5. Update Validation
6. Private Instance Methods:
    - Duplicate Username or Email:
        - __checkUsernameDuplicates() - Duplicate Username check.
        - __checkEmailDuplicates() - Duplicate Email check.

    - All Fields / Login Length:
        - __checkAllRegFields() - All registration fields req'd check.
        - __checkAllLoginFields() - All login fields req'd check.
        - __checkLoginLength() - Login length check.

    - Username:
        - __alphaNum_Username() - Alphanumeric and underscore regex check.
        - __checkUsernameLength() - Check username length.
        - __updateUsername() - Update username.

    - Email:
        - __emailMatch() - Check if email and confirm email match.
        - __validateEmailFormat() - Check if email format is valid.
        - __checkEmailLength() - Check email length.
        - __updateEmail() - Update email:

    - Password:
        - __passwordMatch() - Check if password and password confirm match.
        - __strongPassword() - Ensure password is strong.
        - __hashPassword() - Hashes password for encryption.
        - __verifyPassword() - Decrypts a password.
        - __checkPassword() - Compares a submitted password to encrypted hash stored for user.
7. Model Creation and Export
*/

/******************************/
/******************************/
/******** DEPENDENCIES ********/
/******************************/
/******************************/

// Setup dependencies:
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-as-promised'),
    Schema = mongoose.Schema;


/************************/
/************************/
/******** SCHEMA ********/
/************************/
/************************/


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
    hikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Hike'
    }], // end hikes array
    welcome_msg_status: {
        type: Boolean,
        default: true,
    }, // end welcome msg status
}, {
    timestamps: true,
});

/************************************/
/************************************/
/******** VALIDATION METHODS ********/
/************************************/
/************************************/

/*--------------------------------------*/
/*---- USER REGISTRATION VALIDATION ----*/
/*--------------------------------------*/

UserSchema.methods.validateRegistration = function(formData, callback) {
    /*
    Validates full registration data using instance methods below.

    The following is validated:
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

    Note: Please see the individual instance functions for each specific validation.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or validated user:
    var validated = {
        errors: {}, // will hold errors
        validatedUser: {}, // will store validated user object
    };

    // Run all validations and gather messages as a dictionary:
    var validations = {
        allRegFields: self.__checkAllRegFields(formData),
        username: self.__alphaNum_Username(formData.username),
        emailMatch: self.__emailMatch(formData.email, formData.emailConfirm),
        emailFormat: self.__validateEmailFormat(formData.email),
        pwdMatch: self.__passwordMatch(formData.password, formData.passwordConfirm),
        pwdStrong: self.__strongPassword(formData.password, formData.username),
    };

    // Check all fields (if not, send errors right away):
    if (validations.allRegFields) {
        validated.errors.allRegFields = {
            message: validations.allRegFields.message
        }
        callback(validated);
    }

    // Else, all fields are filled out -- begin all other validations:
    else {

        // Check if username is alphanumerical with underscores only:
        if (validations.username) {
            validated.errors.username = {
                message: validations.username.message
            }
        }

        // Check if email and email confirm match:
        if (validations.emailMatch) {
            validated.errors.email = {
                message: validations.emailMatch.message
            }
        }

        // Check if email in proper email format:
        if (validations.emailFormat) {
            validated.errors.emailFormat = {
                message: validations.emailFormat.message
            }
        }

        // Check if password and password confirm match:
        if (validations.pwdMatch) {
            validated.errors.password = {
                message: validations.pwdMatch.message
            }
        }

        // Check if password is strong:
        if (validations.pwdStrong) {
            validated.errors.passwordStrength = {
                message: validations.pwdStrong.message
            }
        }


        // If there are any errors send them:
        if (Object.keys(validated.errors).length > 0) {
            console.log("Failed Phase One Basic Validations. Errors validating:", validated.errors);
            // Run callback with errors list:
            callback(validated);
        } else {
            console.log('Passed Phase One Basic Validation. Beginning Phase Two (Checking for Duplicates)...');

            // Run duplicate check for Username first (and then Email):
            self.__checkUsernameDuplicates(formData.username, function(usernameDuplicateError) {
                // If error:
                if (usernameDuplicateError) {
                    validated.errors.usernameDuplicate = {
                        message: usernameDuplicateError.message,
                    }
                }

                // Run duplicate check for Email now:
                self.__checkEmailDuplicates(formData.email, function(emailDuplicateError) {
                    // If error:
                    if (emailDuplicateError) {
                        validated.errors.emailDuplicate = {
                            message: emailDuplicateError.message,
                        }
                    }

                    // Check for errors, if found, run callback with errors:
                    if (Object.keys(validated.errors).length > 0) {
                        console.log("Failed Phase Two validations, duplicates detected, returning errors now...");
                        callback(validated);
                    }

                    // Else, if no errors, create user and hash password:
                    // Send back validated user to controller for session generation and to load a new view for user:
                    else {
                        console.log("Passed Phase Two validations.");
                        User.create(formData)
                            .then(function(newUser) {
                                // Hash password:
                                newUser.__hashPassword(newUser.password);
                                // Add validated user to validated object:
                                validated.validatedUser = newUser;
                                callback(validated);
                            })
                            .catch(function(regErr) {
                                console.log('Error trying to create user!', regErr);
                                callback(regErr);
                            })
                    };
                });
            });
        };
    };
};

/*-------------------------------*/
/*---- USER LOGIN VALIDATION ----*/
/*-------------------------------*/

UserSchema.methods.validateLogin = function(formData, callback) {
    /*
    Validates user data before logging user in.

    The following is validated:
        - all fields must be filled out.
        - login id must be greater than 2 characters, less than 30 characters.
        - password must be greater than 12 characters, less than 50 characters.
        - login id is looked up by username, then email and errors sent if any (user may login with username OR email).
        - if user is found, password is verified with retreived user.

    Note: Please see the individual instance functions for each specific validation.
    */

    // Save `this` as as self:
    var self = this;

    // Create validation object to hold any errors or validated user:
    var validated = {
        errors: {},
        validatedUser: {},
    };

    /*---------------------------------------*/
    /*--------- PHASE ONE VALIDATIONS -------*/
    /*---------------------------------------*/

    // Run all validations and gather messages as a dictionary:
    var validations = {
        allLoginFields: self.__checkAllLoginFields(formData),
        loginLength: self.__checkLoginLength(formData),
    };

    // Check all fields (if not, send errors right away):
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

        // Check if login ID and password is proper length:
        if (validations.loginLength) {
            validated.errors.loginLength = {
                message: validations.loginLength.message
            }
            callback(validated);
        }

        // If fields are filled out and appropriate length, send back emtpy errors list:
        else {

            /*---------------------------------------*/
            /*--------- PHASE TWO VALIDATIONS -------*/
            /*---------------------------------------*/

            // Attempt to lookup user by username, if not found, attempt to lookup by email -- verify password afterwards:

            // Check if User exists (check by username first):
            User.findOne({
                    username: formData.login_id
                })
                .then(function(foundUserByUsername) {
                    // If returned user is empty (no match):
                    if (!foundUserByUsername) {
                        // Check if User exists by email instead:
                        User.findOne({
                                email: formData.login_id
                            })
                            .then(function(foundUserByEmail) {
                                // If empty user is returned (no match):
                                if (!foundUserByEmail) {
                                    validated.errors.loginNotFound = {
                                        message: new Error('Username or Email provided is not registered.').message
                                    };
                                    // Run callback with errors:
                                    callback(validated);
                                }
                                // Else, if user is found by email, run password auth:
                                else {
                                    // Else, if user is found by email, check password:
                                    console.log("Checking password....");
                                    foundUserByEmail.__checkPassword(foundUserByEmail, formData.password, validated, callback);
                                }
                            })
                            .catch(function(validated) {
                                // This will only catch if the email query itself failed:
                                validated.errors.email = {
                                    message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY EMAIL QUERY"').message
                                };
                                // Run callback with errors:
                                callback(validated);
                            })
                    } else {
                        // Else, if user found by username, check password:
                        console.log("Checking password...");
                        foundUserByUsername.__checkPassword(foundUserByUsername, formData.password, validated, callback);
                    }

                })
                .catch(function(validated) {
                    // This will only catch of the username query failed:
                    console.log("Error performing query for user by username.");
                    validated.errors.username = {
                        message: new Error('There was a problem trying to find this user. Please contact administrator with error message: "FAIL BY USERNAME QUERY".').message
                    };
                    callback(validated);
                })
        };
    };
};

/*--------------------------------*/
/*---- USER UPDATE VALIDATION ----*/
/*--------------------------------*/

UserSchema.methods.validateUpdate = function(formData, callback) {
    /*
    Validates user data before updating user.

    The following is validated:
        - username and email must not be taken.
        - username must be greater than 2 characters, less than 30 characters.
        - email address must be valid format.
        - email address and confirmation must match.
        - password must be greater than 12 characters, less than 50 characters.
        - password and password confirmation must match.

    Please see the individual instance functions for each specific validation.

    This is the general flow of our validations (psuedo-code):

    First, if no change is detected in the suername entered, or the email, or if
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

    /*---------------------------------------*/
    /*--------- PHASE ONE VALIDATIONS -------*/
    /*---------------------------------------*/
    // Begin phase one validations, checking for most basic validations, before
    // proceeding to checking for duplicates in phase two:
    console.log('Beginning Phase One validations now...');

    // If username submitted differs from that in document record:

    if (formData.username != self.username) {
        // Run alphanumerical and underscore validation:
        console.log('Username change detected. Checking for alphanumeric and underscore only...');
        var alphaNum_validate = self.__alphaNum_Username(formData.username);

        // Run min and max length validation:
        console.log('Checking for min and max length of new username...');
        var minMaxValidate = self.__checkUsernameLength(formData.username);

        // If alhpanum_ error is returned, add it to errors object:
        if (alphaNum_validate) {
            validated.errors.usernameAlphaNum_ = {
                message: alphaNum_validate.message
            }
        }

        // If min/max error is returned, add it to errors object:
        if (minMaxValidate) {
            validated.errors.usernameMinMax = {
                message: minMaxValidate.message
            }
        }
    }

    // If email submitted differs from that in document record (or if confirmation email field has changed):
    if (formData.email != self.email || (formData.emailConfirm != undefined && formData.emailConfirm != "")) {

        // Run email format validation:
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
            // Hash password
            console.log("Password passed confirmation and strength validations. Hashing now...");

            // WHY IS PASSWORD NOT HASING CORRECTLY?
            self.__hashPassword(formData.password);
            validated.messages.passwordUpdated = {
                hdr: "Password Updated!",
                msg: "Your password was succesfully updated.",
            };
            console.log("Completed password hashing:", self.password);
        }
    }


    // If there are any errors at this point, return your callback with
    // errors -- do not check for duplicates until phase 1 passes without error:
    if (Object.keys(validated.errors).length > 0) {
        console.log("Failed Phase One validations, returning errors now...");
        callback(validated);
    }

    /*---------------------------------------*/
    /*--------- PHASE TWO VALIDATIONS -------*/
    /*---------------------------------------*/
    // Else, if no errors are returned from PHASE ONE validations, proceed with PHASE TWO:
    else {
        console.log("Passed Phase One validations. Starting Phase Two validations...");

        // Run duplicate check for Username first (and then Email):
        self.__checkUsernameDuplicates(formData.username, function(usernameDuplicateError) {
            // If error AND username submitted does not match username on document record, log it:
            if (usernameDuplicateError && formData.username != self.username) {
                validated.errors.usernameDuplicate = {
                    message: usernameDuplicateError.message,
                }
            }

            // Run duplicate check for Email now:
            self.__checkEmailDuplicates(formData.email, function(emailDuplicateError) {
                // If error AND email submitted does not match one on record, log it:
                if (emailDuplicateError && formData.email != self.email) {
                    validated.errors.emailDuplicate = {
                        message: emailDuplicateError.message,
                    }
                }

                // Check for errors, if found, run callback with errors:
                if (Object.keys(validated.errors).length > 0) {
                    console.log("Failed Phase Two validations, duplicates detected, returning errors now...");
                    callback(validated);
                }

                // Else, if no errors, update username and run callback passing in empty errors object:
                else {
                    console.log("Passed Phase Two validations.");

                    // If nothing has changed, generate a message and run callback right away:
                    if (formData.username == self.username && formData.email == self.email && (formData.password == undefined || !formData.password)) {
                        console.log('No changes in username, email or password have been detected.');

                        // Send message that no changes were made to the account:
                        validated.messages.noChange = {
                            hdr: "Nothing Changed!",
                            msg: "You haven't made any changes to your account. Try again or ",
                        };
                    }

                    // If email does not match one on record, update it:
                    if (formData.email != self.email) {
                        console.log('Updating email now...');
                        // Update email:
                        self.__updateEmail(formData.email);
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

                    // Run callback, sending empty error object:
                    callback(validated);
                }
            })
        })
    }

};


/**********************************/
/**********************************/
/******** INSTANCE METHODS ********/
/**********************************/
/**********************************/

/*--------------------------------------*/
/*---- DUPLICATE VALIDATION METHODS ----*/
/*--------------------------------------*/
/*
    The checkDuplicates() function accepts a callback function, which will run
    only if no duplicate username or email addresses are found. This validation occurs
    step-wise, first checking for a username, then for an email (using case insensiitive
    regex queries). An appropriate error is generated, depending upon the results:
*/

// Check if any username duplicates (case insensitive query) exist:
UserSchema.methods.__checkUsernameDuplicates = function(username, callback) {

    console.log('Checking username for duplicates (case insensitive query)...');
    User.findOne({
            username: {
                $regex: new RegExp("^" + username + "$", "i")
            }
        })
        .then(function(matchedUser) {
            // If matched user is found, run callback with error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this username.');
                var err = new Error('Username already in use by another user.');
                callback(err);
            }

            // Else, run callback with error as undefined (no error):
            else {
                callback(undefined);
            }
        })
        .catch(function(err) { // if our regex query goes awry this will catch any errors:
            console.log('Error querying mongoDB for duplicate username...Please contact administrator.', err);
            callback(err);
        })
};

// Check if any email duplicates (case insensitive query) exist:
UserSchema.methods.__checkEmailDuplicates = function(email, callback) {

    console.log('Checking email for duplicates (case insensitive query)...');
    User.findOne({
            email: {
                $regex: new RegExp("^" + email + "$", "i")
            }
        })
        .then(function(matchedUser) {
            // If matched user is found by email address, run callback with error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this email address.');
                var err = new Error('Email address already in use by another user.');
                callback(err);
            }

            // Else, run callback with error as undefined (no error):
            else {
                callback(undefined);
            }
        })
        .catch(function(err) { // if our regex query goes awry this will catch any errors:
            console.log('Error querying mongoDB for duplicate email address...Please contact administrator.', err);
            callback(err);
        })
};

/*------------------------------------------------------*/
/*---- ALL FIELDS / RED'D LENGTH VALIDATION METHODS ----*/
/*------------------------------------------------------*/
// Check if all registration fields are filled out (parameter is a dictionary of key value pairs from the form):
UserSchema.methods.__checkAllRegFields = function(regFormData) {
    if (Object.keys(regFormData).length < 5) {
        // Format Error Object for Angular:
        var err = new Error('All fields are required.');
        return err;
    } else {
        return undefined;
    }
};


// Check if all fields are filled out (parameter is a dictionary of key value pairs from the form):
UserSchema.methods.__checkAllLoginFields = function(loginFormData) {
    if (Object.keys(loginFormData).length < 2) {
        // Format Error Object for Angular:
        var err = new Error('All fields are required.');
        return err;
    } else {
        /*
            Note: The else statement here is necessary in case the user had previously entered data, the individual login keys are evaluated to ensure they contain data.

            For example, if a user previously entered invalid credentials, then cleared the fields, angular preserves its data {login_id: , password: } -- so although no new data has been submitted,
            the key values exist.

            We could, in our Angular Controller, change our error Callback so that the user field is rest (which would then remove the necessity of this code below), but then the user would lose whatever data they had submitted on screen and be unable to simply correct it.
        */
        if (Object.keys(loginFormData.login_id).length < 1 || Object.keys(loginFormData.password).length < 1) {
            var err = new Error('All fields are required.');
            return err;
        } else {
            return undefined;
        }
    }
};

// Check if login data for min and max lengths:
UserSchema.methods.__checkLoginLength = function(loginFormData) {
    var self = this;

    console.log('Login ID and password detected...checking length...');
    // Check if loginFormData contains keys:
    if (Object.keys(loginFormData).length > 0) {
        console.log("Login form submitted.")
        if (loginFormData.login_id.length < 2 || loginFormData.login_id.length > 30 || loginFormData.password.length < 12 || loginFormData.password.length > 50) {
            console.log('TOO SHORT OR LONG')
            var err = new Error('Username or Email must be between 2-30 characters. Password must be between 12-50.');
            return err;
        } else {
            return undefined;
        }
    } else {
        self.__checkAllLoginFields(loginFormData);
    }
};


/*---------------------------------------*/
/*----- USERNAME VALIDATION METHODS -----*/
/*---------------------------------------*/
// Check if username contains only alphanumerical and underscores:
UserSchema.methods.__alphaNum_Username = function(username) {
    if (!(/^[a-z0-9_]+$/i.test(username))) {
        var err = new Error('Username may contain only letters, numbers or underscores.');
        return err;
    } else {
        return undefined;
    }
};

// Check Username Length (For Updating User):
UserSchema.methods.__checkUsernameLength = function(username) {
    if (username.length < 2) {
        var err = new Error('Username must be at least 2 characters.');
        return err;
    } else if (username.length > 30) {
        var err = new Error('Username must be no greater than 30 characters.');
        return err;
    } else {
        // passed validation:
        return undefined;
    }
};

// Update Username:
UserSchema.methods.__updateUsername = function(username) {
    var self = this;

    self.username = username;
    self.save();
};

/*----------------------------------------*/
/*------- EMAIL VALIDATION METHODS -------*/
/*----------------------------------------*/
// Confirm email address:
UserSchema.methods.__emailMatch = function(email, emailConfirm) {
    if (email !== emailConfirm) {
        var err = new Error('Email and Confirmation Email fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Check if email is valid format:
UserSchema.methods.__validateEmailFormat = function(email) {
    if (!(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(email))) {
        var err = new Error('Email address must have valid formatting.');
        return err;
    } else {
        return undefined;
    }
};

// Check Email Length (For Updating User):
UserSchema.methods.__checkEmailLength = function(email) {
    if (email.length < 5) {
        var err = new Error('Email must be at least 5 characters.');
        return err;
    } else if (email.length > 50) {
        var err = new Error('Email must be no greater than 50 characters.');
        return err;
    } else {
        // passed validation:
        return undefined;
    }
};

// Update Email:
UserSchema.methods.__updateEmail = function(email) {
    var self = this;

    self.email = email;
    self.save();
};

/*---------------------------------------*/
/*----- PASSWORD VALIDATION METHODS -----*/
/*---------------------------------------*/
// Confirm password:
UserSchema.methods.__passwordMatch = function(password, passwordConfirm) {
    if (password !== passwordConfirm) {
        var err = new Error('Password fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Check if password is strong:
UserSchema.methods.__strongPassword = function(password, username) {
    var strongPassword = /^(?!.*(.)\1{2})(?=(.*[\d]){1,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){1,})(?!(?=.*(asdf|qwerty|123|\s)))(?:[\da-zA-Z@#$%!?^.,;:'"`~/\\|&*()\-_+=<>{}[\]]){12,20}$/;
    if (!strongPassword.test(password)) {
        console.log('Failed strong password detection.');
        var err = new Error('Password must be strong. Requirements: between 12-20 characters, includes 2 lowercase, 1 uppercase, 1 symbol, 1 number and may not include your username or basic sequences.');
        return err;
    } else {
        console.log('Passed strong password detection.');
        // Check if password contains username
        console.log('Checking if username is contained in password...');
        var usernameRegEx = new RegExp(username, "i"); // creates regex pattern with username case insensitive
        if (usernameRegEx.test(password)) { // checks password for any matching username
            console.log('Failed, Username is contained in password. Not strong.');
            var err = new Error('Password cannot contain username.');
            return err;
        } else {
            console.log('Passed, Username not found in password.');
            return undefined;
        }
    }
};

// Hash Password / Encrypt:
UserSchema.methods.__hashPassword = function(password) {
    var self = this;
    console.log('Hashing password...');
    bcrypt.hash(password, 12) // will return a promise
        .then(function(hash) {
            console.log('Password has been hashed:', hash);
            self.password = hash; // updates p/w entry to hash
            self.save();
            return undefined;
        })
        .catch(function(err) {
            console.log(err);
            var error = new Error('Password hashing failed.');
            console.log(err.message);
            return error;
        }); // catches any errors
};

// Compare Password to Hash / Decrypt (but only get true or false):
UserSchema.methods.__verifyPassword = function(enteredPassword) {
    console.log("Verifying password now...");
    console.log(this.password);
    console.log(enteredPassword);
    return bcrypt.compare(enteredPassword, this.password);
};

// Internal function merely for confirming password match:
UserSchema.methods.__checkPassword = function(userObj, password, validate, callback) {
    userObj.__verifyPassword(password)
        .then(function() {
            console.log("Password has been verified.");
            // Run callback sending user with it:
            validate.validatedUser = userObj;
            callback(validate);
        })
        .catch(function(err2) {
            console.log("Password is incorrect. Access denied.");
            validate.errors.passwordFail = {
                message: new Error('Login failed. Please check your login credentials and try again.').message
            };
            // Run callback:
            callback(validate);
        })
};

/**********************************/
/**********************************/
/****** CREATE MODEL & EXPORT *****/
/**********************************/
/**********************************/

// Instantiate Mongoose Model:
var User = mongoose.model('User', UserSchema);

// Export Model:
module.exports = User;
