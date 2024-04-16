// Import modules
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/Expresserr.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localstatergy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");
const multer = require("multer");

//Mongodb URL
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLAS;

//return promise
main().then(() => {
    console.log("Connect Successfully");
}).catch((err => {
    console.log(err);
}));

//Connect with mongodb
async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({mongoUrl : dburl,crypto:{secret:process.env.SECRET,},touchAfter : 24 * 3600});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOption = {store,secret : process.env.SECRET,resave:false,saveUnintalize:true,
cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
} ,
};

//Handling of get request
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

//edit route
app.get("/listing/:id/edit", wrapAsync((async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
})));

app.use("/listing",listingRoute);
app.use("/listing/:id/reviews",reviewRoute);
app.use("/",userRoute);
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong" } = err;
    // res.status(statuscode).send(message);
    res.render("error.ejs", { err });
});

//start server
app.listen(8080, () => {
    console.log("Listening Port : 8080");
});