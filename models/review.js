const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reveiewschema = new Schema({
    comment : String,
    rating :{
        type :Number,
        min : 1,
        max : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    author : {
        type: schema.Types.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model("Review",reveiewschema);