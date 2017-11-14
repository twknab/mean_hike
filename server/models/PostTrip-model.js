/*
This is the model file for `PostTrip`.

<<---------------------------

1. DEPENDENCIES
2. SCHEMA
3. NEW POST-TRIP VALIDATION
    - `validatePostTrip()` - Validates a new PostTrip.
4. EDIT POST-TRIP VALIDATION
    - `validateUpdatePostTrip()` - Validaes a PostTrip update.
5. INSTANCE METHODS:
    Note: Currently all validation methods are contained within the methods above.
6. MODEL CREATION AND EXPORT

--------------------------->>
*/

/*********************************/
/*********************************/
/******** 1. DEPENDENCIES ********/
/*********************************/
/*********************************/

// Setup dependencies:
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/***************************/
/***************************/
/******** 2. SCHEMA ********/
/***************************/
/***************************/

// Setup a schema:
var PostTripSchema = new Schema({
  start_date: {
    type: Date,
    default: Date.now
  }, // end hike start date field
  end_date: {
    type: Date,
    default: Date.now
  }, // end hike end date field
  time: {
    type: String,
    minlength: [2, 'Actual time must be at least 2 characters.'],
    maxlength: [500, 'Actual time must not be greater than 500 characters.'],
    required: [true, 'Actual time is required.'],
    trim: true,
  }, // end time field
  weather: {
    type: String,
    minlength: [2, 'Weather report must be at least 2 characters.'],
    maxlength: [5000, 'Weather report must not be greater than 5000 characters.'],
    required: [true, 'Weather report is required.'],
    trim: true,
  }, // end weather field
  hazards: {
    type: String,
    minlength: [2, 'Hazards must be at least 2 characters.'],
    maxlength: [5000, 'Hazards must not be greater than 5000 characters.'],
    trim: true,
  }, // end hazards field
  floraFauna: {
    type: String,
    minlength: [2, 'Flora and fauna must be at least 2 characters.'],
    maxlength: [5000, 'Flora and fauna must not be greater than 5000 characters.'],
    trim: true,
  }, // end floraFauna field
  notes: {
    type: String,
    minlength: [2, 'Notes must be at least 2 characters.'],
    maxlength: [5000, 'Notes must not be greater than 5000 characters.'],
    trim: true,
  }, // end notes field
}, {
  timestamps: true,
});

/*********************************************/
/*********************************************/
/******** 3. NEW POST-TRIP VALIDATION ********/
/*********************************************/
/*********************************************/

PostTripSchema.methods.validatePostTrip = function(formData, callback) {
  /*
  Validates new PostTrip data prior to creation.

  Parameters:
  - `formData` - PostTrip data object to be validated.
  - `callback` - Callback function to run once validation completes.

  The following is validated within this method:
      - Hiking time and weather are required.
  */

  // Store `this` variable:
  var self = this;

  // Setup validates object to hold validation errors or validated PostTrip:
  var validated = {
    errors: {}, // will hold errors
    messages: {}, // will store messages
    validatedPostTrip: {}, // will hold created PostTrip if validation successful
  };

  console.log("Beginning New PostTrip Validation now...");

  // If empty form is submitted, send error denoting required fields:
  if (Object.keys(formData).length < 1) {
    validated.errors.requiredErr = {
      message: 'Date started, date ended, hiking time and weather are all required fields.',
    };
  }

  // If `hazards`, `floraFauna, `notes` (optional fields) are empty, delete them (this happens if the user started to fill out these fields then deleted them) -- these fields are not required and may be left empty:
  if (formData.hazards == '') {
    delete formData.hazards;
  };

  if (formData.floraFauna == '') {
    delete formData.floraFauna;
  };

  if (formData.notes == '') {
    delete formData.notes;
  };

  // Make sure start date is not after ending date (ie, that start and end date are chronological -- no Time Travelers allowed!):
  if (formData.start_date > formData.end_date) {
    validated.errors.hikingDates = {
      message: 'Hiking end date cannot be earlier than starting date.',
    };
  }

  // Iterate through the object and if any properties are less than or equal to 2 characters (excluding `hazards`, `floraFauna`, `notes` [optional fields]), generate error:
  for (var property in formData) {
    if (formData.hasOwnProperty(property)) {
      if ((formData[property].length < 2) && ((property != 'hazards') || (property != 'floraFauna') || (property != 'notes'))) {
        validated.errors.requiredErr = {
          message: 'Submitted fields must be at least 2 characters.',
        };
      }
    }
  };

  // Check if any errors thus far in validation, if so send back:
  // If there are any errors send back validated object containing them:
  if (Object.keys(validated.errors).length > 0) {
    console.log("Error creating new PostTrip:", validated.errors);
    callback(validated);
  }

  // Else, attempt to create the PostTrip:
  else {
    PostTrip.create(formData)
      .then(function(createdPostTrip) {
        /*
        If create successful, PostTrip object is returned.
        */

        console.log('PostTrip created successfully.');

        // Create success message:
        validated.messages.hikeCreated = {
          hdr: "Post-Trip Complete!",
          msg: "Your hike is now fully complete!",
        };

        // Add PostTrip to validated object:
        validated.validatedPostTrip = createdPostTrip;

        // Run callback with validated object:
        callback(validated);
      })
      .catch(function(err) {
        /*
        If error is returned, run callback passing it along.
        */

        console.log('Error creating PostTrip.');
        callback(err);
      })
  }

};

/************************************************/
/************************************************/
/******** 4. UPDATE POST-TRIP VALIDATION ********/
/************************************************/
/************************************************/

PostTripSchema.methods.validateUpdatePostTrip = function(formData, callback) {
  /*
  Validates updated PostTrip data prior to update.

  Parameters:
  - `formData` - PostTrip data object to be validated.
  - `callback` - Callback function to run once validation completes.

  The following is validated within this method:
  - Hiking time and weather are required.
  */

  // Store `this` variable:
  var self = this;

  // Setup validates object to hold validation errors or messages:
  var validated = {
    errors: {}, // will hold errors
    messages: {}, // will store messages
  };

  console.log("Beginning Update PostTrip Validation now...");

  // If empty form is submitted throw an error:
  if (Object.keys(formData).length < 1) {
    validated.errors.requiredErr = {
      message: 'Actual time and actual weather are both required fields.',
    };
  }

  // If `hazards`, `floraFauna, `notes` (optional fields) are empty, delete them (this happens if the user started to fill out these fields then deleted them):
  if (formData.hazards == '') {
    delete formData.hazards;
  };

  if (formData.floraFauna == '') {
    delete formData.floraFauna;
  };

  if (formData.notes == '') {
    delete formData.notes;
  };

  // Make sure start date is not after ending date (ie, that start and end date are chronological -- no Time Travelers allowed!):
  if (formData.start_date > formData.end_date) {
    validated.errors.hikingDates = {
      message: 'Hiking end date cannot be earlier than starting date.',
    };
  }

  // Iterate through the object and if any properties are less than 2 characters (excluding `hazards`, `floraFauna`, `notes` [optional fields]), generate error:
  for (var property in formData) {
    if (formData.hasOwnProperty(property)) {
      if ((formData[property].length < 2) && ((property != 'hazards') || (property != 'floraFauna') || (property != 'notes'))) {
        validated.errors.requiredErr = {
          message: 'Submitted fields must be at least 2 characters.',
        };
      }
    }
  };


  // Check if any errors thus far in validation, if so send back:
  // If there are any errors send back validated object containing them:
  if (Object.keys(validated.errors).length > 0) {
    console.log("Error updating PostTrip:", validated.errors);
    callback(validated);
  }

  // Else, attempt to create the PostTrip:
  else {

    // Delete createdAt and updatedAt fields prior to update:
    delete formData.createdAt;
    delete formData.updatedAt;

    PostTrip.findOneAndUpdate({
        _id: formData._id
      }, formData, {
        runValidators: true
      })
      .then(function(initialPostTrip) {
        /*
        If update is successful, inital postTrip (the one originally queried) is returned.
        */

        console.log('PostTrip updated successfully.');

        // Create success message:
        validated.messages.postTripUpdated = {
          hdr: "Updated!",
          msg: "Your Post-Trip was succesfully updated.",
        };

        // Run callback with validated object:
        callback(validated);
      })
      .catch(function(err) {
        /*
        If error is returned, run callback passing it along.
        */

        console.log('Error updating PostTrip.');
        callback(err);
      })
  }

};

/*************************************/
/*************************************/
/******** 5. INSTANCE METHODS ********/
/*************************************/
/*************************************/


/***************************************/
/***************************************/
/****** 6. MODEL CREATION & EXPORT *****/
/***************************************/
/***************************************/

// Instantiate Mongoose Model:
var PostTrip = mongoose.model('PostTrip', PostTripSchema);

// Export Model:
module.exports = PostTrip;
