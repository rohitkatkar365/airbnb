const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserr.js");
const { listingschema } = require("../schema.js");
// const Listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingcontroller = require("../Controller/listing.js");
const multer = require("multer");
const {storage} = require("../Cloudconfig.js");
const upload = multer({ storage});

const validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else {
        next();
    }
}

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedin,upload.single('listing[image]'),wrapAsync(listingcontroller.createlisting));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });
//new route
router.route("/new")
.get(isLoggedin,listingcontroller.renderNewForm);

router.route("/:id") 
.get(wrapAsync(listingcontroller.showlisting))
.put(isLoggedin,isOwner,upload.single('listing[image]'), validatelisting, wrapAsync(listingcontroller.updatelisting))
.delete(isLoggedin,isOwner, wrapAsync(listingcontroller.destroylisting));

//Listing Route
// router.get("/", wrapAsync(listingcontroller.index));

//show route
// router.get("/:id", isLoggedin,wrapAsync(listingcontroller.showlisting));

//Update Route
// router.put("/:id", isLoggedin,isOwner, validatelisting, wrapAsync(listingcontroller.updatelisting));

//create route
// router.post("/", validatelisting, wrapAsync(listingcontroller.createlisting));

//Delete Route
// router.delete("/:id", isLoggedin,isOwner, wrapAsync(listingcontroller.destroylisting));

module.exports = router;