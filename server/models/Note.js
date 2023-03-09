require("dotenv").config();
const mongoDB = require("mongodb");
const mongoose = require("mongoose");
const DB_STRING = process.env.DB_STRING;

mongoose.set("strictQuery", true);
mongoose.connect(DB_STRING, {
  useNewUrlParser: true,
});

const noteSchema = new mongoose.Schema({
  userId: String,
  Id: String,
  title: String,
  body: String,
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
