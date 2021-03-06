var User = require('mongoose').model('User'); // grab our Mongoose model

module.exports = {
  register: function(req, res) {
    /*
    Validates and registers a new User, or returns errors.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    console.log('Starting new user validation....');

    User.schema.methods.validateRegistration(req.body, function(validated) {
      /*
      Performs model validation instance methods; returns errors or the validated new user for session creation.

      Parameters:
      - `req.body` - Registration form object data from Registration function in User factory.
      - `callback(validated)` - A callback function which runs after validation, returning `validated` object data containing `errors` and `validated` objects).

      Notes:
      - The code below only runs after validations have completed. The `validated` object contains either an `errors` object with errors inside, or a `validated` object, with the validated user attached (see validateRegistration() inside of `User-model.js` for more).
      */

      // If there are any errors returned, send them back to Angular factory:
      if (Object.keys(validated.errors).length > 0) {
        return res.status(500).json(validated.errors);
      }

      // else, if there are no errors returned, check for validated user object:
      else {

        // Check for validatd user object:
        if (validated.validatedUser) {
          // Convert mongoose object to regular JS object:
          validated.validatedUser = validated.validatedUser.toObject();
          // Delete password property before sending back:
          delete validated.validatedUser.password;

          // Setup session for successfully validated user and send back:
          req.session.userId = validated.validatedUser._id;
          console.log("User registration process completed successfully.");
          return res.json(validated.validatedUser);
        }
        // Else, if validated object is not found, an unexpected error has occurred:
        else {
          // Add unexpected error and send it:
          validated.errors.unexpectedErr = {
            message: "An unexpected server error has occurred. Please contact site administrator with the error message: REGISTRATION VALIDATE ERROR."
          };
          // Send back errors:
          return res.status(500).json(validated.errors);
        }
      }
    });
  },
  login: function(req, res) {
    /*
    Validates and login an existing User, or returns errors.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    console.log('Starting existing user login process...');

    User.schema.methods.validateLogin(req.body, function(validated) {
      /*
      Performs login validation instance methods; returns either errors object or validated object containing validated user for login.

      Parameters:
      - `req.body` - Login form object data from login function in User factory.
      - `callback(validated)` - A callback function which runs after all validation methods have completed. `validated` object returns contains either `errors` object with errors, or `validated` object with successfully validated user.
      */

      // If there are any errors send them:
      if (Object.keys(validated.errors).length > 0) {
        console.log("Errors logging user in:", validated.errors);
        return res.status(500).json(validated.errors);
      }

      // If no errors, see if verified user was returned:
      else {
        // Check for validatd user object:
        if (validated.validatedUser) {
          // If validated property exists, user has been validated.

          // Convert mongoose object to regular JS object:
          validated.validatedUser = validated.validatedUser.toObject();
          // Delete password property before sending back:
          delete validated.validatedUser.password;

          // Setup session for validated user and send user back:
          req.session.userId = validated.validatedUser._id;
          console.log("User login process completed successfully.");
          return res.json(validated.validatedUser);
        }
        // Else, if validated object is not found, an unexpected error has occurred:
        else {
          // Add unexpected error and send it:
          validated.errors.unexpectedErr = {
            message: "An unexpected server error has occurred. Please contact site administrator with the error message: LOGIN VALIDATE ERROR."
          };
          return res.status(500).json(validated.errors);
        }
      }
    });
  },
  update: function(req, res) {
    /*
    Validates and updates an existing User's data, or returns errors.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else begin update process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      res.status(401).send({
        redirect: "/"
      });
    } else {
      console.log('Starting update user validation...Data submitted:', req.body);

      // Find user based upon session so we can compare existing document values to those submitted for validation (to validate for what has changed as not all fields are required):
      User.findOne({
          _id: req.session.userId // look up user based upon session data
        })
        .then(function(foundUser) {
          /*
          Returns our found User.

          Parameters:
          - `foundUser` - found User object with all user data.
          */

          foundUser.validateUpdate(req.body, function(validated) {
            /*
            Runs model User update validation method; returns `validated` object which contains either errors or messages (success messages).

            Parameters:
            - `req.body` - User update object data from update user function in user factory.
            - `callback(validated)` - Callback function which runs after validations in models file has completed. Returns `validated` object which contains only `errors` or success `messages`. The user is never returned in the update method.
            */

            // Returned errors object:
            console.log(validated);

            // If there are any errors send them:
            if (Object.keys(validated.errors).length > 0) {
              console.log("Errors updating user:", validated.errors);
              return res.status(500).json(validated.errors);
            }

            // Else if no errors, return validated (with messages if any):
            else {
              console.log("User updated process completed successfully.");
              return res.json(validated);
            };
          });
        })
        .catch(function(err) {
          /*
          Catch any errors when querying for findOne using session value.

          Parameters:
          - `err` - Errors object with error messages.
          */

          // Send any query errors back:
          console.log(err);
          return res.status(500).json(err)
        })
    }


  },
  auth: function(req, res) {
    /*
    Checks for a user's session to authorize angular's needs when displaying views and also to provide user data for certain navigation or page items.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.

    Notes:
    - This is not the only level of security. Each API route is also secured to verify a session in order to prevent spoofed data from being sent to the server or database.
    */

    // If session data is undefined, send back a False status (to be assessed in our Angular controller):
    if (typeof(req.session.userId) == 'undefined') {
      return res.status(401).json({
        status: false
      });
    }

    // Else, if session data is found, retreive the found user:
    else {
      // Find a user by session data:
      User.findOne({
          _id: req.session.userId // Find one user by session data
        })
        .then(function(foundUser) {
          /*
          Returns a found User.

          Parameters:
          - `foundUser` - User object.
          */

          // Convert mongoose object to regular JS object:
          foundUser = foundUser.toObject();
          // Delete password property before sending back:
          delete foundUser.password;

          // Send back found User and a True status (to be assessed in our Angular controller):
          var auth = {
            user: foundUser,
            status: true,
          };
          return res.json(auth);
        })
        .catch(function(err) {
          /*
          Catches any errors if our findOne query fails.
          */

          // Log and return errors:
          console.log(err);
          return res.status(500).json(err);
        })
    }
  },
  welcomeSetFalse: function(req, res) {
    /*
    Sets a user's welcome message status to false, preventing the user from ever see the welcome message again.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.

    Notes:
    - Once this is run, there is no present way for the User to reverse the status and see the message once again.
    */

    // If not a valid session, redirect home, else begin update process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      res.status(401).send({
        redirect: "/"
      });
    } else {
      // Finds user by session and updates property:
      User.findOneAndUpdate({
          _id: req.session.userId // Finds a user by session data
        }, {
          welcomeMsgStatus: false // Updates user property to False
        })
        .then(function(foundUser) {
          /*
          Returns found user.

          Paramters:
          - `foundUser` - User object.
          */

          // Send a confirmation text:
          return res.json('User welcome message updated.');
        })
        .catch(function(err) {
          /*
          Catches any error if findOne query fails:

          Parameters:
          - `err` - Errors object.
          */

          // Send errors:
          console.log(err);
          return res.status(500).json(err);
        })
    }


  },
  infoSetFalse: function(req, res) {
    /*
    Sets a user's info message status to false, preventing the user from seeing the info messages (unless reset by admins).

    Parameters:
    - `req`: Request object.
    - `res`: Response object.

    Notes:
    - Once this is run, Users will no longer see info messages, until reset by admin (when new updates are sent).
    */

    // If not a valid session, redirect home, else begin update process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      res.status(401).send({
        redirect: "/"
      });
    } else {
      console.log("SETTING INFO TO FALSE")
      // Finds user by session and updates property:
      User.findOneAndUpdate({
          _id: req.session.userId // Finds a user by session data
        }, {
          infoMsgStatus: false // Updates user property to False
        })
        .then(function(foundUser) {
          /*
          Returns found user.

          Paramters:
          - `foundUser` - User object.
          */

          // Send a confirmation text:
          return res.json('User info message updated.');
        })
        .catch(function(err) {
          /*
          Catches any error if findOne query fails:

          Parameters:
          - `err` - Errors object.
          */

          // Send errors:
          console.log(err);
          return res.status(500).json(err);
        })
    }


  },
  stats: function(req, res) {
    /*
    Gets stats for a user's completed hikes.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else begin update process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      res.status(401).send({
        redirect: "/"
      });
    } else {
      // Find user by session id:
      User.findOne({
          _id: req.session.userId
        })
        .populate({
          path: 'hikes',
          match: {
            postTrip: {
              $exists: true
            }
          },
        })
        .exec()
        .then(function(UserAndCompletePostTrips) {

          // Setup stats object to hold stats:
          var stats = {
            distance: 0, // will hold total distance
            gain: 0, // will hold total gain
          };

          /*
          Iterate through each UserAndCompletePostTrips.hikes
          Add up each `.distance` for totalDistance (mi)
          and `.gain` for totalGain (ft)
          */

          for (var i = 0; i < UserAndCompletePostTrips.hikes.length; i++) {
            console.log("$$$$$$$$$");
            console.log(typeof(UserAndCompletePostTrips.hikes[0].distance));
            console.log((UserAndCompletePostTrips.hikes[0].distance).toFixed(2));
            console.log("$$$$$$$$$");
            stats.distance = (parseFloat(stats.distance) + parseFloat(UserAndCompletePostTrips.hikes[i].distance)).toFixed(2);
            stats.gain = (parseFloat(stats.gain) + parseFloat(UserAndCompletePostTrips.hikes[i].gain)).toFixed(2);
          }

          return res.json(stats);
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json(err);
        })
    }


  },
  logout: function(req, res) {
    /*
    Logs out a User with a current session.

    Parameters:
    - `req`: Request object.
    - `res`: Response object.
    */

    // If not a valid session, redirect home, else begin update process:
    if (typeof(req.session.userId) == 'undefined') {
      console.log("This route is inaccessible without a valid session.");
      res.status(401).send({
        redirect: "/"
      });
    } else {
      // Destroy session and send confirmation:
      req.session.destroy();
      console.log('User logout process successful, session destroyed.');
      return res.json("User logged out.");
    }
  },
};
