const mongoose = require("mongoose");
const path = require("path");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("./../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 30);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = await new Campground({
      author: "6836a58c4b5379c67da5a5b4",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur necessitatibus praesentium nulla ipsum? Perferendis asperiores consequuntur provident maxime minus, sit id magnam assumenda vitae, beatae totam possimus harum eum! Velit?",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/drwljefif/image/upload/v1749540264/YelpCamp/tvzhj81qhqgu8fsiwphc.jpg",
          filename: "YelpCamp/tvzhj81qhqgu8fsiwphc",
        },
        {
          url: "https://res.cloudinary.com/drwljefif/image/upload/v1749540264/YelpCamp/sfayu47nlkjhvbgsffym.jpg",
          filename: "YelpCamp/sfayu47nlkjhvbgsffym",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
