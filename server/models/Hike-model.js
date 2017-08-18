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
        required: [true, 'Hike name is required.'],
        trim: true,
    }, // end name field
    region: {
        type: String,
        minlength: [2, 'Region must be at least 2 characters.'],
        maxlength: [50, 'Region must not be greater than 50 characters.'],
        required: [true, 'Hiking region is required.'],
        trim: true,
    }, // end region field
    distance: {
        type: Number,
        min: [1, 'Round trip distance must be at least 1 mile.'],
        max: [24874, "Round trip distance must not exceed 24,874 miles -- this is the circumference of the Earth."],
        required: [true, 'Round trip distance is required.'],
    }, // end distance field
    gain: {
        type: Number,
        // note: no min value here has been added as some hikes may have no gain.
        max: [29028 , 'Total gain must not exceed 29,028 feet -- this is the height of Mt. Everest.'],
        required: [true, 'Total gain is required.'],
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
        - name is required. (built-in validation).
        - name cannot contain empty strings.
        - name must contain only letters, numbers and: `,.!@#*-` characters.
        - region is required. (built-in validation).
        - region must contain only letters, numbers and: `,.!@#*-` characters.
        - region cannot contain empty strings.
        - distance is a number, required, and must be positive integer greater than 1.
        - gain is a number, required, and must be positive integer greater than 1.
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
        validatedHike: {}, // will hold validated Hike if successful
    };

    console.log("Beginning New Hike Validation now...");
    console.log('$$$$$$$$$$$$$$$$$$$$');
    console.log(formData);
    console.log('$$$$$$$$$$$$$$$$$$$$');

    // If distance or gain values have been submitted, parseFloat these values (meaning convert them to a number). Development note: It might be good to also add a numerical regex check here prior to parsing for extra validation. We are using a `input=["number"]` on the front end, which will not allow strings to be submitted (if the browser supports the `input=["number"]` attribute).

    // Check if hike name or hike region contains valid alphanumerical formatting with accepted punctuation (Development note: You may want to enhance your regex validations so it includes non-english characters):
    var nameCheck = self.alphaNumCheck(formData.name);
    var regionCheck = self.alphaNumCheck(formData.region);

    // If name fails alphanumeric check, send error:
    if (nameCheck) {
        validated.errors.nameAlphaNumErr = {
            message: 'Name ' + nameCheck.message,
        }
    }

    // If region name fails alphanumeric check, send error:
    if (regionCheck) {
        validated.errors.regionAlphaNumErr = {
            message: 'Region ' + regionCheck.message,
        }
    }

    // If distance or gain has been entered, run a regex check to ensure that they're positive numbers (floating point numbers accepted), and then convert them into a floating point number for database creation:
    if (formData.distance || formData.gain) {
        //
        if (formData.distance) {
            // Check if distance is valid positive floating point number:
            var numCheck = self.numCheck(formData.distance);

            // If error is returned add it to errors:
            if (numCheck) {
                validated.errors.distanceNumErr = {
                    message: 'Round trip distance ' + numCheck.message,
                };
            }

            // Else, `parseFLoat()` the number and continue validating:
            else {
                formData.distance = parseFloat(formData.distance);
            }
        }


        if (formData.gain) {
            // Check if gain is valid positive floating point number:
            numCheck = self.numCheck(formData.gain);

            // If error is returned add it to errors:
            if (numCheck) {
                validated.errors.gainNumErr = {
                    message: 'Total gain ' + numCheck.message,
                };
            }
            // Else, `paseFloat()` the number and continue:
            else {
                formData.gain = parseFloat(formData.gain);
            }
        }
    }

    // Check if location is an empty string delete the property (see validation notes above):
    if (formData.location == '') {
        delete formData.location;
    }

    // Check if notes is an empty string delete the property:
    if (formData.notes == '') {
        delete formData.notes;
    }

    // Check if any errors thus far in validation, if so send back:
    // If there are any errors send back validated object containing them:
    if (Object.keys(validated.errors).length > 0) {
        console.log("Error creating new hike:", validated.errors);
        callback(validated);
    }

    // Else, attempt to create the hike (in which case Mongoose validators will return errors if they are found):
    else {
        Hike.create(formData)
            .then(function(createdHike) {
                /*
                If user is successfully created, User object (`createdHike`) is returned.
                */

                console.log('Hike created successfully.');

                // Create success message:
                validated.messages.hikeCreated = {
                    hdr: "Hike Added!",
                    msg: "Your hike was succesfully added.",
                };

                // Add hike to validated object:
                validated.validatedHike = createdHike;

                // Run callback with validated object:
                callback(validated);
            })
            .catch(function(err) {
                /*
                If error is returned, run callback passing it along.
                */
                console.log('Error creating Hike.');
                callback(err);
            })
    }

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

HikeSchema.methods.numCheck = function(number) {
    /*
    Checks to ensure a received parameter is a positive floating point number (using regex); returns either an error or undefined, if the value passed.

    Parameters:
    - `number` - This is the value to be tested.
    */

    // If number does *NOT* pass regex test using pattern below, create an error:
    if (!(/^([\d]*\.[\d]+|[\d]+)$/.test(number))) {
        /*
        Pattern checks for a number (ie, 123..), or a number followed by a decimal (ie, 123...123...), and must be greater than 0. Error only flags if pattern is NOT matched.
        */
        var err = new Error('must be a positive integer only.');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
        return undefined;
    }
};

HikeSchema.methods.alphaNumCheck = function(string) {
    /*
    Checks to ensure a string contains only alphanumerical characters, including: `.,!@#*-`

    Development note: You may want to enhance this regex to be able to include non-english characters.
    */

    // If string does *NOT* pass regex test using pattern below, create an error:
    if (!(/^([A-Za-z0-9.,!@#*-]+\s?)*$/.test(string))) {
        /*
        Pattern checks for A-Z, a-z, 0-9, and the following: `.,!@#*`. Error only flags if pattern is NOT matched.
        */
        var err = new Error('must contain only letters, numbers, and the following characters: `.,!@#*-`');
        return err;
    }

    // Else, return `undefined` (no error):
    else {
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
