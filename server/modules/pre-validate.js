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

        console.log('///// USER //////');
        console.log(user);

        /*

            Note: Normally I like to do my validations using a combination of
            built-in mongoose validators along with pre-save methods. In the
            case of this project, we are to confirm email and password fields.
            Because the email and password fields are not actual properties of
            our database model for a User, we don't have access to built-in
            validators.

            Now, I did try passing the entire user object into an
            instance method, and calling this instance method directly in my
            server controller, prior to user creation. However, it appears that
            accessing protype methods of a model is not the same as accessing
            these methods once an instance is generated. I believe that
            after an instance is generated, the model instance methods are added
            as prototypes to the actual instance.

            Because I could not find a way for my instance method to behave as
            desired, prior to instance creation, I chose to create a module instead
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
            likely they'll ever run as this validation below should catch
            most everything.

            Now a use will only receive two sets of errors if their username
            or email is a duplicate, else they'll get a nice list of any
            issues all at once to be corrected. A smoother UX.

        */

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
                Notes about a strong password:

                    - must be between 12 and 24 characters
                    - must contain at least 1 uppercase, 1 lowercase letters, 1 numbers, 1 characters: ! " ? $ ? % ^ & * ( ) _ - + = { [ } ] : ; @ ' ~ # | \ < , > . ? /

                    - cannot be all numbers
                    - cannot be all letters
                    - cannot be same as username
                    - cannot be single sequence of letters or numbers (#1)
                    - cannot be login name (#2)
                    - cannot be `qwerty` or `asdfghjkl` or `12345678` - #3 - which should qualify for #1

                How to approach:

                    - make 2 rounds of regex checks? (or maybe more)..
                        - #1) check for what it must have
                        - #2) check for what it cannot have
                        - #3) tally the results and make a decision

            */

            // Check if password is at least 12 characters:
            if (user.password.length <= 11) {
                err.errors.passwordLength = {
                    message: new Error('Password must be at least 12 characters long').message
                };
            }

            // Run callback with any errors after validation:
            // Note: Built-in mongoose validators followed by pre-save instance methods will run after this.
            console.log('/// ERRORS LIST ///');
            console.log(err.errors); // should be full list of all errors above in successive formatting: Username > Email > Password
            callback(err);

        } // end else for all fields

    }, // end registration validation method
}
