const express = require("express");
const router = express.Router();
//embedded relationship, must refer to parent
const User = require("../models/user.js");

//by the time the application gets to this point, we are already
//at /users/:userId/applicaitons

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("applications/index.ejs", {
      applications: currentUser.applications,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  res.render("applications/new.ejs");
});

//post /users/:userId/applications/new
router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.push(req.body);
    await currentUser.save();
    res.redirect("/users/${currentUser._id}/applications");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
