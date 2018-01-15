// Grab our Mongoose models
var Hike = require('mongoose').model('Hike'),
  User = require('mongoose').model('User'),
  PostTrip = require('mongoose').model('PostTrip');

module.exports = {
  addPostTrip: function(req, res) {
    /*
    Validates and creates a new PostTrip, or returns errors.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else begin new PostTrip process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      return res.status(401).send({
        redirect: "/"
      });
    } else {
      console.log('Starting new PostTrip validation...Data submitted:', req.body);

      PostTrip.schema.methods.validatePostTrip(req.body, function(validated) {
        /*
        Performs PostTrip validation instance methods; returns either errors object or validated object containing validated PostTrip.

        Parameters:
        - `req.body` - New PostTrip form data.
        - `function(validated)` - A callback function which runs after all validation methods have completed.

        Notes:
        The `validated` object in the callback function above returns an object containing an `errors` object if errors, or a `validated` object containing the validated PostTrip.
        */

        // Returned errors object:
        console.log(validated);

        // If there are any errors send them:
        if (Object.keys(validated.errors).length > 0) {
          console.log("Validation Failed.");
          console.log("Errors creating PostTrip:");
          for (var property in validated.errors) {
            if (validated.errors.hasOwnProperty(property)) {
              console.log(validated.errors[property].message);
            }
          }
          return res.status(500).json(validated.errors);
        }

        // Else if no errors, set new PostTrip to Hike's `postTrip` field:
        else {
          console.log('Validation Passed.');
          console.log('PostTrip created...Setting new PostTrip to Hike\'s `postTrip` field...');
          Hike.findOne({
              _id: req.body.hikeId
            })
            .then(function(foundHike) {
              /*
              Returns Hike object as `foundHike` if query successful.
              */

              // Set postTrip ID to Hike's `postTrip` array:
              foundHike.addPostTrip(validated.validatedPostTrip._id);

              console.log('Post-Trip successfully added.');

              // Send back validated object:
              console.log('Post-trip process completed successfully.')
              return res.json(validated);
            })
            .catch(function(err) {
              /*
              If error is returned when trying to query Hike, return it.
              */

              console.log('Errors finding Hike by ID...');
              return res.status(500).json(err);
            })
        };
      });
    };
  },
  getPostTrip: function(req, res) {
    /*
    Gets a post-trip based on hike Id to which it belongs.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else get PostTrip:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      return res.status(401).send({
        redirect: "/"
      });
    } else {
      console.log('Getting post-trip....');
      Hike.findOne({
          _id: req.body.id
        })
        .populate('postTrip')
        .exec()
        .then(function(hikeAndPostTrip) {
          return res.json(hikeAndPostTrip);
        })
        .catch(function(err) {
          console.log('Error attempting to query for hike and populate post-trip...', err);
          return res.status(500).json(err);
        })

    };
  },
  update: function(req, res) {
    /*
    Updates a post-trip based on Id to which it belongs.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else begin validation and update PostTrip process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      return res.status(401).send({
        redirect: "/"
      });
    } else {
      console.log('Starting post-trip update validation...data submitted:', req.body);

      PostTrip.schema.methods.validateUpdatePostTrip(req.body, function(validated) {
        /*
        Performs update Hike validation instance methods; returns object containing `errors` and `messages`.

        Parameters:
        - `req.body` - Updated Hike form object data from updateHike() function in Angular Hike factory.
        - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains `errors` object with any errors and `messages` object with any messages.
        */

        // If there are any errors send them:
        if (Object.keys(validated.errors).length > 0) {
          console.log("Validation Failed.");
          console.log("Errors updating Hike:");
          for (var property in validated.errors) {
            if (validated.errors.hasOwnProperty(property)) {
              console.log(validated.errors[property].message);
            }
          }
          return res.status(500).json(validated.errors);
        }

        // Else if no errors, return a success message:
        else {
          return res.json(validated);
        };
      });

    };
  },
  destroy: function(req, res) {
    /*
    Destroys a post trip based on Id.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    if (typeof(req.session.userId) == 'undefined') {
      return res.status(401).send({
        redirect: "/"
      });
    } else {
      Hike.findOne({
          _id: req.body.hikeId
        })
        .then(function(foundHike) {

          // Delete post-trip value from hike:
          foundHike.removePostTrip();

          // Delete post-trip object itself from database:
          PostTrip.findOneAndRemove({
              _id: req.body.postTripId
            })
            .then(function() {
              return res.json({
                message: "Success deleting Post-Trip."
              });
            })
            .catch(function(err) {
              console.log("Error querying for PostTrip for deletion:", err);
              return res.status(500).json(err);
            })
        })
    }
  },
};
