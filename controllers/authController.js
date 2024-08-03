const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/user-model");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !fullname) {
      console.log("Missing required fields");
      req.flash("error", "Please fill in all required fields.");
      return res.redirect("/");
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
      console.log("You have already have an account");
      req.flash("error", "You already have an account , Please login");
      return res.redirect("/");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          console.log("User created");
          req.flash("success", "User created successfully.");
          res.redirect("/");
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email or password incorrect");
      return res.redirect("/");
    }

    await bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        console.log("they got token");
        res.redirect("/shop");
      } else {
        req.flash("error", "Email or Password incorrect");
        res.redirect("/");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.logout = (req, res) => {};
