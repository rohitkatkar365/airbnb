const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.curruser._id)) {
        req.flash("error", "You Don't Have Permission TO Edit");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let listing = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}