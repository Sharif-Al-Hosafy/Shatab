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
          comment.rating = req.body.rating;

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
//===================================================================
//Edit Comment
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        constructor_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});
//=====================================================================
//Update Comment
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedcomment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/constructors/" + req.params.id);
    }
  });
});
//======================================================================
//Destroy Comment
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/constructors/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        //does user own the comment or admin?
        if (foundComment.author.id.equals(req.user._id)|| req.user.isAdmin) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
