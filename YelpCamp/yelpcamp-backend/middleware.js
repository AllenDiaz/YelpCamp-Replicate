const session = require("express-session");
const { campgroundSchema, reviewSchema } = require("./Schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.status(401).json({ 
      error: "You must be signed in",
      message: "Authentication required" 
    });
  }
  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports = { isLoggedIn, storeReturnTo };

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    return res.status(403).json({ 
      error: "Permission denied",
      message: "You are not authorized to perform this action" 
    });
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    return res.status(403).json({ 
      error: "Permission denied",
      message: "You are not authorized to perform this action" 
    });
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  //validating the schema
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  //validating the schema
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
