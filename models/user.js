const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport-local-mongoose");

const userschema = new Schema({
    email :{
        type : String,
        required : true,
    }
});

userschema.plugin(passport);

module.exports = mongoose.model("User",userschema);
