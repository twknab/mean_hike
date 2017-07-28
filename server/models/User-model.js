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

    Note: Please see the individual instance functions for each specific validation.
    */

    // Save `this` as as self:
    var self = this;

    // Create errors object to hold any errors:
    var err = {
        errors: {},
    };


    /*

    Check if username has changed:
        - generate alphanumerical errors
        - generate min and max length errors

    Check if email has changed:
        - generate email formatting errors
        - check that matches email confirmation
        - generate min and max length errors

    Check if password has changed:
        - check for strong password
        - check that matches password confirmation
        - if passes, hash and update password

    If there are errors at this point, send them with your callback:

    Otherwise, continue:

        Check if username ONLY has changed:
            - query for user by username -- if duplicate, send error
            - if errors object is empty, update username
            - else, run callback and send back all errors

        Check if email ONLY has changed:
            - query for user by email -- if duplicate, send error
            - if errors object is empty, update email
            - else, run callback and send back all errors

        Check if email AND username has changed:
            - query for each and send errors if found
            - if errors object is empty, update username and email
            - else, run callback and send back all errors

    */

    // If username submitted differs from that in document record:
    if (formData.username != self.username) {

        // Check if new username contains alphanumerical and underscores only:
        console.log('Username change detected. Checking for alphanumeric and underscore only...');
        var alphaNum_validate = self.alphaNum_Username(formData.username);

        // If error is returned, add it to errors object:
        if (alphaNum_validate) {
            err.errors.username = {
                message: alphaNum_validate.message
            }

            // Run callback with error:
            return callback(err);
        }

        // Else, check for duplicates:
        else {
            
            // Check for duplicates:
            console.log('Passed alphanumeric and underscore evaluation.');
            console.log('Checking for duplicates...');
            self.checkUsernameDuplicates(formData.username, function(duplicateError){

                // This code only runs after querying for the user completes.

                // If username passes validation, the `duplicateError` will be undefined,
                // otherwise it will be an actual object.

                // Check for error:
                if (duplicateError) {
                    err.errors.usernameDuplicate = {
                        message: duplicateError.message,
                    }

                    console.log(err);

                    // Run callback with error:
                    return callback(err);
                }

                // Else, no error, update username, as all validations passed:
                else {
                    console.log("New username passed validation...Updating now...");
                    self.updateUsername(formData.username);
                    // Run callback with err object, note that `errors` will be empty:
                    return callback(err);
                }
            })
        }

    }

    // If email submitted differes from that in document record:

};


/*--------------------------*/
/*---- CHECK DUPLICATES ----*/
/*--------------------------*/
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

// Case insensitive query validation instance method:
UserSchema.methods.checkUsernameDuplicates = function(username, callback) {

    // Check if username is different than current username or if email is different than current email:
    console.log('Checking username for duplicates (case insensitive query)...');
    User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") }})
        .then(function(matchedUser) {
            // If matched user is found, run callback with error:
            if (matchedUser) {
                console.log('Failed. Existing user found with this username.');
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

/*-----------------------------------*/
/*---- ALL FIELDS & LOGIN LENGTH ----*/
/*-----------------------------------*/
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


/*--------------------*/
/*----- USERNAME -----*/
/*--------------------*/
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
    self.username = username;
    self.save();
};

/*-------------------------------------*/
/*------- EMAIL CONFIRM & FORMAT-------*/
/*-------------------------------------*/
// Confirm email address:
UserSchema.methods.emailMatch = function(email, emailConfirm) {
    if (email !== emailConfirm) {
        var err = new Error('Email fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Check if email is valid format:
UserSchema.methods.validateEmailFormat = function(email) {
    if (!(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$/.test(email))) {
        var err = new Error('Email must contain only letters, numbers and have valid formatting.');
        return err;
    } else {
        return undefined;
    }
}

/*--------------------*/
/*----- PASSWORD -----*/
/*--------------------*/
// Confirm password:
UserSchema.methods.passwordMatch = function(password, passwordConfirm) {
    if (password !== passwordConfirm) {
        var err = new Error('Password fields must match.');
        return err;
    } else {
        return undefined;
    }
};

// Update password:
UserSchema.methods.updatePassword = function(passwordHash) {
    self.password = passwordHash;
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
    bcrypt.hash(self.password, 12) // will return a promise
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

    console.log('PRE SAVE RUNNING')

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
