const express = require("express");
const router = express.Router();
//embedded relationship, must refer to parent
const User = require("../models/user.js");
const req = require("express/lib/request.js");

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

router.get("/:applicationId", async (req, res) => {
  try {
    //look up user
    const currentUser = await User.findById(req.session.user._id);
    //find the subdocument in the currently logged in user's applications list
    const application = await currentUser.applications.id(
      req.params.applicationId
    );
    //render a show template with the subdocument details
    res.render("applications/show.ejs", {
      application, //property shorthand syntax - we don't have to say application:application
      //property name and variable name that are the same, you only have to put the name once
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:applicationId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.id(req.params.applicationId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/applicationId/edit", async(req, res));

module.exports = router;
