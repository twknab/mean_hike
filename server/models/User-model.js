// Setup dependencies:
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-as-promised'),
    Schema = mongoose.Schema;

// Setup a schema:
var UserSchema = new Schema({
    username: {
        type: String,
        minlength: [2, 'Username must be at least 2 characters.'],
        maxlength: [30, 'Username must not be greater than 30 characters.'],
        required: true,
        trim: true,
        unique: true, // username must be unique
        dropDups: true,
    }, // end username field
    email: {
        type: String,
        minlength: [5, 'Email must be at least 5 characters.'],
        maxlength: [50, 'Email must not be greater than 50 characters.'],
        required: true,
        trim: true,
        unique: true, // email must be unique
        dropDups: true,
        validate: {
            validator: function(email) {
                var regex = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/;
                return regex.test(email);
            },
            message: 'Email must contain only letters, numbers and have valid formatting.'
        }
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

/**********************************/
/**********************************/
/******** INSTANCE METHODS ********/
/**********************************/
/**********************************/



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

    PHASE ONE VALIDATIONS:
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

    PHASE TWO VALIDATIONS:
    Check if there are errors at this point:
        - Run callback with errros

    Else, if no errors, perform username and email duplication validations:

        - Run duplicate checks on Username and Email (this must be done step-wise due to asynchronicity)
        - If errors, add them to the errors object (which is otherwise empty, if having made it to Phase Two)
        - If no errors, and email or username does not match that on record, update it.
        - After both queries are complete, run the callback, passing in the errors object.
    */

    // Save `this` as as self:
    var self = this;

    // Create errors object to hold any errors:
    var err = {
        errors: {},
        messages: {},
    };

    console.log('()()()()()()()()()()()()');
    console.log(formData.password, formData.passwordConfirm)
    console.log('()()()()()()()()()()()()');

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
        var alphaNum_validate = self.alphaNum_Username(formData.username);

        // Run min and max length validation:
        console.log('Checking for min and max length of new username...');
        var minMaxValidate = self.checkUsernameLength(formData.username);

        // If alhpanum_ error is returned, add it to errors object:
        if (alphaNum_validate) {
            err.errors.usernameAlphaNum_ = {
                message: alphaNum_validate.message
            }
        }

        // If min/max error is returned, add it to errors object:
        if (minMaxValidate) {
            err.errors.usernameMinMax = {
                message: minMaxValidate.message
            }
        }
    }

    // If email submitted differs from that in document record (or if confirmation email field has changed):
    if (formData.email != self.email || (formData.emailConfirm != undefined && formData.emailConfirm != "")) {

        // Run email format validation:
        console.log('Email change detected. Checking valid email format...');
        var emailFormatValidate = self.validateEmailFormat(formData.email);

        // Run email and email confirm validation:
        console.log('Checking if email address matches email confirmation...');
        var emailConfirmValidate = self.emailMatch(formData.email, formData.emailConfirm);

        // Run min and max length validation:
        console.log('Checking for min and max length of new email...');
        var minMaxValidate = self.checkEmailLength(formData.email);

        // If errors are returned from either validation, add it to errors object:
        if (emailFormatValidate) {
            err.errors.emailFormat = {
                message: emailFormatValidate.message
            }
        }
        if (emailConfirmValidate) {
            err.errors.emailConfirm = {
                message: emailConfirmValidate.message
            }
        }
        if (minMaxValidate) {
            err.errors.emailMinMax = {
                message: minMaxValidate.message
            }
        }
    }

    // If the password or the password confirmation are not filled out:
    if ((formData.password && formData.passwordConfirm == undefined) || (formData.password == undefined && formData.passwordConfirm)) {
        err.errors.passwordMatch = {
            message: 'Password and Password Confirmation fields are both required to update your password.'
        };
    }

    // If both a password and password confirmation are submitted:
    if (formData.password && formData.passwordConfirm) {
        // Run password and password confirm validation:
        console.log('Password and password confirmation change detected. Checking if password matches password confirmation...');
        var passwordConfirmValidate = self.passwordMatch(formData.password, formData.passwordConfirm)

        // Run strong password validation:
        console.log('Checking if password submitted is strong...');
        var passwordStrong = self.strongPassword(formData.password, formData.username);

        // If errors are returned from either validation, add it to errors object:
        if (passwordConfirmValidate) {
            err.errors.passwordConfirm = {
                message: passwordConfirmValidate.message
            }
        }
        else if (passwordStrong) {
            err.errors.strongPassword = {
                message: passwordStrong.message
            }
        }
        // If neither error is returned, hash password and update it:
        else {
            // Hash password
            console.log("Password passed confirmation and strength validations. Hashing now...");

            // WHY IS PASSWORD NOT HASING CORRECTLY?
            self.hashPassword(formData.password);
            err.messages.passwordUpdated = {
                hdr: "Password Updated!",
                msg: "Your password was succesfully updated.",
            };
            console.log("Completed password hashing:", self.password);
        }
    }


    // If there are any errors at this point, return your callback with
    // errors -- do not check for duplicates until phase 1 passes without error:
    if (Object.keys(err.errors).length > 0) {
        console.log("Failed Phase One validations, returning errors now...");
        callback(err);
    }

    /*---------------------------------------*/
    /*--------- PHASE TWO VALIDATIONS -------*/
    /*---------------------------------------*/
    // Else, if no errors are returned from PHASE ONE validations, proceed with PHASE TWO:
    else {
        console.log("Passed Phase One validations. Starting Phase Two validations...");

        // Run duplicate check for Username first (and then Email):
        self.checkUsernameDuplicates(formData.username, function(usernameDuplicateError) {
            // If error AND username submitted does not match username on document record, log it:
            if (usernameDuplicateError && formData.username != self.username) {
                err.errors.usernameDuplicate = {
                    message: usernameDuplicateError.message,
                }
            }

            // Run duplicate check for Email now:
            self.checkEmailDuplicates(formData.email, function(emailDuplicateError) {
                // If error AND email submitted does not match one on record, log it:
                if (emailDuplicateError && formData.email != self.email) {
                    err.errors.emailDuplicate = {
                        message: emailDuplicateError.message,
                    }
                }

                // Check for errors, if found, run callback with errors:
                if (Object.keys(err.errors).length > 0) {
                    console.log("Failed Phase Two validations, duplicates detected, returning errors now...");
                    callback(err);
                }

                // Else, if no errors, update username and run callback passing in empty errors object:
                else {
                    console.log("Passed Phase Two validations.");

                    // If nothing has changed, generate a message and run callback right away:
                    if (formData.username == self.username && formData.email == self.email && (formData.password == undefined || !formData.password) ) {
                        console.log('No changes in username, email or password have been detected.');

                        // Send message that no changes were made to the account:
                        err.messages.noChange = {
                            hdr: "Nothing Changed!",
                            msg: "You haven't made any changes to your account. Try again or ",
                        };
                    }

                    // If email does not match one on record, update it:
                    if (formData.email != self.email) {
                        console.log('Updating email now...');
                        // Update email:
                        self.updateEmail(formData.email);
                        err.messages.emailUpdated = {
                            hdr: "Email Updated!",
                            msg: "Your email address was successfully updated.",
                        };
                        console.log("Email update now complete.");
                    }

                    // If, username does not match one on record, update it:
                    if (formData.username != self.username) {
                        console.log('Updating username now...');
                        // Update username:
                        self.updateUsername(formData.username);
                        // Send success message:
                        err.messages.usernameUpdated = {
                            hdr: "Username Updated!",
                            msg: "Your username was successfully updated.",
                        };
                        console.log("Username update complete.");
                    }

                    // Run callback, sending empty error object:
                    callback(err);
                }
            })
        })
    }

};


/*--------------------------------------*/
/*---- DUPLICATE VALIDATION METHODS ----*/
/*--------------------------------------*/
/*
    The checkDuplicates() function accepts a callback function, which will run
    only if no duplicate username or email addresses are found. This validation occurs
    step-wise, first checking for a username, then for an email (using case insensiitive
    regex queries). An appropriate error is generated, depending upon the results:
*/
// Case insensitive query validation instance method:
UserSchema.methods.checkDuplicates = function(username, email, next, callback) {
    var self = this;

    /*
        ADD SOMETHING HERE THAT WILL CHECK IF THE USENRAME OR EMAIL IS DIFF THAN THE DOCUMENT RECORD.
        IF IT IS, CONTINUE WITH VALIDATIONS. IF NOT, IGNORE VALIDATIONS
        THIS WAY .SAVE() WHEN RUN, WILL AUTO CHECK FOR DUPES, AND IF NOTHING HAS CHANGED, WILL CONTINUE ON.
    */

    console.log('Checking username and email for duplicates (insensitive)...');
    // Check if username is different than current username or if email is different than current email:
    User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") }})
    .then(function(matchedUser) {
        User.findOne({
            email: {
                $regex: new RegExp("^" + email + "$", "i")
            }
        }) // looks for any case which might match `username`
        .then(function(matchedEmail) {
            // if both email and user is found:
            if (matchedEmail && matchedUser) {
                console.log('Failed. Existing users found with this email address and username.');
                var err = new Error('Username and Email address is already in use.')
                next(err);
            }
            // if user is found:
            if (matchedUser) {
                console.log('Failed. Existing user found with this username.');
                var err = new Error('Username already in use by another user.')
                next(err);
            }
            // if email address is found:
            if (matchedEmail) {
                console.log('Failed. Existing user found with this email address.');
                var err = new Error('Email address already in use by another user.')
                next(err);
            }
            // If matched user and matched email are empty, run callback and pass in password for hashing:
            if (!matchedUser && !matchedEmail) { // If no existing user by email, hash password
                console.log('Passed duplicates check... Running callback now...');
                // Run callback:
                callback();
            }
        })
        .catch(function(err) {
            console.log('Error querying mongoDB for duplicate email...', err);
            next(err);
        })
    })
    .catch(function(err) { // if our regex query goes awry this will catch any errors:
        console.log('Error querying mongoDB for duplicate username...', err);
        next(err);
    })
};

// Check if any username duplicates (case insensitive query) exist:
UserSchema.methods.checkUsernameDuplicates = function(username, callback) {

    console.log('Checking username for duplicates (case insensitive query)...');
    User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") }})
        .then(function(matchedUser) {
            // If matched user is found, run callback with error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this username.');
                var err =  new Error('Username already in use by another user.');
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
UserSchema.methods.checkEmailDuplicates = function(email, callback) {

    console.log('Checking email for duplicates (case insensitive query)...');
    User.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") }})
        .then(function(matchedUser) {
            // If matched user is found by email address, run callback with error:
            if (matchedUser) {
                console.log('Duplicate found. Existing user found with this email address.');
                var err =  new Error('Email address already in use by another user.');
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

/*--------------------------------------------------------------*/
/*---- ALL FIELDS VALIDATION METHODS - LOGIN / REGISTRATION ----*/
/*--------------------------------------------------------------*/
// Check if all registration fields are filled out (parameter is a dictionary of key value pairs from the form):
UserSchema.methods.checkAllRegFields = function(regFormData) {
    if (Object.keys(regFormData).length < 5) {
        // Format Error Object for Angular:
        var err = new Error('All fields are required.');
        return err;
    } else {
        return undefined;
    }
};


// Check if all fields are filled out (parameter is a dictionary of key value pairs from the form):
UserSchema.methods.checkAllLoginFields = function(loginFormData) {
    if (Object.keys(loginFormData).length < 2) {
        // Format Error Object for Angular:
        var err = new Error('All fields are required.');
        return err;
    } else {
        /*
            Note: The else statement here is necessary in case the user had previously entered data,
            the individual login keys are evaluated to ensure they contain data. For example,
            if a user previously entered invalid credentials, then cleared the fields, angular
            preserves its data {login_id: , password: } -- so although no new data has been submitted,
            the key values exist. We could, in our Angular Controller, change our error Callback so that
            the user field is rest (which would then remove the necessity of this code below), but
            then the user would lose whatever data they had submitted on screen and be unable to simply
            correct it.
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
UserSchema.methods.checkLoginLength = function(loginFormData) {
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
        self.checkAllLoginFields(loginFormData);
    }
};


/*---------------------------------------*/
/*----- USERNAME VALIDATION METHODS -----*/
/*---------------------------------------*/
// Check if username contains only alphanumerical and underscores:
UserSchema.methods.alphaNum_Username = function(username) {
    if (!(/^[a-z0-9_]+$/i.test(username))) {
        var err = new Error('Username may contain only letters, numbers or underscores.');
        return err;
    } else {
        return undefined;
    }
};

// Update Username:
UserSchema.methods.updateUsername = function(username) {
    var self = this;

    self.username = username;
    self.save();
};

// Check Username Length (For Updating User):
UserSchema.methods.checkUsernameLength = function(username) {
    if (username.length < 2) {
        var err = new Error('Username must be at least 2 characters.');
        return err;
    }

    else if (username.length > 30) {
        var err = new Error('Username must be no greater than 30 characters.');
        return err;
    }

    else {
        // passed validation:
        return undefined;
    }
};

/*----------------------------------------*/
/*------- EMAIL VALIDATION METHODS -------*/
/*----------------------------------------*/
// Confirm email address:
UserSchema.methods.emailMatch = function(email, emailConfirm) {
    if (email !== emailConfirm) {
        var err = new Error('Email and Confirmation Email fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Check if email is valid format:
UserSchema.methods.validateEmailFormat = function(email) {
    if (!(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(email))) {
        var err = new Error('Email address must have valid formatting.');
        return err;
    } else {
        return undefined;
    }
};

// Check Email Length (For Updating User):
UserSchema.methods.checkEmailLength = function(email) {
    if (email.length < 5) {
        var err = new Error('Email must be at least 5 characters.');
        return err;
    }

    else if (email.length > 50) {
        var err = new Error('Email must be no greater than 50 characters.');
        return err;
    }

    else {
        // passed validation:
        return undefined;
    }
};

// Update Email:
UserSchema.methods.updateEmail = function(email) {
    var self = this;

    self.email = email;
    self.save();
};

/*---------------------------------------*/
/*----- PASSWORD VALIDATION METHODS -----*/
/*---------------------------------------*/
// Confirm password:
UserSchema.methods.passwordMatch = function(password, passwordConfirm) {
    if (password !== passwordConfirm) {
        var err = new Error('Password fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Check if password is strong:
UserSchema.methods.strongPassword = function(password, username) {
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
UserSchema.methods.hashPassword = function(password) {
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
UserSchema.methods.verifyPassword = function(enteredPassword) {
    console.log("Verifying password now...");
    console.log(this.password);
    console.log(enteredPassword);
    return bcrypt.compare(enteredPassword, this.password);
};

/**********************************/
/**********************************/
/******* PRE-SAVE MIDDLEWARE ******/
/**********************************/
/**********************************/

// Pre Save Hook:
UserSchema.pre('save', function(next) {
    var self = this,
        created = this.createdAt.getTime(),
        now = new Date().getTime();

    // Checks if New User or Not:
    console.log(now - created);
    if (now - created >= 1) { // If not new user (user is older than .0001 second), skip user creation custom validations:
        console.log('Existing User detected. Skipping custom user validations...');
        next();
    } else { // If user is new:
        // Check if username contains only alphanum + underscores, then check for duplicates:
        self.checkDuplicates(self.username, self.email, next, function() {
            next();
        }); // check for username or email duplicates
    }

});

/**********************************/
/**********************************/
/****** POST-SAVE MIDDLEWARE ******/
/**********************************/
/**********************************/

UserSchema.post('save', function(err, doc, next) {
    if (err) {
        console.log('******************');
        console.log(err);
        console.log('******************');
    }

    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('Email address already exists.'));
    } else {
        next(err);
    }
});

/**********************************/
/**********************************/
/****** CREATE MODEL & EXPORT *****/
/**********************************/
/**********************************/

// Instantiate Mongoose Model:
var User = mongoose.model('User', UserSchema);

// Export Model:
module.exports = User;
