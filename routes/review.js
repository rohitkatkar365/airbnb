const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserr.js");
const {reviewschema} = require("../schema.js");
const {isLoggedin,isAuthor} = require("../middleware.js");
const reviewcontroller = require("../Controller/Review.js");

const validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else {
        next();
    }
}

//Review
router.route("/")
.post(isLoggedin,validatereview,wrapAsync(reviewcontroller.createpost));

//Delete Review ROute
router.route("/:reviewid")
.delete(isLoggedin,isAuthor,wrapAsync(reviewcontroller.destroypost));

module.exports = router;