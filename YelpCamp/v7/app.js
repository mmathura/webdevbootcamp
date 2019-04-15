// express

var express = require("express");
var app = express();
// templating language
app.set("view engine", "ejs");
// external css and js files 
app.use(express.static(__dirname + "/public"));
// console.log(__dirname); // e.g. /home/ubuntu/workspace/YelpCamp/v5

// database models 

// var Campground = require("./models/campground");
// var Comment = require("./models/comment");
var User = require("./models/user");

// body parser configuration

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

// passport configuration 

var passport = require("passport");
var LocalStrategy = require("passport-local");

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware 

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next(); // move on to route handler
});

// seed database

var seedDB = require("./seeds");
seedDB();
console.log("In refactored version v.7!");

// db connection 

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

// routes 

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index"); // Auth routes

// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// schema setup

// campground 

// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });

// users ... // comments ...

// associate mongoose with schema 

// var Campground = mongoose.model("Campground", campgroundSchema);

// create a campground for initial setup and testing

// Campground.create({
//         name:  "Salmon Creek", 
//         image: "https://farm4.staticflickr.com/3241/2984981452_e9008b9280.jpg"
//     }, function(err, campground) {
//         if (err) console.log(err);
//         console.log(campground);
//     });

// Campground.create({
//         name: "Granite Hill", 
//         image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg",
//         description: "This is a huge granite hill! No bathrooms. No water!"    
//     }, function(err, campground) {
//         if (err) console.log(err);
//         console.log(campground);
//     });

// make camp grounds global; later replace with DB
// not persistant 
// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3241/2984981452_e9008b9280.jpg"},
//         {name: "Granite Hill", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg"}
//     ];

// listener

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started!");
    // console.log("Listening on port " + process.env.PORT + " at " + process.env.IP + "...");
});