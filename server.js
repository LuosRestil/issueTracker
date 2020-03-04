const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
  console.log("Database connction successful!");
});

app.use(helmet);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

// ************************
// ROUTES
// ************************

app.listen(PORT, console.log(`Express server listening on port ${PORT}`));
