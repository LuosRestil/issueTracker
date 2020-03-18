const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, unique: true, require: true, dropDups: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // roles are admin, support, or user
  role: { type: String, required: true, default: "user" }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
