const passport = require("passport");
const User = require("../models/user");

passport.serializeUser(function(user, done) {
  console.log("Serializing user...");
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function(err, user) {
    console.log(`Deserialize: ${user}`);
    done(err, user);
  });
});

// import strategies
// signup strategy takes care of registering user. NOT NECESSARY.
const SignUpStrategy = require("./SignupStrategy");
const SignInStrategy = require("./SigninStrategy");

passport.use("local-signin", SignInStrategy);
passport.use("local-signup", SignUpStrategy);

module.exports = passport;
