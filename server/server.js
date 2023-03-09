require("dotenv").config();
const express = require("express");
const passport = require("passport");
const app = express();
const LocatStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./models/User");
const routes = require("./routes");
const session = require("express-session");
const bodyParser = require("body-parser");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "myLittleSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.use(new LocatStrategy(User.authenticate()));
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/google/home",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});
passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

app.use(routes);

app.listen(3001, (err) => {
  if (!err) {
    console.log("Server started on port 3001.");
  } else {
    console.log(err);
  }
});
