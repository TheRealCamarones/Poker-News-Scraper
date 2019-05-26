var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// same as Note, make a new object as a model

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // I'm thinking you'd store an img's src tag the same way you store a link's href, so we'll call this a string for now
    image: {
        type: String
    },
    // as they showed us in class, ref links to the Note model
    // and populates each article with a Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
// same as Note, create mongoose model
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;