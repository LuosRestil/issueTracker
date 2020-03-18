const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const IssueSchema = new Schema({
  department: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdBy: {
    username: { type: String, required: true },
    email: { type: String, required: true }
  },
  assignedTo: { username: String, email: String },
  status: { type: String, default: "new" },
  dateTimeCreated: { type: Date, default: Date.now() }
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;
