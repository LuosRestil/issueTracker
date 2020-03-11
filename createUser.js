const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on("connected", () => {
  console.log("Database connction successful!");
});

let username = process.argv[2];
let password = process.argv[3];
let role = process.argv[4];
let pw_hash = bcrypt.hashSync(password, 10);

const newUser = new User({
  username: username,
  password: pw_hash,
  role: role
});

newUser.save((err, user) => {
  if (err) {
    console.log(err);
    mongoose.connection.close();
  } else {
    console.log(user);
    mongoose.connection.close();
  }
});
