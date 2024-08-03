const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isloggedin, async (req, res) => {
  let products = await productModel.find();
  res.render("shop", { products });
});

router.get("/cart", isloggedin, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  // console.log(user.cart);

  res.render("cart", { user });
});

router.get("/addtocart/:productid", isloggedin, async (req, res) => {
  console.log(req.user);
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/logout", isloggedin, (req, res) => {
  try {
    res.clearCookie("token");
    console.log("token removed");
    res.redirect("/");
  } catch (err) {
    console.error("Error in logout:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
