var express = require("express"),
  router = express.Router({ mergeParams: true }),
  Constructor = require("../models/constructor"), //beto3 el db fa baro7 ll files ele gowa el models
  Comment = require("../models/comment");
//   middleware = require("../middleware");

//======================================================
//comments Routes
//=======================================================
//comments new
router.get("/new", isLoggedIn, function (req, res) {
  //find constructor by id
  Constructor.findById(req.params.id, function (err, constructor) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/news", { constructor: constructor });
    }
  });
});
//comments create
router.post("/", isLoggedIn, function (req, res) {
  //lookup constructor using ID
  Constructor.findById(req.params.id, function (err, constructor) {
    if (err) {
      console.log(err);
      res.redirect("/constructorhelp");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          //save comment
          comment.save();
          constructor.comments.push(comment);
          constructor.save();
          console.log(comment);
          res.redirect("/constructors/" + constructor._id);
        }
      });
    }
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
