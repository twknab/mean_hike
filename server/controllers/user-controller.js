// Grab our Mongoose Model:
var User = require('mongoose').model('User'),
    preValidate = require('./../modules/pre-validate');

module.exports = {
    // Register a user
    register: function(req, res) {
        console.log('/// REGISTER REQ BODY ///', req.body);
        preValidate.registration(req.body, function(err) {

            // If there are any errors send them:
            if (Object.keys(err.errors).length > 0) {
                return res.status(500).json(err.errors);
            }

            // If no errors, create user and run built-in and pre-save validations:
            else {
                console.log('There were no errors:');
                User.create(req.body)
                .then(function(newUser) {
                    return res.json(newUser);
                })
                .catch(function(err) {
                    console.log('Error trying to create user!', err);
                    if (err.errors == null) {
                        console.log('Custom Validator Function Error detected...');
                        return res.status(500).json({
                            custom: {
                                message: err.message
                            }
                        });
                    } else {
                        console.log('Built in Mongoose Validation detected....');
                        return res.status(500).json(err.errors)
                    };
                })
            }

        });
    },
};
