var Hike = require('mongoose').model('Hike'); // grab our Mongoose models
var User = require('mongoose').model('User');

module.exports = {
    mostRecent: function(req, res) {
        /*
        Gets 3 most recent hikes.

        Parameters:
        - `req`: Request object.
        - `res`: Response object.
        */

        console.log('Fetching 3 most recent hikes...');

        Hike.find({})
            .then(function(allHikes) {
                console.log(allHikes);
                return res.json(allHikes);
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json(err);
            })


    },
};
