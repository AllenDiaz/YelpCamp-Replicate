const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.status(201).json({
    message: "Created a new review",
    review,
    campgroundId: campground.id,
  });
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({
    message: "Successfully deleted review",
    campgroundId: id,
  });
};
