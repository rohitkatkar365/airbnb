const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//Mongodb URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//return promise
main().then(()=>{
    console.log("Connect Successfully");
}).catch((err=>{
    console.log(err);
}));

//Connect with mongodb
async function main()
{
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"6616244e3bae831c8b0633ed"}));
    await Listing.insertMany(initData.data);
}

initDB();