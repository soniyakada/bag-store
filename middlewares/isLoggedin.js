const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "you need to login first ");
    console.log("not have token");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    console.log("they have token");
    console.log(decoded);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  } catch (err) {
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
  ``;
};
