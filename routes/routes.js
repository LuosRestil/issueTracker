const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Issue = require("../models/issue");
const ResetToken = require("../models/resetToken");
const passport = require("../passport");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HDEMAIL,
    pass: process.env.HDPASS,
  },
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.send({ error: "No user found." });
}

router.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, (err, docs) => {
    if (err) {
      return res.send({ error: err });
    } else if (docs) {
      return res.send({ error: "User already exists." });
    } else {
      const pw_hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: pw_hash,
      });
      newUser.save((err, user) => {
        if (err) {
          return res.send({ error: err });
        } else {
          return res.send({ msg: "Registration successful!" });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  // Custom passport callback, (as normal way is structured on server routing)
  passport.authenticate("local-signin", (err, user) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    // start session, serialize user with passport serialize
    req.logIn(user, (err) => {
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
      data = data.map((i) => {
        return { username: i.username, email: i.email };
      });
      return res.send({ support: data });
    }
  });
});

router.get("/getAllIssues", ensureAuth, (req, res) => {
  if (req.user.role == "admin") {
    Issue.find({}, null, { sort: { dateTimeCreated: -1 } }, (err, data) => {
      if (err) {
        return res.send({ error: err });
      } else if (data) {
        return res.send({ data: data });
      }
    });
  } else if (req.user.role == "support") {
    Issue.find(
      { assignedTo: null },
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

router.get("/getIssues/:dept", ensureAuth, (req, res) => {
  let dept = req.params.dept;
  if (req.user.role == "admin") {
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
  } else if (req.user.role == "support") {
    Issue.find(
      { assignedTo: { username: null, email: null }, department: dept },
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
      { "assignedTo.username": req.user.username },
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
    return res
      .status(401)
      .send({ error: "ID does not match requested support tickets." });
  } else {
    Issue.find(
      { "createdBy.username": req.user.username },
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

router.get("/getIssuesByUser/:username", ensureAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({ error: "Access unauthorized." });
  } else {
    User.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        return res.send({ error: err });
      } else if (data) {
        if (data.role === "user") {
          Issue.find(
            { "createdBy.username": req.params.username },
            null,
            { sort: { dateTimeCreated: -1 } },
            (err, data) => {
              if (err) {
                return res.send({ error: err });
              } else {
                return res.send({ data: data });
              }
            }
          );
        } else {
          Issue.find(
            { "assignedTo.username": req.params.username },
            null,
            { sort: { dateTimeCreated: -1 } },
            (err, data) => {
              if (err) {
                return res.send({ error: err });
              } else {
                return res.send({ data: data });
              }
            }
          );
        }
      } else {
        return res.send({ error: "No such user found." });
      }
    });
  }
});

router.post("/submitIssue", ensureAuth, (req, res) => {
  const newIssue = new Issue({
    department: req.body.department,
    title: req.body.title,
    text: req.body.text,
    createdBy: { username: req.user.username, email: req.user.email },
  });
  newIssue.save((err, issue) => {
    if (err) {
      return res.send({ error: err });
    } else {
      var mailOptions = {
        from: "Help Desk",
        to: req.user.email,
        subject: "Support ticket submission",
        text: `Your support ticket has been successfully submitted! Your reference number is ${issue._id}. You will receive further notifications when the status of your ticket has been updated.\nThank you!\n~Help Desk`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.send({ error: error });
        } else {
          console.log("Email sent: " + info.response);
          return res.send({
            msg: `Issue ${issue._id} submitted successfully.`,
          });
        }
      });
    }
  });
});

router.put("/assignment/:issueNumber", ensureAuth, (req, res) => {
  let support = req.body.assignment;
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .send({ error: "Only admins are authorized to assign support tickets." });
  } else {
    Issue.findOne({ _id: req.params.issueNumber }, (err, docs) => {
      if (err) {
        return res.send({ error: err });
      } else {
        let toUser = docs.createdBy.email;
        let toSupport = support.email;
        let toOldSupport;
        if (docs.assignedTo) {
          toOldSupport = docs.assignedTo.email;
        }
        Issue.updateOne(
          { _id: req.params.issueNumber },
          {
            assignedTo: {
              username: support.username,
              email: support.email,
            },
            status: "pending",
          },
          (err, docs) => {
            if (err) {
              return res.send({ error: err });
            } else {
              if (toOldSupport) {
                // previously assigned
                var mailOptionsSupport = {
                  from: "Help Desk",
                  to: toSupport,
                  subject: "New assignment",
                  text: `You have been assigned a new support ticket with id ${req.params.issueNumber}. Please check your dashboard for more information. If you have any questions, please contact an administrator.\nThank you!\n~Help Desk`,
                };
                transporter.sendMail(mailOptionsSupport, (err, data) => {
                  if (err) {
                    return res.send({ error: err });
                  } else {
                    var mailOptionsOldSupport = {
                      from: "Help Desk",
                      to: toOldSupport,
                      subject: "Assignment removed",
                      text: `Your assignment with id ${req.params.issueNumber} has been reassigned to a different member of support staff, and is no longer your responsibility. If you have any questions, please contact an administrator.\nThank you!\n~Help Desk`,
                    };
                    transporter.sendMail(mailOptionsOldSupport, (err, data) => {
                      if (err) {
                        console.log(err);
                        return res.send({ error: err });
                      } else {
                        return res.send({
                          msg: "Assignment/reassignment successful.",
                        });
                      }
                    });
                  }
                });
              } else {
                // not previously assigned
                var mailOptionsSupport = {
                  from: "Help Desk",
                  to: toSupport,
                  subject: "New assignment",
                  text: `You have been assigned a new support ticket with id ${req.params.issueNumber}. Please check your dashboard for more information. If you have any questions, please contact an administrator.\nThank you!\n~Help Desk`,
                };
                transporter.sendMail(mailOptionsSupport, (err, data) => {
                  if (err) {
                    return res.send({ error: err });
                  } else {
                    var mailOptionsUser = {
                      from: "Help Desk",
                      to: toUser,
                      subject: "Support ticket update",
                      text: `Your support ticket with id ${req.params.issueNumber} has been assigned to a member of support staff, and will be resolved as soon as possible!\nThank you!\n~Help Desk`,
                    };
                    transporter.sendMail(mailOptionsUser, (err, data) => {
                      if (err) {
                        return res.send({ error: err });
                      } else {
                        return res.send({
                          msg: "Assignment/reassignment successful.",
                        });
                      }
                    });
                  }
                });
              }
            }
          }
        );
      }
    });
  }
});

router.put("/claimIssue/:issueNumber", ensureAuth, (req, res) => {
  Issue.findOne({ _id: req.params.issueNumber }, (err, docs) => {
    if (err) {
      return res.send({ error: err });
    } else {
      console.log(`req.body.claim == ${req.body.claim}`);
      let toUser = docs.createdBy.email;
      Issue.updateOne(
        { _id: req.params.issueNumber },
        {
          assignedTo: {
            username: req.body.claim.username,
            email: req.body.claim.email,
          },
          status: "pending",
        },
        (err, docs) => {
          if (err) {
            return res.send({ error: err });
          } else {
            var mailOptionsUser = {
              from: "Help Desk",
              to: toUser,
              subject: "Support ticket update",
              text: `Your support ticket with id ${req.params.issueNumber} has been assigned to a member of support staff, and will be resolved as soon as possible!\nThank you!\n~Help Desk`,
            };
            transporter.sendMail(mailOptionsUser, (err, data) => {
              if (err) {
                return res.send({ error: err });
              } else {
                return res.send({
                  msg: "Claim successful!",
                });
              }
            });
          }
        }
      );
    }
  });
});

router.get("/closeIssue/:issueNumber", ensureAuth, (req, res) => {
  Issue.findOne({ _id: req.params.issueNumber }, (err, docs) => {
    if (err) {
      return res.send({ error: err });
    } else if (docs) {
      if (
        req.user.username === docs.assignedTo.username ||
        req.user.role === "admin"
      ) {
        let toUser = docs.createdBy.email;
        Issue.updateOne(
          { _id: req.params.issueNumber },
          { status: "closed" },
          (err, docs) => {
            if (err) {
              return res.send({ error: err });
            } else {
              var mailOptionsUser = {
                from: "Help Desk",
                to: toUser,
                subject: "Support ticket update",
                text: `Your support ticket with id ${req.params.issueNumber} has been closed! If you have you feel the issue has not been resolved to your satisfaction, please reach out to us and let us know.\nThank you!\n~Help Desk`,
              };
              transporter.sendMail(mailOptionsUser, (err, data) => {
                if (err) {
                  return res.send({ error: err });
                } else {
                  return res.send({
                    msg: "Ticket closed successfully!",
                  });
                }
              });
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
  Issue.findOne({ _id: req.params.issueNumber }, (err, docs) => {
    if (err) {
      console.log("Issue.findOne error...");
      return res.send({ error: err });
    } else {
      if (req.user.role === "admin") {
        console.log("role: admin");
        if (docs.status === "closed") {
          // closed
          Issue.deleteOne({ _id: req.params.issueNumber }, (err, data) => {
            if (err) {
              return res.send({ error: err });
            } else {
              return res.send({ msg: "Ticket deleted." });
            }
          });
        } else {
          // not closed
          let toUser = docs.createdBy.email;
          let toSupport;
          console.log(docs);
          if (docs.assignedTo.email) {
            console.log(`docs.assignedTo == ${docs.assignedTo}`);
            // previously assigned
            console.log("previously assigned...");
            toSupport = docs.assignedTo.email;
            console.log(`toSupport == ${toSupport}`);
            Issue.deleteOne({ _id: req.params.issueNumber }, (err, data) => {
              if (err) {
                return res.send({ error: err });
              } else {
                var mailOptionsUser = {
                  from: "Help Desk",
                  to: toUser,
                  subject: "Support ticket deleted",
                  text: `Your support ticket with id ${req.params.issueNumber} has been deleted. If you feel this was done in error, please get in touch with us.\nThank you!\n~Help Desk`,
                };
                transporter.sendMail(mailOptionsUser, (err, data) => {
                  if (err) {
                    return res.send({ error: err });
                  } else {
                    console.log("user email sent successfully...");
                    console.log(`toSupport == ${toSupport}`);
                    let mailOptionsSupport = {
                      from: "Help Desk",
                      to: toSupport,
                      subject: "Support Ticket Deleted",
                      text: `Your support ticket with id ${req.params.issueNumber} has been deleted and is no longer your responsibility. If you have any questions, please contact an administrator.\n~Help Desk`,
                    };
                    console.log(
                      `mailOptionsSupport == ${JSON.stringify(
                        mailOptionsSupport
                      )}`
                    );
                    transporter.sendMail(mailOptionsSupport, (err, data) => {
                      if (err) {
                        return res.send({ error: err });
                      } else {
                        return res.send({
                          msg: "Ticket deleted successfully.",
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            // not previously assigned
            console.log("not previously assigned...");
            Issue.deleteOne({ _id: req.params.issueNumber }, (err, docs) => {
              if (err) {
                return res.send({ error: err });
              } else {
                var mailOptionsUser = {
                  from: "Help Desk",
                  to: toUser,
                  subject: "Support ticket deleted",
                  text: `Your support ticket with id ${req.params.issueNumber} has been deleted. If you feel this was done in error, please get in touch with us.\nThank you!\n~Help Desk`,
                };
                transporter.sendMail(mailOptionsUser, (err, data) => {
                  if (err) {
                    return res.send({ error: err });
                  } else {
                    return res.send({
                      msg: "Ticket deleted successfully.",
                    });
                  }
                });
              }
            });
          }
        }
      } else if (req.user.role === "user") {
        console.log("role: user");
        if (docs.status === "closed") {
          Issue.deleteOne({ _id: req.params.issueNumber }, (err, data) => {
            if (err) {
              return res.send({ error: err });
            } else {
              return res.send({ msg: "Ticket deleted." });
            }
          });
        } else {
          let toSupport;
          if (req.user.username !== docs.createdBy.username) {
            return res
              .status(401)
              .send({ error: "you are not authorized to delete this ticket." });
          } else {
            if (docs.assignedTo.email) {
              toSupport = docs.assignedTo.email;
              // delete and email assignedTo

              Issue.deleteOne({ _id: req.params.issueNumber }, (err, docs) => {
                if (err) {
                  return res.send({ error: err });
                } else {
                  let mailOptionsSupport = {
                    from: "Help Desk",
                    to: toSupport,
                    subject: "Support Ticket Deleted",
                    text: `Your support ticket with id ${req.params.issueNumber} has been deleted and is no longer your responsibility. If you have any questions, please contact an administrator.\n~Help Desk`,
                  };
                  transporter.sendMail(mailOptionsSupport, (err, data) => {
                    if (err) {
                      return res.send({ error: err });
                    } else {
                      return res.send({
                        msg: "Ticket deleted successfully.",
                      });
                    }
                  });
                }
              });
            } else {
              Issue.deleteOne({ _id: req.params.issueNumber }, (err, docs) => {
                if (err) {
                  return res.send({ error: err });
                } else {
                  return res.send({ msg: "Ticket deleted successfully." });
                }
              });
            }
          }
        }
      } else {
        return res
          .status(401)
          .send({ error: "You are not authorized to delete this ticket." });
      }
    }
  });
});

router.post("/resetRequest", (req, res) => {
  // generate token, add resetToken to db, send email to user
  if (req.body.email) {
    User.findOne({ email: req.body.email }, (err, docs) => {
      if (err) {
        return res.send(err);
      } else {
        if (docs) {
          // generate token, add resetToken to db, send email to user
          let resetToken = new ResetToken({
            userId: docs._id,
            resetToken: crypto.randomBytes(16).toString("hex"),
          });
          resetToken.save((err) => {
            if (err) {
              return res.send(err);
            }
            ResetToken.deleteOne({
              userId: docs._id,
              resetToken: { $ne: resetToken.resetToken },
            }).exec();
          });
          let mailOptions = {
            to: docs.email,
            from: "Help Desk",
            subject: "Password Reset Request",
            text:
              "You are receiving this email from Help Desk because you have requested a password reset.\n\n" +
              "Please click on the following link, or copy it and paste it into your browser, to complete the process:\n\n" +
              `${req.protocol}` +
              "://" +
              req.get("Host") +
              "/emailResetPass/" +
              resetToken.resetToken +
              "\n\n" +
              "If you did not request this, please ignore this email and your password will remain unchanged.\n",
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
              return res.send(err);
            } else {
              console.log("Email sent: " + info.response);
              return res.send({
                msg: `Success.`,
              });
            }
          });
        } else {
          return res.send({ error: "Invalid email address." });
        }
      }
    });
  } else {
    return res.send({ error: "Email is required." });
  }
});

router.post("/emailResetPass", (req, res) => {
  // check token, reset user pass
  if (req.body.password !== req.body.confirmPassword) {
    return res.send({
      error: "Password confirmation does not match password.",
    });
  }
  if (req.body.token) {
    ResetToken.findOne({ resetToken: req.body.token }, (err, docs) => {
      if (err) {
        return res.send(err);
      } else {
        if (docs) {
          const pw_hash = bcrypt.hashSync(req.body.password, 10);
          User.findOneAndUpdate(
            { _id: docs.userId },
            { password: pw_hash },
            (err, docs) => {
              if (err) {
                return res.send(err);
              } else {
                console.log(docs);
                return res.send({
                  msg:
                    "Your password has been successfully reset. You may now log in.",
                });
              }
            }
          );
        } else {
          return res.send({ error: "Unauthorized or expired URL." });
        }
      }
    });
  } else {
    return res.status(500).send({ error: "Unauthorized URL." });
  }
});

module.exports = router;
