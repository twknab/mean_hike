// Setup dependencies (like `express-session`):
var session = require('express-session'),
    morgan = require('morgan'),
    apiCheck = require('./../middleware/api-check');

// Setup 'client' and 'bower_components' static folders:
module.exports = function(express, app, bodyParser, path) {

    // If using 'express-session', setup here.
    var sessionInfo = {
        secret: 'gimmeMoreCookies',
        resave: false,
        saveUninitialized: true,
        name: 'myCookie',
        cookie: {
            secure: false, // if using HTTPS set as true
            httpOnly: false, // forces HTTP if true
            age: 3600000, // expiration is 1 year
        }
    };

    // Setup Static Folders (client and bower_components)
    app.use(express.static(path.join(__dirname, './../../client')))
        .use(express.static(path.join(__dirname, './../../bower_components')))
        .use(session(sessionInfo))
        .use(morgan('dev'))
        .use('/*', apiCheck) // intercepts all routes for API check -- needed due to Angular's HTML5 mode request changes
        .use(bodyParser.json()); // setup bodyParser to send form data as JSON
};
