/*
This file sets up our application module and our application middleware.
*/

// Setup application dependencies:
var session = require('express-session'), // store session data
    morgan = require('morgan'), // see HTTP methods in server console
    apiCheck = require('./../middleware/api-check'); // custom route checker (for HTML5 mode)

// Setup 'client' and 'bower_components' static folders:
module.exports = function(express, app, bodyParser, path) {
    /*
    Setup our application module.

    Parameters:
    - `express`: express framework.
    - `app`: invoked express application.
    - `bodyParser` - module to parse form data.
    - `path` - module to allow us to work with file tree.
    */

    // Configure 'express-session':
    var sessionInfo = {
        secret: 'gimmeMoreCookies', // MOVE THIS SECRET KEY
        resave: false,
        saveUninitialized: true,
        name: 'myCookie',
        cookie: {
            secure: false, // if using HTTPS set as true
            httpOnly: false, // forces HTTP if true
            age: 3600000, // expiration is 1 year
        }
    };

    // Attach middleware to our express application:
    app.use(express.static(path.join(__dirname, './../../client'))) // gives us access to `client` folder.
        // Gives us access to `bower_components` folder:
        .use(express.static(path.join(__dirname, './../../bower_components')))
        // Invokes `express-session` passing along our session data:
        .use(session(sessionInfo))
        // Turns on Morgan for HTTP method console logging:
        .use(morgan('dev'))
        // Intercepts all routes passing them into API check for HTML5 mode:
        .use('/*', apiCheck)
        // Invoke bodyParser module to send form data as JSON:
        .use(bodyParser.json());
};
