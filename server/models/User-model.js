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

    console.log('Checking username and email for duplicates (insensitive)...');
    User.findOne({
            username: {
                $regex: new RegExp("^" + username + "$", "i")
            }
        })
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
                        callback(); // Hashes password and passes `next()` which runs in the hash password function (which then proceeds to creating the User instance)
                    } else {
                        var err = new Error('Server issue has occurred. Please contact server admininstrator with this message: `DUPLICATE QUERY ERROR`.');
                        next(err);
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

/*--------------------*/
/*---- ALL FIELDS ----*/
/*--------------------*/
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

/*--------------------*/
/*---- MIN LENGTH ----*/
/*--------------------*/
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


/*--------------------------*/
/*----- USERNAME REGEX -----*/
/*--------------------------*/
// Check if username contains only alphanumerical and underscores:
UserSchema.methods.alphaNum_Username = function(username) {
    if (!(/^[a-z0-9_]+$/i.test(username))) {
        var err = new Error('Username may contain only letters, numbers or underscores.')
        return err;
    } else {
        return undefined;
    }
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

/*-------------------------------------*/
/*----- PASSWORD CONFIRM & STRONG -----*/
/*-------------------------------------*/
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

/*----------------------------*/
/*----- PASSWORD HASHING -----*/
/*----------------------------*/
// Hash Password / Encrypt:
UserSchema.methods.hashPassword = function(password, next) {
    var self = this;
    console.log('Hashing password...');
    bcrypt.hash(self.password, 12) // will return a promise
        .then(function(hash) {
            console.log('Password has been hashed:', hash);
            self.password = hash; // updates p/w entry to hash
            next();
        })
        .catch(next); // catches any errors
};


/*---------------------------*/
/*----- PASSWORD VERIFY -----*/
/*---------------------------*/
// Compare Password to Hash / Decrypt (but only get true or false):
UserSchema.methods.verifyPassword = function(enteredPassword) {
    console.log("Verifying password now...");
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
    if (now - created >= 1000) { // If not new user (user is older than 1 second), skip user creation custom validations:
        console.log('Existing User detected. Skipping custom user validations...');
        next();
    } else { // If user is new:
        // Check if username contains only alphanum + underscores, then check for duplicates:
        self.checkDuplicates(self.username, self.email, next, function() {
            console.log('HASHING!!!!');
            self.hashPassword(self.password, next);
        }); // check for username or email duplicates
    }

});

/**********************************/
/**********************************/
/****** POST-SAVE MIDDLEWARE ******/
/**********************************/
/**********************************/

UserSchema.post('save', function(err, doc, next) {
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
