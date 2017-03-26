// Setup dependencies (like `express-session`):
var session = require('express-session');

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
        .use(bodyParser.json()) // setup bodyParser to send form data as JSON
        .all('/*', function(req, res) { // rewrites our routes for Angular's HTML5 mode
            res.sendFile(path.join(__dirname, './../../client/index.html')); // delivers index.html which angular-route will then load appropriate partials
        });
};
