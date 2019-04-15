// express

var express = require("express");
var app = express();
// templating language
app.set("view engine", "ejs");
// external css and js files 
app.use(express.static(__dirname + "/public"));
// console.log(__dirname); // e.g. /home/ubuntu/workspace/YelpCamp/v5

// database models 

var Campground = require("./models/campground");
var Comment = require("./models/comment");
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

// db connection 

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

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

// home route

// landing page
app.get("/", function(req, res) {
    // res.send("Welcome to YelpCamp!");
    res.render("landing");
});

// campgrounds routes

// index route - list/show all campgrounds 
app.get("/campgrounds", function(req, res) {
    // get all campgrounds from db then render file
    // req.user -- info about the User object
    // undefined vs. { _id: ... , username: '... ', __v: 0 }
    // console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if (err) console.log(err);
        // show message to a user
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
        // res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// add new campground from form
// create route - same as index route 
// but adds new campground to db
app.post("/campgrounds", function(req, res) {
    // res.send("You're at post route campgrounds.");
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description; 
    var newCampground = {name: name, image: image, description: desc};
    // var newCampground = {name: name, image: image};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) console.log(err);
        // print message to the user; cant be blank 
        // send user back to form to reenter data
        res.redirect("/campgrounds");
    });
    // campgrounds.push(newCampground);
    // redirect back to campgrounds
    // res.redirect("/campgrounds");
});
// route differs b/c one is a post request 
// follows REST convention --
// useful pattern for interacting with APIs

// create a new campgroud form 
// new route - shows the form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// show route - one item in the database
// /url/:id
// shows more info about one campground 
app.get("/campgrounds/:id", function(req, res){
    // find campground with provided id
    // Campground.findById(id, callback)
    // Campground.findById(req.params.id, function(err, foundCampground) {
    //     if (err) console.log(err);
    //     res.render("show", {campground: foundCampground});
    // });
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) console.log(err);
        res.render("campgrounds/show", {campground: foundCampground});
    });
    // render template with that campground 
    // res.render("show");
    // res.send("This will be the show page!");
});

// comments routes 

// new - campgrounds/:id/comments/new get
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // res.send("This will be the comment form.");
    // find campcround by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        res.render("comments/new", {campground: foundCampground});
    });
    // res.render("comments/new");
});

// create - campgrounds/:id/comments post
// Can't add a comment unless your signed in.
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // res.send("This will show the comments.");
    // lookup campground with ID
    Campground.findById(req.params.id, function(err, foundCampground) {
       if (err) { console.log(err); res.redirect("/campgrounds"); }
       // console.log(req.body.comment); 
      // { text: 'This is a comment', author: 'Homer S.' }
       // create a new comment
      Comment.create(req.body.comment, function(err, comment){
          if(err) console.log(err);
          // connect a new comment with campground
          foundCampground.comments.push(comment);
          // save to database
          foundCampground.save(function(err){
             if(err) console.log(err); 
          });
          // redirect to the campground show page
          res.redirect("/campgrounds/" + foundCampground._id);
      });
    });
});

// Auth routes 

// show register form - signup 
app.get("/register", function(req, res) {
   res.render("register"); 
});

// handle sign up form logic 
app.post("/register", function(req, res) {
    // res.send("Signing you up for YelpCamp!");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err); // use error in view
            // short circuit callback if return 
            return res.render("register"); // sign-up form 
        } 
        // return newly created user
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); // for now 
        });
    });
});

// show login form 
app.get("/login", function(req, res) {
    res.render("login");
});

// handle login form logic 
// route, middleware, callback, next
app.post("/login", 
    passport.authenticate("local", { 
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
}), function(req, res){
    // res.send("Logging into to YelpCamp...");
});

// handle logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// middleware 

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next(); // render new campground or comment form 
    }
    res.redirect("/login");
}

// listener

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started!");
    // console.log("Listening on port " + process.env.PORT + " at " + process.env.IP + "...");
});