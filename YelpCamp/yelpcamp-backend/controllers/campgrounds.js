const Campground = require("../models/campground.js");
const { cloudinary } = require("../cloudinary/index.js");
const fetch = require("node-fetch");

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
maptilerClient.config.fetch = fetch;

module.exports.index = async (req, res) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campgrounds = await Campground.find({});
  console.log(process.env.MAPTILER_API_KEY);  
  res.json({ campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.json({ message: "Render new campground form (frontend should handle UI)" });
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;

  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  res.status(201).json({
    message: "Successfully made a new campground!",
    campground,
  });
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  // const review = Review.find({});

  if (!campground) {
    return res.status(404).json({ error: "Cannot find the campground" });
  }
  res.json({ campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    return res.status(404).json({ error: "Cannot find the campground" });
  }
  res.json({ campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  await campground.save();
  res.json({
    message: "Successfully updated campground!",
    campground,
  });
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.json({ message: "Successfully deleted the campground" });
};
