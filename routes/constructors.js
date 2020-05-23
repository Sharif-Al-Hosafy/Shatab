var express = require("express"),
  router = express.Router(),
  Constructor = require("../models/constructor");

//Index Route=show all constructors
router.get("/constructorhelp", function (req, res) {
  Constructor.find({}, function (err, allconstructors) {
    if (err) {
      console.log(err);
    } else {
      res.render("constructors/index", { constructors: allconstructors });
    }
  });
});

//show Route-show info about constructor
router.get("/constructors/:id", function (req, res) {
  Constructor.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundconstructor) {
      if (err) {
        res.redirect("/constructorhelp");
      } else {
        res.render("constructors/show", { constructor: foundconstructor });
      }
    });
});

module.exports = router;
