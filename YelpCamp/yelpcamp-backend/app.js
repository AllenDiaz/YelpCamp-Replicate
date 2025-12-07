if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const sanitizeV5 = require("./utils/mongoSanitizeV5.js");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
console.log("add");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.set("query parser", "extended");

// EJS view engine removed - API only

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Static file serving removed - Next.js frontend handles all static assets
app.use(sanitizeV5({ replaceWith: "_" }));
// Simplified Helmet for API-only (CSP not needed for JSON responses)
app.use(helmet({
  contentSecurityPolicy: false, // Not needed for API-only backend
}));

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true, // Allow cookies for potential future use
}));

// Session and Passport removed - using JWT authentication

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to YelpCamp API" });
});

app.all(/(.*)/, (req, res, next) => {
  next(createError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Oh No, Something Went Wrong!";
  res.status(statusCode).json({
    error: message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
