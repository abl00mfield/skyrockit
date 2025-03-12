const express = require("express");
const router = express.Router();
//embedded relationship, must refer to parent
const User = require("../models/user.js");

//by the time the application gets to this point, we are already
//at /users/:userId/applicaitons

router.get("/", async (req, res) => {
  try {
    res.render("applications/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
