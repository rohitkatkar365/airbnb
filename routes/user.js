const express = require("express");
const router = express.Router();
// const User = require("../models/user");
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usercontroller = require("../Controller/User");


router.route("/signup")
.get(usercontroller.rendersignupform)
.post(wrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.rederloginform)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), usercontroller.login);

// router.get("/signup", usercontroller.rendersignupform);

// router.post("/signup", wrapAsync(usercontroller.signup));

// router.get("/login", usercontroller.rederloginform);

// router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), usercontroller.login);

router.get("/logout", usercontroller.logout);

module.exports = router;

