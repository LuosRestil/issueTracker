const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const ObjectID = require("mongodb").ObjectID;
const User = require("../models/user");

const SigninStrategy = new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, done) => {
    User.findOne({ username: username }, function(err, user) {
      console.log("User " + username + " attempted to log in.");
      if (err) {
        return done(err, null);
      } else if (!user) {
        return done("Invalid username or password. (username)", null);
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done("Invalid username or password. (password)", null);
      }
      console.log("Login successful.");
      return done(null, user);
    });
  }
);

module.exports = SigninStrategy;
