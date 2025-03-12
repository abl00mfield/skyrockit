const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const authController = require("./controllers/auth.js");
const applicationsController = require("./controllers/applications.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//depends on session being used, so must be placed after app.use
app.use(passUserToView); //pass user to view middleware

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", authController);

//user must be signed it before you can check to see if they are signed in
app.use(isSignedIn);
app.use("/users/:userId/applications", applicationsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
