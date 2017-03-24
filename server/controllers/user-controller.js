// Grab our Mongoose Model:
var User = require('mongoose').model('User');

module.exports = {
    // Login a user
    login: function(req, res) {
        console.log('/// LOGIN REQ BODY ///', req.body);
        User.create(req.body)
            .then(function(newUser) {
                return res.json(newUser);
            })
            .catch(function(err) {
                console.log('Error trying to create user!', err);
                if (err.errors == null) {
                    console.log('Custom Validator Function Error detected...');
                    return res.status(500).json(err.message);
                } else {
                    console.log('Built in Mongoose Validation detected....');
                    return res.status(500).json(err.errors)
                };
            })
    },
};
