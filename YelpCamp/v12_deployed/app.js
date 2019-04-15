// express

var express = require("express");
var app = express();
// connect flash
var flash = require("connect-flash");
app.use(flash());
// templating language
app.set("view engine", "ejs");
// external css and js files 
app.use(express.static(__dirname + "/public"));

// database model 

var User = require("./models/user");

// body parser configuration

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

// moment 

app.locals.moment = require("moment");

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

// method override

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// middleware 

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // move on to route handler
}); // is in -- middleware/index.js

// seed database

// var seedDB = require("./seeds");
// seedDB();
// console.log("In version v.12_deployed.");

// db connection 

var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true });

// routes 

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index"); // Auth routes

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// listener

app.listen(process.env.PORT, process.env.IP, function() {
    // console.log("The YelpCamp server has started!");
});