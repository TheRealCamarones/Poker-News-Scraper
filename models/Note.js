var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// similar to sequelize model, creates a new object for the note
var NoteSchema = new Schema({
    // simple note schema, just need a body for this object
    body: String
});

// and then use mongoose model method to create the model
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;