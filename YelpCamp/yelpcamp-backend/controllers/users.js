const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = async (req, res) => {
  res.json({ message: "Render register page (frontend should handle UI)" });
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: "User registered and logged in",
        user: registeredUser,
      });
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports.renderLogin = (req, res) => {
  res.json({ message: "Render login page (frontend should handle UI)" });
};

module.exports.login = async (req, res) => {
  res.json({
    message: "Login successful",
    user: req.user,
  });
};

module.exports.logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Successfully logged out" });
  });
};
