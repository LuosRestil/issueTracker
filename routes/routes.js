const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Issue = require("../models/issue");
const passport = require("../passport");

function ensureAuth(req, res, next) {
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

    return res.json({ user: user._id });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  // Custom passport callback, (as normal way is structured on server routing)
  passport.authenticate("local-signin", (err, user) => {
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

router.get("/getUser", ensureAuth, (req, res) => {
  req.user.password = "[redacted]";
  return res.send(req.user);
});

router.get("/getSupport", ensureAuth, (req, res) => {
  User.find({ role: "support" }, (err, data) => {
    if (err) {
      return res.send(err);
    } else if (data) {
      let support = data.map(item => item.username);
      return res.send({ support: support });
    }
  });
});

router.get("/getAllIssues", ensureAuth, (req, res) => {
  if (req.user.role == "admin" || req.user.role == "support") {
    Issue.find({}, null, { sort: { dateTimeCreated: -1 } }, (err, data) => {
      if (err) {
        return res.send({ error: err });
      } else if (data) {
        return res.send({ data: data });
      }
    });
  } else {
    return res.status(401).send({ error: "Unauthorized route." });
  }
});

router.get("/getIssues/:dept", ensureAuth, (req, res) => {
  if (req.user.role == "admin" || req.user.role == "support") {
    let dept = req.params.dept;
    Issue.find(
      { department: dept },
      null,
      { sort: { dateTimeCreated: -1 } },
      (err, data) => {
        if (err) {
          return res.send({ error: err });
        } else if (data) {
          return res.send({ data: data });
        }
      }
    );
  } else {
    return res.status(401).send({ error: "Unauthorized route." });
  }
});

router.get("/getSupportIssues/:id", ensureAuth, (req, res) => {
  if (req.user._id != req.params.id && req.user.role !== "admin") {
    return res
      .status(401)
      .send({ error: "ID does not match requested support tickets." });
  } else {
    Issue.find(
      { assignedTo: req.user.username },
      null,
      { sort: { dateTimeCreated: -1 } },
      (err, data) => {
        if (err) {
          return res.send({ error: err });
        } else if (data) {
          return res.send({ data: data });
        }
      }
    );
  }
});

router.get("/getUserIssues/:id", ensureAuth, (req, res) => {
  if (req.user._id != req.params.id) {
    console.log("id does not match requested tickets...");
    return res
      .status(401)
      .send({ error: "ID does not match requested support tickets." });
  } else {
    Issue.find(
      { createdBy: req.user.username },
      null,
      { sort: { dateTimeCreated: -1 } },
      (err, data) => {
        if (err) {
          return res.send({ error: err });
        } else if (data) {
          return res.send({ data: data });
        }
      }
    );
  }
});

router.post("/submitIssue", ensureAuth, (req, res) => {
  console.log(req.body);
  const newIssue = new Issue({
    department: req.body.department,
    title: req.body.title,
    text: req.body.text,
    createdBy: req.user.username
  });
  newIssue.save((err, issue) => {
    if (err) {
      return res.send({ error: err });
    } else {
      return res.send({ msg: `Issue ${issue._id} submitted successfully.` });
    }
  });
});

router.put("/assignment/:issueNumber", ensureAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .send({ error: "Only admins are authorized to assign support tickets." });
  } else {
    Issue.updateOne(
      { _id: req.params.issueNumber },
      { assignedTo: req.body.assignment, status: "pending" },
      (err, docs) => {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send({ msg: "Assigned successfully." });
        }
      }
    );
  }
});

router.put("/claimIssue/:issueNumber", ensureAuth, (req, res) => {
  Issue.updateOne(
    { _id: req.params.issueNumber },
    { assignedTo: req.body.claim, status: "pending" },
    (err, docs) => {
      if (err) {
        return res.send({ error: err });
      } else {
        return res.send({ msg: "Claimed successfully." });
      }
    }
  );
});

router.get("/closeIssue/:issueNumber", ensureAuth, (req, res) => {
  Issue.findOne({ _id: req.params.issueNumber }, (err, data) => {
    if (err) {
      return res.send({ error: err });
    } else if (data) {
      if (req.user.username === data.assignedTo || req.user.role === "admin") {
        Issue.updateOne(
          { _id: req.params.issueNumber },
          { status: "closed" },
          (err, docs) => {
            if (err) {
              return res.send({ error: err });
            } else {
              return res.send({ msg: "Closed successfully." });
            }
          }
        );
      } else {
        return res.send({ error: "Unauthorized action." });
      }
    }
  });
});

router.delete("/deleteIssue/:issueNumber", ensureAuth, (req, res) => {
  if (req.user.role == "admin") {
    Issue.deleteOne({ _id: req.params.issueNumber }, (err, data) => {
      if (err) {
        return res.send({ error: err });
      } else {
        return res.send({ msg: "Ticket deleted." });
      }
    });
  } else if (req.user.role == "user") {
    Issue.find(
      { _id: req.params.issueNumber, createdBy: req.user.username },
      (err, data) => {
        if (err) {
          return res.status(401).send({
            error: "You are not authorized to delete this support ticket."
          });
        } else {
          Issue.deleteOne({ _id: req.params.issueNumber }, (err, data) => {
            if (err) {
              return res.send({ error: err });
            } else {
              return res.send({ msg: "Ticket deleted." });
            }
          });
        }
      }
    );
  } else {
    return res
      .status(401)
      .send({ error: "You are not authorized to delete this ticket." });
  }
});

module.exports = router;
