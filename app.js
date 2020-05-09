let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/shatabProj");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //mention the public directory from which we are serving the static files

app.get("/", function (req, res) {
  res.render("Landing");
});

app.get("/shop", function (req, res) {
  res.render("ShoppingRoomPage");
});

app.listen(3000, function () {
  console.log("Listening !!!");
});
