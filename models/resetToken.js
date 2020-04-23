const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 900 },
});

const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);

module.exports = ResetToken;
