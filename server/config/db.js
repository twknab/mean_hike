/*
This file sets up our mongoDB database and our connection to Mongoose.
*/

// Setup our dependencies:
var mongoose = require('mongoose'), // grab `mongoose` module
    path = require('path'), // grab `path` for working with file tree
    fs = require('fs'), // utilize `fs` (file system) for accessing file system
    modelsPath = path.join(__dirname, './../models'), // provide access to our models folder
    dbName = 'hikeDB'; // name of our database to be utilized in this application

// Iterate through Models folder and load each JS file:
fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.indexOf('.js') > 0) {
        require(modelsPath + '/' + file);
    }
});

// Update Mongoose Promise Library (to avoid deprecration warning):
mongoose.Promise = global.Promise;

// Setup Mongoose and MongoDB connection:
mongoose.connect('mongodb://localhost/' + dbName); // this connects Mongoose to your MongoDB above

// Mongoose/Mongo/Node connection events:
mongoose.connection
    .on('connected', function() {
        console.log('Mongoose now connected to MongoDB using DB:', dbName);
    })
    .on('disconnected', function() {
        console.log('Mongoose disconected from:', dbName);
    })
    .on('error', function(err) {
        console.log('Mongoose has encountered an error connecting to MongoDB.', err);
    });

// If Node connection breaks, close Mongoose and MongoDB connections:
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose connection to MongoDB closing due to lost Node connection.');
        process.exit(0);
    });
});
