const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const createError = require("http-errors");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(createError(400, "Username or email already exists"));
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  } catch (e) {
    next(createError(400, e.message));
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return next(createError(401, "Invalid username or password"));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid username or password"));
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (e) {
    next(createError(500, e.message));
  }
};

module.exports.logout = async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ 
    message: "Successfully logged out. Please remove the token from client storage." 
  });
};

module.exports.getCurrentUser = async (req, res) => {
  // Return current authenticated user (set by auth middleware)
  res.json({
    user: req.user,
  });
};
