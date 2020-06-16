var express = require("express"),
  router = express.Router({ mergeParams: true }),
  Category = require("../models/category"),
  Company = require("../models/company"),
  Product = require("../models/product"),
  Cart = require("../models/cart"),
  Order = require("../models/order"),
  User = require("../models/user");
  //Index Route=show all categories
  router.get("/category", function (req, res) {
    var noMatch = null;
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), "gi");
      Category.find({ name: regex }, function (err, allcategories) {
        if (err) {
        } else {
          if (allcategories.length < 1) {
            noMatch = "No category match that query, please try again.";
          }
          res.render("category/index", {
            category: allcategories,
            noMatch: noMatch,
          });
        }
      });
    } else {
      Category.find({}, function (err, allcategories) {
        if (err) {
        } else {
          res.render("category/index", {
            category: allcategories,
            noMatch: noMatch,
          });
        }
      });
    }
  });

///////////////////////////////////////////////////////////////////////
//show form to create new category
router.get("/category/new", function (req, res) {
  res.render("category/new");
});
//CREATE-ADD NEW CATEGORY
router.post("/category", function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var newCategory = { name: name, image: image, desc: desc };
  //create a new category and save to db
  Category.create(newCategory, function (err, newlycreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/category");
    }
  });
});
///////////////////////////////////////////////////////////////////////
//SHOW -show template of category,link new category,show companies,link for more info about company
router.get("/category/:id", function (req, res) {
  //find the category with the provide ID
  var noMatch = "";
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Category.findById(req.params.id)
      .populate("companyname", null, { name: regex })
      .exec(function (err, foundCategory) {
        if (err) {
          console.log(err);
        } else {
          if (foundCategory.companyname.length < 1) {
            noMatch = "No company match that query, please try again.";
          }
          res.render("category/show", {
            category: foundCategory,
            noMatch: noMatch,
          });
        }
      });
  } else {
    Category.findById(req.params.id)
      .populate("companyname")
      .exec(function (err, foundCategory) {
        if (err) {
          console.log(err);
        } else {
          //render show template with that category
          res.render("category/show", {
            category: foundCategory,
            noMatch: noMatch,
          });
        }
      });
  }
});
/////////////////////////////////////////////////////////////////////////
//SHOW -show template of that company
router.get("/company/:id", function (req, res) {
  var noMatch = "";
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    //find the company with the provide ID
    Company.findById(req.params.id)
      .populate("products", null, { name: regex })
      .exec(function (err, foundCompany) {
        if (err) {
          console.log(err);
        } else {
          //render show products of that company
          if (foundCompany.products.length < 1) {
            noMatch = "No product match that query, please try again.";
          }
          res.render("company/show", {
            company: foundCompany,
            noMatch: noMatch,
          });
        }
      });
  } else {
    Company.findById(req.params.id)
      .populate("products")
      .exec(function (err, foundCompany) {
        if (err) {
          console.log(err);
        } else {
          //render show products of that company
          res.render("company/show", {
            company: foundCompany,
            noMatch: noMatch,
          });
        }
      });
  }
});

////////////////////////////////////////////////////////////////////
// show form to create new company for each category
router.get("/category/:id/company/new", function (req, res) {
  //find category by id
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      console.log(err);
    } else {
      res.render("company/new", { category: category });
    }
  });
});
//create new company and save in db
router.post("/category/:id/company", function (req, res) {
  //lookup category using ID
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      console.log(err);
      res.redirect("/category");
    } else {
      Company.create(req.body.company, function (err, company) {
        if (err) {
          console.log(err);
        } else {
          //save company
          company.save();
          category.companyname.push(company);
          category.save();
          res.redirect("/category");
        }
      });
    }
  });
});

/////////////////////////////////////////////////////////////////////////////////////

//show form to create new product
router.get("/company/:id/product/new", function (req, res) {
  //find  company by id
  Company.findById(req.params.id, function (err, company) {
    if (err) {
      console.log(err);
    } else {
      res.render("product/new", { company: company });
    }
  });
});
//create product and save it in db
router.post("/company/:id/product", function (req, res) {
  //lookup company using ID
  Company.findById(req.params.id, function (err, company) {
    if (err) {
      console.log(err);
      res.redirect("/category");
    } else {
      Product.create(req.body.product, function (err, product) {
        if (err) {
          console.log(err);
        } else {
          //save product
          product.save();
          company.products.push(product);
          company.save();
          res.redirect("/category");
        }
      });
    }
  });
});
////////////////////////////////////////////////////////////////////////
router.get("/product/:id/add-to-cart", isLoggedIn, function (req, res) {
  var productid = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productid, function (err, product) {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    req.flash("success", "Item is added to your cart");
    res.redirect('back');
  });
});
/////////////////////////////////////////////////////////////////////////////
router.get("/product/:id/reduce/", function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/product/:id/remove/", function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

///////////////////////////////////////////////////
router.get("/shopping-cart", isLoggedIn, function (req, res) {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  var products = cart.generateArray();
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

/////////////////////////////////////////////////////////////////////////
router.get("/checkout", isLoggedIn, function (req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("shop/checkout", { total: cart.totalPrice });
});
//////////////////////////////////////////////////////////////////////////////
router.post("/checkout", isLoggedIn, function (req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  } else {
    var cart = new Cart(req.session.cart);
    Order.create(req.body.order, function (err, order) {
      if (err) {
        console.log(err);
      } else {
        order.user.id = req.user._id;
        order.cart = cart;
        order.city = req.body.city;
        order.region = req.body.region;
        order.address = req.body.address;
        order.mobilenumber = req.body.mobilenumber;
        order.save(function (err, result) {
          req.flash('success','Successfully bought product!');
          req.session.cart = null;
          res.redirect("/category");
        });
      }
    });
  }
});
module.exports = router;

//////////////////////////////////////////////////////////////////////////
//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  req.flash("error", "Please Login First");
  res.redirect("/login");
}

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
