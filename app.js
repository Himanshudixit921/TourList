if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const reviewRouter = require("./router/reviewsroute");
const userRouter = require("./router/usersroute");
const maketourList = require("./router/maketourlistroute");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const db_url = process.env.DB_URL;

mongoose
  // mongodb://127.0.0.1:27017/tour-list
  .connect(db_url)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
const store = MongoStore.create({
  mongoUrl: db_url,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "Secret!!",
  },
});
store.on("error", function (e) {
  console.log("Session ", e);
});
const sessionConf = {
  store: store,
  name: "session",
  secret: "password",
  resave: "false",
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConf));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.engine("ejs", ejsMate);
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.get("/", (req, res) => {
  res.render("home");
});
app.use("/", userRouter);
app.use("/maketourList", maketourList);

app.use("/maketourList/:id/reviews", reviewRouter);
app.use((err, req, res, next) => {
  const { message = "Something Went Wrong!!", statusCode = 500 } = err;
  console.log(err);
  res.status(statusCode).render("error", { err });
});
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("connected");
});
