const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

// to send extra data, add passReqToCallback: true object and add req to callback arguments
// "about" is just an example
const SignupStrategy = new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err, null);
      } else if (user) {
        return done("User already exists.", null);
      }

      const pw_hash = bcrypt.hashSync(password, 10);
      const newUser = new User({
        username: username,
        password: pw_hash
      });
      newUser.save((err, user) => {
        if (err) {
          return done(err, null);
        } else {
          return done(null, user);
        }
      });
    });
  }
);

module.exports = SignupStrategy;
