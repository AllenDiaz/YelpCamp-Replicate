const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = async (req, res) => {
  res.render("auth/register");
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("auth/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back ");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      next(err);
    }
    req.flash("success", "You succesfully logout");
    res.redirect("/login");
  });
};
