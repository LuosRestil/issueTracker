const passport = require("passport");
const User = require("../models/user");

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

const SignInStrategy = require("./SigninStrategy");

passport.use("local-signin", SignInStrategy);

module.exports = passport;
