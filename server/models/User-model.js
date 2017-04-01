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
            required: true,
            trim: true,
            unique: true, // username must be unique
            dropDups: true,
        }, // end username field
        email: {
            type: String,
            minlength: [5, 'Email must be at least 5 characters.'],
            maxlength: [50, 'Email must be less than 50 characters.'],
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
    },
    {
        timestamps: true,
    }
);

/**********************/
/*  INSTANCE METHODS  */
/**********************/

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
        // Check for Duplicate Users:
        self.checkDuplicates(this.username, next);
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
