const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongo = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const app = express();

app.use("/public", express.static(process.cwd() + "./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongo.connect(
  process.env.DB_URI,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.log(`Database error: ${err}`);
    } else {
      console.log("Connected to database.");

      let db = client.db(client.dbName);

      app.route("/").get((req, res) => {
        res.sendFile(process.cwd() + "/views/index.html");
      });

      app.route("/:project/").get((req, res) => {
        res.sendFile(process.cwd() + "/views/index.html");
      });

      app.listen(process.env.PORT || 8000, function() {
        console.log("Listening on port " + process.env.PORT);
      });
    }
  }
);
