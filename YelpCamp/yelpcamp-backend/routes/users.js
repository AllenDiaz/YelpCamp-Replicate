const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware.js");
const users = require("../controllers/users");

// Auth routes
router.post("/register", catchAsync(users.register));
router.post("/login", catchAsync(users.login));
router.post("/logout", users.logout);

// Get current user (protected route)
router.get("/me", isLoggedIn, catchAsync(users.getCurrentUser));

module.exports = router;
