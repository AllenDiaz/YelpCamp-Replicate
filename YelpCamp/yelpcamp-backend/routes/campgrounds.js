const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Campground = require("../models/campground.js");

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// Removed: server-side rendering route for new campground form

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Removed: server-side rendering route for edit campground form

module.exports = router;
