// Setup dependencies:
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Setup a schema:
var UserSchema = new Schema (
    {
        username: {
            type: String,
            minlength: [2, 'Username must be at least 2 characters.'],
            maxlength: [30, 'Username must be less than 30 characters.'],
            required: [true, 'Username cannot be blank.'],
            trim: true,
            unique: true, // username must be unique
            dropDups: true,
        }, // end username field
        email: {
            type: String,
            minlength: [5, 'Email must be at least 5 characters.'],
            maxlength: [50, 'Email must be less than 50 characters.'],
            required: [true, 'Email cannot be blank.'],
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
            minlength: [12, 'Password must be at least 12 characters.'],
            required: [true, 'Password cannot be blank.'],
            trim: true,
        }, // end password field
        hikes: [{
            type: Schema.Types.ObjectId,
            ref: 'Hike'
        }], // end hikes array
    },
    {
        timestamps: true,
    }
);

/**********************/
/*  INSTANCE METHODS  */
/**********************/

// RegEx Validation (Alphanumerical and Underscores Only):
UserSchema.methods.validateUsername = function(username) {
    console.log('Validating for alphanumerics and underscores only...');
    var regex = /^[a-z0-9_]+$/i;
    return regex.test(username); // if pass, value will be true
};

// Case insensitive query validation instance method:
UserSchema.methods.checkDuplicates = function(username, next) {
    console.log('Checking for duplicates (insensitive)...');
    User.findOne({username: { $regex : new RegExp("^" + username + "$", "i")}}) // looks for any case which might match `username`
        .then(function(matchedUser) {
            if(matchedUser) { // if matched user is found, generate error:
                console.log('Failed. Existing user has been found in the DB:', matchedUser);
                var err = new Error('Username already exists.');
                next(err);
            }
            if(!matchedUser) { // if no match is found, then create user:
                console.log('Passed. Creating user now...');
                next();
            }
        })
        .catch(function(err) { // if our regex query goes awry this will catch any errors:
            console.log('Error performing case insensitive query to MongoDB...', err);
            next(err);
        })
};

UserSchema.methods.passwordMatch = function(password, passwordConfirm) {
    return password === passwordConfirm;
};

/*************************/
/*  PRE SAVE MIDDLEWARE  */
/*************************/

// Pre Save Hook:
UserSchema.pre('save', function(next) {
    var self = this,
        created = this.createdAt.getTime(),
        now = new Date().getTime();

    // Checks if New User or Not:
    console.log(now - created);
    if (now - created >= 1000) { // If user is older than 1 second, skip user creation custom validations:
        console.log('Existing User detected. Skipping custom user validations...');
        next();
    } else {
        console.log('New User detected. Running custom validations...');
        // Username RegEx Validation (Alphanumeric + Underscores Only):
        if (self.validateUsername(this.username)) { // if test result is true (passed), then query for existing users:
            console.log('Passed.');
            /* DO THIS HERE */
            // If email and email-confirm match:
                // If pwd and pwd-confirm match
                    // hash pwd (bcrypt)
                    // check duplicates (this should be the last method to run in your pre-save)
                        // If duplicates not found: (conditional inside scope of instance method)
                            // Create record
                        // Else: (conditional inside scope of instance method)
                            // Send Error
                // Else:
                    // Send Error
            // Else:
                // Send Error

            // Check for Duplicates (case insensitive):
            self.checkDuplicates(this.username, next);
        } else {
            console.log('Username Creation Validation ERROR...');
            var err = new Error('Username may contain only letters, numbers or underscores.');
            console.log(err);
            next(err);
        };
    }

});

/*************************/
/*  POST SAVE MIDDLEWARE  */
/*************************/
UserSchema.post('save', function(err, doc, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('Email address already exists.'));
    } else {
        next(err);
    }
});

/***************************/
/*  CREATE MODEL & EXPORT  */
/***************************/

// Instantiate Mongoose Model:
var User = mongoose.model('User', UserSchema);

// Export Model:
module.exports = User;
