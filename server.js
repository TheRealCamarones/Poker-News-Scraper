// boilerplate to connect to the server and make the connection to the mongoose db
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// require what we need to scrape
var axios = require("axios");
var cheerio = require("cheerio");

// lets get all the models in here
var Article = require("./models/Article");
var Note = require("./models/Note")

// two global variables to simplify the passing of information to handlebars

var noteObject;
var articleObject;

// line for heroku deployment, makes sure it finds an open port
var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// include handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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

// Routing
// Start with a GET route to scrape Pokerlistings website
app.get("/scrape", function(req, res) {
    // grab html from axios to scrape specifically what I want
    axios.get("http://www.pokernewsdaily.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        // target more specifically
        $("article h3").each(function(i, element) {
            // empty object to save our information to
            var result = {};
            
            // in this case we're looking for the headline, summary, link, and an image
            // to eventually link to the front end and display in card form
            result.title = $(this)
              .children("a")
              .text();
            result.summary = $(this)
              .parent("article")
              .children("p")
              .text();
            result.link = $(this)
              .children("a")
              .attr("href");
            result.image = $(this)
              .parent("article")
              .children("img")
              .attr("src");

            Article.create(result)
              .then(function(dbArticle) {
                  console.log(dbArticle);
              })
              .catch(function(err) {
                  console.log(err);
              });
        });

        // send message to client
        res.redirect("/");
        console.log("Successfully Completed Scrape!")
    });
});

// route to grab the articles from db
app.get("/", function(req, res) {
  
  Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      articleObject = dbArticle;
      res.render("index", { articles: articleObject });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// route for grabbing article by id, populate it with the associated note
app.get("/notes/:id", function(req, res) {
  Article.findOne({ _id: req.params.id })
  // populate all notes
    .populate("notes")
    .then(function(articleNote) {
      console.log(articleNote)
      noteObject = articleNote;
      res.render("notes", { articles: articleObject, note: noteObject });
      console.log(noteObject, articleObject)
    })
    .catch(function(err) {
      res.json(err);
    });
});

// route that will save and update a specific article's note
app.post("/notes/:id", function(req, res) {
  // create a new note and pass it the req.body
  Note.create(req.body)
    .then(function(dbNote) {
      // mongoose query, finds and updates the specific article's id with the associated note
      return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote.body }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// and then have the server listen
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`)
});
