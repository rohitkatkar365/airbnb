const Listing = require("../models/listing");
const { listingschema } = require("../schema");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listing/new.ejs");
};

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        res.redirect("/listing")
    }
    res.render("./listing/show.ejs", { listing});
};

module.exports.createlisting = async (req, res, next) => {
    // let result = listingschema.validate(req.body);
    // if (result.error) {
    //     throw new ExpressError(400, result.error);
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success", "New Listing Is Created");
    res.redirect("/listing");
};

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await  listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroylisting = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "New Listing Is Deleted");
    res.redirect("/listing");
};