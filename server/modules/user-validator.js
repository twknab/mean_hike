/*
    Note: This validator module taps into existing instance functions within our
    user model. Any errors returned from our instance functions, are gathered,
    and then evaluated. If all fields are empty, this will be the first error
    that is sent back. If all fields clear, then further validations will continue.

    There are two instance methods (checkDuplicates() and hashPassword()) that
    only run as part of pre-save methods. These validations run when a User is
    attempted to be instantiated, and returns a seperate list of errors. Because
    of these two different errors list (custom validators and pre-save hook),
    we have to format the returned errors so they display on the view appropriately.
*/

// Grab any dependencies:
var mongoose = require('mongoose'),
    User = require('mongoose').model('User');

module.exports = {
    // Validates user registration generating one list of error objects to hand back:
    registration : function(userData, callback) {
        /*
        Validates a registration data object and runs a callback, passing along the errors.

        Parameters:
        - `userData` - An object containing 5 registration key:value pairs.
        - `callback` - A callback function which runs after all validators have run.
        */

        /*----------------------------*/
        /*- REGISTRATION VALIDATIONS -*/
        /*----------------------------*/
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

        // Run all validations, accepting a dictionary object full of registration data:
        var self = this;

        // Setup errors object to hold all validation errors values:
        var err = {
            errors: {},
        };

        // Run all validations and gather messages as a dictionary:
        var validations = {
            allRegFields: User.schema.methods.checkAllRegFields(userData),
            username: User.schema.methods.alphaNum_Username(userData.username),
            emailMatch: User.schema.methods.emailMatch(userData.email, userData.emailConfirm),
            emailFormat: User.schema.methods.validateEmailFormat(userData.email),
            pwdMatch: User.schema.methods.passwordMatch(userData.password, userData.passwordConfirm),
            pwdStrong: User.schema.methods.strongPassword(userData.password, userData.username),
        };

        // Check all fields (if not, send errors right away):
        if (validations.allRegFields) {
            err.errors.allRegFields = {
                message: validations.allRegFields.message
            }
            callback(err);
        }

        // Else, all fields are filled out -- begin all other validations:
        else {


            // Check if username is alphanumerical with underscores only:
            if (validations.username) {
                err.errors.username = {
                    message: validations.username.message
                }
            }

            // Check if email and email confirm match:
            if (validations.emailMatch) {
                err.errors.email = {
                    message: validations.emailMatch.message
                }
            }

            // Check if email in proper email format:
            if (validations.emailFormat) {
                err.errors.emailFormat = {
                    message: validations.emailFormat.message
                }
            }

            // Check if password and password confirm match:
            if (validations.pwdMatch) {
                err.errors.password = {
                    message: validations.pwdMatch.message
                }
            }

            // Check if password is strong:
            if (validations.pwdStrong) {
                err.errors.passwordStrength = {
                    message: validations.pwdStrong.message
                }
            }

            // Send back errors list:
            callback(err);
        };

    }, // end registration validation method
    login : function(userData, callback) {
        /*---------------------*/
        /*- LOGIN VALIDATIONS -*/
        /*---------------------*/
        /*
            Validates full login data using instance methods below.

            The following is validated:
            - all fields must be filled out.
            - login id must be greater than 2 characters, less than 30 characters.
            - password must be greater than 12 characters, less than 50 characters.
            - login id is looked up by username, then email and errors sent if any (user may login with username OR email).
            - if user is found, password is verified with retreived user.

            Note: Please see the individual instance functions for each specific validation.

        */

        // Create Error Object which will hold all Errors:
        var err = {
            errors: {}
        };

        // Run all validations and gather messages as a dictionary:
        var validations = {
            allLoginFields: User.schema.methods.checkAllLoginFields(userData),
            loginLength: User.schema.methods.checkLoginLength(userData),
        };

        // Check all fields (if not, send errors right away):
        if (validations.allLoginFields) {
            console.log('Error: No data has been submitted.')
            err.errors.allLoginFields = {
                message: validations.allLoginFields.message
            }
            callback(err);
        }

        // Else, all fields are filled out -- begin all other validations:
        else {

            console.log("Data submitted...Checking min/max length...")

            // Check if login ID and password is proper length:
            if (validations.loginLength) {
                err.errors.loginLength = {
                    message: validations.loginLength.message
                }
                callback(err);
            }

            // If fields are filled out and appropriate length, send back emtpy errors list:
            else {
                // errors list should be empty:
                callback(err);
            }
        };

    }, // end login validation method
    update : function(userData, callback) {


    }, // end update validation method
}
