require("dotenv").config();
const mongoDB = require("mongodb");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const DB_STRING = process.env.DB_STRING;

mongoose.set("strictQuery", true);
mongoose.connect(DB_STRING, {
  useNewUrlParser: true,
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  notes: [],
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
