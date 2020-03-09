const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("../passport");
const bcrypt = require("bcrypt");

function ensureAuth(req, res, next) {
  console.log("ensure auth");
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.send({ error: "Unauthorized" });
}

router.post("/register", (req, res, next) => {
  // Custom passport callback, (as normal way is structured on server routing)
  passport.authenticate("local-signup", (err, user) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    return res.json({ msg: "You should be registered." });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  // Custom passport callback, (as normal way is structured on server routing)
  passport.authenticate("local-signin", (err, user, data) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    // start session, serialize user with passport serialize
    req.logIn(user, err => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json({ user: user._id });
    });
  })(req, res, next);
  // not sure where this closing (req, res, next) is going...
});

router.get("/logout", (req, res) => {
  req.logout();
  return res.send({ msg: "Logged out" });
});

router.get("/getUserInfo", (req, res) => {
  console.log("hitting /getUserInfo");
  if (req.user) {
    console.log("req.user found, logging...");
    console.log(req.user);
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log("mongo error, returning error");
        return res.send(err);
      }
      console.log("success, sending user data");
      return res.send(user);
    });
  } else {
    console.log("req.user not found");
    return res.status(401).send({ error: "Not authorized." });
  }
});

module.exports = router;
