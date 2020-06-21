var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  Order = require("../models/order"),
  Cart = require("../models/cart");

//root route
router.get("/", function (req, res) {
  res.render("landing");
});

//===========================
//Auth Routes
//===========================

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    Email: req.body.Email,
    phone: req.body.phone,
    address: req.body.address,
  });

  if (req.body.admin === "AmiraBasmaSharif752016CS") {
    newUser.isAdmin = true;
  }

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/shop");
      }
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});
//handling login logic
//app.post("/login",middleware,callback)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/shop",
    failureRedirect: "/login",
    failureFlash: "Incorrect username or password",
  }),
  function (req, res) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      console.log(oldUrl);
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect("/profile");
    }
  }
);
//logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
//////////////////////////////////////////////////////////
var ObjectID = require("mongodb").ObjectID;
router.get("/profile", isLoggedIn, function (req, res, next) {
  var name = req.user.username;
  var choice = [];
  Order.find({}, function (err, orders) {
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].user.username === name) {
        choice.push(orders[i]);
      }
    }
    if (err) return err;
    var cart;
    choice.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render("user/profile", { orders: choice });
  });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First");
  res.redirect("/login");
}

module.exports = router;
