if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const cors = require("cors");

const User = require("./models/user.js");
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
// app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: "_" }));
// Simplified Helmet for API-only (CSP not needed for JSON responses)
app.use(helmet({
  contentSecurityPolicy: false, // Not needed for API-only backend
}));

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true, // Allow cookies/sessions
}));

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = new MongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, // time in seconds
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
// Flash removed - API uses JSON responses

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res.locals setup removed - not needed for API

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "allendiaz.developer@gmail.com",
    username: "allen@dev",
  });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to YelpCamp API" });
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(" page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong! ";
  res.status(statusCode).json({
    error: err.message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
