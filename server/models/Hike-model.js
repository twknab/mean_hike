/*
This is the model file for `Hike`.

<<---------------------------

1. DEPENDENCIES
2. SCHEMA
3. NEW HIKE VALIDATION
4. EDIT HIKE VALIDATION
5. PRIVATE INSTANCE METHODS:

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
var HikeSchema = new Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be at least 2 characters.'],
        maxlength: [150, 'Name must not be greater than 150 characters.'],
        required: [true, 'Name is required.'],
        trim: true,
    }, // end name field
    region: {
        type: String,
        minlength: [2, 'Region must be at least 2 characters.'],
        maxlength: [50, 'Region must not be greater than 50 characters.'],
        required: [true, 'Region is required.'],
        trim: true,
    }, // end region field
    distance: {
        type: Number,
        required: [true, 'Round trip distance is required.'],
    }, // end distance field
    gain: {
        type: Number,
        required: [true, 'Elevation gain is required.'],
    }, // end gain field
    location: {
        type: String,
        minlength: [2, 'Location URL must be at least 2 characters.'],
        maxlength: [350, 'Location URL must not be greater than 150 characters.'],
        trim: true,
    }, // end location field
    notes: {
        type: String,
        minlength: [2, 'Notes must be at least 2 characters.'],
        maxlength: [5000, 'Notes must not be greater than 5000 characters.'],
        trim: true,
    }, // end notes field
    // preTrip: { // holds hikes belonging to User
    //     type: Schema.Types.ObjectId,
    //     ref: 'preTrip'
    // }, // end pre-trip field
    // postTrip: { // holds hikes belonging to User
    //     type: Schema.Types.ObjectId,
    //     ref: 'postTrip'
    // }, // end post-trip field
}, {
    timestamps: true,
});

/****************************************/
/****************************************/
/******** 3. NEW HIKE VALIDATION ********/
/****************************************/
/****************************************/

HikeSchema.methods.validateHike = function(formData, callback) {
    /*
    Validates new Hike data utilizing private instance validation methods.

    Parameters:
    - `formData` - Hike data object to be validated (for new Hike creation).
    - `callback` - Callback function to run once validation completes.

    The following is validated within this method:
        - name is required (using built in validators for all req'd)
        - region is required.
        - distance is a number and required.
        - gain is a number and required.
        - if location or notes field is an empty string, erase property prior to submission (note: this is because the user filled out the field, then erased it -- we only want to validate for fields containing content).
        - please see the schema creation above to see min/max char's for various fields.

    Note: Please see the individual private instance functions for each specific validation.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or validated Hike:
    var validated = {
        errors: {}, // will hold errors
        messages: {}, // will store messages
    };

    console.log("Beginning New Hike Validation now...");

    // Although we've ensured the `type="number"` on our `gain` and `distance` inputs, and we're doing a __checkNum validation below, let's just parseFloat our gain and distance values juat to be safe (and most likely our __checkNum should never be flagged---Development Note: Consider deleting said validation...as it now may be moot):
    formData.distance = parseFloat(formData.distance);
    formData.gain = parseFloat(formData.gain);

    // Run all validations and gather messages as an object:
    var validations = {
        numbCheck: self.__checkNum({'Distance': formData.distance, 'Gain': formData.gain})
        // If distance is a number
        // If gain is a number
    };

    // Check if location is an empty string delete the property (see validation notes above):
    if (formData.location == '') {
        delete formData.location;
    }

    // Check if notes is an empty string delete the property:
    if (formData.notes == '') {
        delete formData.notes;
    }

    // Check if distance or gain failed numbers only validation:
    if (validations.numbCheck) {
        for (var i = 0; i < validations.numbCheck.length; i++) {
            validated.errors['numbErr'+i.toString()] = {
                message: validations.numbCheck[i].message,
            };
        }
        callback(validated);
    } else {
        // Create hike if user has passed validation:
        Hike.create(formData)
            .then(function(createdHike) {
                console.log('SUCCESSFUL CREATION IN MODEL');
                // Create success message:
                validated.messages.hikeCreated = {
                    hdr: "Hike Added!",
                    msg: "Your hike was succesfully added.",
                };
                callback(validated);
            })
            .catch(function(err) {
                console.log('UNSUCCESSFUL CREATION IN MODEL', err);
                callback(validated);
            })
    }



    // Run if statements to generate errors
    // Look at User model and mimic same technique
};

/*******************************************/
/*******************************************/
/******** 4. UPDATE HIKE VALIDATION ********/
/*******************************************/
/*******************************************/



/*********************************************/
/*********************************************/
/******** 5. PRIVATE INSTANCE METHODS ********/
/*********************************************/
/*********************************************/

/*---------------------------------------------*/
/*---- NUMERICAL CHECK FOR DISTANCE / GAIN ----*/
/*---------------------------------------------*/

HikeSchema.methods.__checkNum = function(fieldData) {
    /*
    Checks if fields are integers or not.

    Parameters:
    - `fieldData` - Object containing key value pairs of which values are evaluated for being numerical or not.
    */

    // Because this validation function can evaluate an object containing numerous properties, this empty errors array below will hold any errors we generate:
    var errors = [];

    // Iterate through each property of fieldData and evaluate it as being a number:
    for (var property in fieldData) {
        if (fieldData.hasOwnProperty(property)) {
            // Check if each property value is a number:
            if (typeof(fieldData[property]) != 'number') {
                errors.push(new Error(property + ' must be an integer.'));
            }
        }
    }

    // If errors send them back:
    if (errors.length > 0){
        return errors;
    } else {
        return undefined;
    }

};




/***************************************/
/***************************************/
/****** 6. MODEL CREATION & EXPORT *****/
/***************************************/
/***************************************/

// Instantiate Mongoose Model:
var Hike = mongoose.model('Hike', HikeSchema);

// Export Model:
module.exports = Hike;
