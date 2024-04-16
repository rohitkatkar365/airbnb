const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createpost = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroypost = async(req,res)=>{
    let{id,reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted");
    res.redirect(`/listing/${id}`);
};