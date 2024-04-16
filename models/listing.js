// Import module
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
//schema define
let listingSchema = new schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
    //     type : String,
    //     //if image is not defined
    //     default : "https://unsplash.com/photos/a-mountain-range-with-a-trail-leading-to-it-cjy8GKROLRY",
    //     //check for image link
    //     set: (v) => v === "" ? "https://unsplash.com/photos/a-mountain-range-with-a-trail-leading-to-it-cjy8GKROLRY" : v,
        url : String,
        filename : String,
        
},
    price :{
        type : Number,
    },
    location :{
        type : String,
    },
    country :{
        type : String,
    },
    reviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
    }],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in:listing.reviews}});
    }
});

//Create model
const Listing = mongoose.model("Listing",listingSchema);

//export for use in other application
module.exports = Listing;