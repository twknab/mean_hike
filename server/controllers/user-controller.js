// Grab our Mongoose Model:
var User = require('mongoose').model('User');

module.exports = {
    // Register a user
    register: function(req, res) {
        console.log('/// REGISTER REQ BODY ///', req.body);
        // User.schema.methods.checkPassword(req.body.password, req.body.passwordConfirm, function(status, err){
        //     console.log(status, err.message);
        //     return res.status(500).json({
        //         custom: {
        //             message: err.message
        //         }
        //     })
        // });
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
    },
};
