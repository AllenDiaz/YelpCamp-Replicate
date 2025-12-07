const { campgroundSchema, reviewSchema } = require("./Schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");
const createError = require("http-errors");
const { verifyToken } = require("./utils/jwt");

const isLoggedIn = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Authentication required. Please provide a valid token."));
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(createError(401, "User not found"));
    }
    
    req.user = user;
    next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token"));
  }
};

module.exports = { isLoggedIn };

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
    throw createError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  //validating the schema
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw createError(400, msg);
  } else {
    next();
  }
};
