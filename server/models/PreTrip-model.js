/*
This is the model file for `PreTrip`.

<<---------------------------

1. DEPENDENCIES
2. SCHEMA
3. NEW PRE-TRIP VALIDATION
    - `validatePreTrip()` - Validates a new PreTrip.
4. EDIT PRE-TRIP VALIDATION
    - `validateUpdatePreTrip()` - Validaes a PreTrip update.
5. INSTANCE METHODS:
    Note: Please see doc strings in each function for more info:
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
var PreTripSchema = new Schema({
    itinerary: {
        type: String,
        minlength: [2, 'Itinerary must be at least 2 characters.'],
        maxlength: [5000, 'Itinerary must not be greater than 5000 characters.'],
        required: [true, 'Itinerary is required.'],
        trim: true,
    }, // end name field
    weather: {
        type: String,
        minlength: [2, 'Weather report must be at least 2 characters.'],
        maxlength: [5000, 'Weather report must not be greater than 5000 characters.'],
        required: [true, 'Weather report is required.'],
        trim: true,
    }, // end weather field
    sunset: {
        type: String,
        minlength: [2, 'Sunset report must be at least 2 characters.'],
        maxlength: [2000, 'Sunset report must not be greater than 2000 characters.'],
        required: [true, 'Sunset report is required.'],
        trim: true,
    }, // end sunset field
    hazards: {
        type: String,
        minlength: [2, 'Hazards must be at least 2 characters.'],
        maxlength: [5000, 'Hazards must not be greater than 5000 characters.'],
        required: [true, 'Potential Hazards is required.'],
        trim: true,
    }, // end hazards field
    notes: {
        type: String,
        minlength: [2, 'Notes must be at least 2 characters.'],
        maxlength: [5000, 'Notes must not be greater than 5000 characters.'],
        trim: true,
    }, // end notes field
    groupSize: {
        type: String,
        minlength: [2, 'Group size must be at least 2 characters.'],
        maxlength: [500, 'Group size must not be greater than 500 characters.'],
        required: [true, 'Group size is required.'],
        trim: true,
    }, // end groupSize field

}, {
    timestamps: true,
});

/********************************************/
/********************************************/
/******** 3. NEW PRE-TRIP VALIDATION ********/
/********************************************/
/********************************************/

PreTripSchema.methods.validatePreTrip = function(formData, callback) {
    /*
    Validates new PreTrip data prior to creation.

    Parameters:
    - `formData` - PreTrip data object to be validated.
    - `callback` - Callback function to run once validation completes.

    The following is validated within this method:
        - Itinerary, weather report, sunset, hazards, group size are required.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or validated PreTrip:
    var validated = {
        errors: {}, // will hold errors
        messages: {}, // will store messages
        validatedPreTrip: {}, // will hold created PreTrip if validation successful
    };

    // If empty form is submitted throw an error:
    // if (Object.keys(formData).length < 1) {
    //     validated.errors.requiredErr = {
    //         message: 'Itinerary, weather, sunset, hazards and group size are all required fields.',
    //     };
    // }

    // // Iterate through the object and if any properties are less than 2 characters (excluding `notes` [optional field] property), generate error:
    // for (var property in formData) {
    //     if (formData.hasOwnProperty(property)) {
    //         if ((formData[property].length < 2) && (property != 'notes')) {
    //             validated.errors.requiredErr = {
    //                 message: 'Itinerary, weather, sunset, hazards and group size are all required fields.',
    //             };
    //         }
    //     }
    // };

    // If `notes` property is empty, delete it (this happens if the user started to fill out notes then deleted them):
    if (formData.notes == '') {
        delete formData.notes;
    };

    // Check if any errors thus far in validation, if so send back:
    // If there are any errors send back validated object containing them:
    if (Object.keys(validated.errors).length > 0) {
        console.log("Error creating new PreTrip:", validated.errors);
        callback(validated);
    }

    // Else, attempt to create the PreTrip:
    else {
        PreTrip.create(formData)
            .then(function(createdPreTrip) {
                /*
                If create successful, PreTrip object (`createdPreTrip`) is returned.
                */

                console.log('PreTrip created successfully:', createdPreTrip);

                // Create success message:
                validated.messages.hikeCreated = {
                    hdr: "Pre-Trip Complete!",
                    msg: "Have a safe hike and be sure to complete a post-trip when you get back!",
                };

                // Add PreTrip to validated object:
                validated.validatedPreTrip = createdPreTrip;

                // Run callback with validated object:
                callback(validated);
            })
            .catch(function(err) {
                /*
                If error is returned, run callback passing it along.
                */

                console.log('Error creating PreTrip.');
                callback(err);
            })
    }

};

/***********************************************/
/***********************************************/
/******** 4. UPDATE PRE-TRIP VALIDATION ********/
/***********************************************/
/***********************************************/

PreTripSchema.methods.validateUpdatePreTrip = function(formData, callback) {
    /*
    Validates updated PreTrip data prior to Update.

    Parameters:
    - `formData` - PreTrip data object to be validated.
    - `callback` - Callback function to run once validation completes.

    The following is validated within this method:
    - Itinerary, weather report, sunset, hazards, group size are required.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or messages:
    var validated = {
        errors: {}, // will hold errors
        messages: {}, // will store messages
    };

    // If empty form is submitted throw an error:
    if (Object.keys(formData).length < 1) {
        validated.errors.requiredErr = {
            message: 'Itinerary, weather, sunset, hazards and group size are all required fields.',
        };
    }

    // Iterate through the object and if any properties are less than 2 characters (excluding `notes` [optional field] property), generate error:
    for (var property in formData) {
        if (formData.hasOwnProperty(property)) {
            if ((formData[property].length < 2) && (property != 'notes')) {
                validated.errors.requiredErr = {
                    message: 'Itinerary, weather, sunset, hazards and group size are all required fields.',
                };
            }
        }
    };

    // If `notes` property is empty, delete it (this happens if the user started to fill out notes then deleted them):
    if (formData.notes == '') {
        delete formData.notes;
    };

    // Check if any errors thus far in validation, if so send back:
    // If there are any errors send back validated object containing them:
    if (Object.keys(validated.errors).length > 0) {
        console.log("Error creating new PreTrip:", validated.errors);
        callback(validated);
    }

    // Else, attempt to create the PreTrip:
    else {

        // Delete createdAt and updatedAt fields as we won't need these when updating:
        delete formData.createdAt;
        delete formData.updatedAt;

        PreTrip.findOneAndUpdate({_id: formData._id}, formData, { runValidators: true })
            .then(function(initialPreTrip) {
                /*
                If update is successful, inital preTrip (the one originally queried) is returned.
                */

                console.log('PreTrip updated successfully.', initialPreTrip);

                // Create success message:
                validated.messages.preTripUpdated = {
                    hdr: "Updated!",
                    msg: "Your Pre-Trip was succesfully updated.",
                };

                // Run callback with validated object:
                callback(validated);
            })
            .catch(function(err) {
                /*
                If error is returned, run callback passing it along.
                */
                console.log('Error updating PreTrip.');
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
var PreTrip = mongoose.model('PreTrip', PreTripSchema);

// Export Model:
module.exports = PreTrip;
