const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
// const passport = require('passport');
const passport = require("./passport/");

const routes = require("./routes/routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on("connected", () => {
  console.log("Database connction successful!");
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("tiny"));

app.use("/api", routes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

app.listen(PORT, console.log(`Express server listening on port ${PORT}`));
