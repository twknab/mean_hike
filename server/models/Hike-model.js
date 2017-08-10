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
        required: true,
        trim: true,
    }, // end name field
    region: {
        type: String,
        minlength: [5, 'Region must be at least 5 characters.'],
        maxlength: [50, 'Region must not be greater than 50 characters.'],
        required: true,
        trim: true,
    }, // end region field
    distance: {
        type: Number,
        required: true,
    }, // end distance field
    gain: {
        type: Number,
        required: true,
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

HikeSchema.methods.validateNewHike = function(formData, callback) {
    /*
    Validates new Hike data utilizing private instance validation methods.

    Parameters:
    - `formData` - Hike data object to be validated (for new Hike creation).
    - `callback` - Callback function to run once validation completes.

    The following is validated within this method:

    Note: Please see the individual private instance functions for each specific validation.
    */

    // Store `this` variable:
    var self = this;

    // Setup validates object to hold validation errors or validated Hike:
    var validated = {
        errors: {}, // will hold errors
        validatedHike: {}, // will store validated user object
    };

    console.log("Beginning New Hike Validation now...");

    /*
    Run all validations and gather messages as an object. Please see each individual instance method at the bottom of this document to see how it works.

    If the validation fails, an error objectis returned. If the validation passes, in most cases, `undefined` is returned.
    */

    // Run all validations and gather messages as a dictionary:
    var validations = {
        // Insert validations here
    };

    // Run if statements to generate errors
    // Look at User model and mimic same technique
};

/*******************************************/
/*******************************************/
/******** 4. UPDATE HIKE VALIDATION ********/
/*******************************************/
/*******************************************/

HikeSchema.methods.validateHikeUpdate = function(formData, callback) {
    /*
    Validates full Hike update data utilizing private instance validation methods.

    Parameters:
    - `formData` - Hike data object to be validated prior to updating.
    - `callback` - Callback function to run once validation completes.

    The following is validated within this method:

    Note: Please see the individual private instance functions for each specific validation.
    */

    // Save `this` as as self:
    var self = this;

    // Create validation object to hold any errors or validated user:
    var validated = {
        errors: {},
        validatedHike: {},
    };

    console.log("Beginning Update Hike Validation now...");

    // Run all validations and gather messages as a dictionary:
    var validations = {

    };

};

/*********************************************/
/*********************************************/
/******** 5. PRIVATE INSTANCE METHODS ********/
/*********************************************/
/*********************************************/

/*-------------------------------------*/
/*---- Duplicate Check Validations ----*/
/*-------------------------------------*/

/***************************************/
/***************************************/
/****** 6. MODEL CREATION & EXPORT *****/
/***************************************/
/***************************************/

// Instantiate Mongoose Model:
var Hike = mongoose.model('Hike', HikeSchema);

// Export Model:
module.exports = Hike;
