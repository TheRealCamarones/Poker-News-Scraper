// boilerplate to connect to the server and make the connection to the mongoose db
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// line for heroku deployment, makes sure it finds an open port
var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// set up the middleware

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make sure the public folder is viewable
app.use(express.static("public"));

// connect to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// fun line from class to make sure the connection is parsed through a non deprecated version
mongoose.connect(MONGODB_URI, { useNewUrlParser : true });

// and then have the server listen
app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!`)
});