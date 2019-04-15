var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// campgrounds routes

// index route - list/show all campgrounds
// /campgrounds
router.get("/", function(req, res) {
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
// /campgrounds
router.post("/", function(req, res) {
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
// /campgrounds/new
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

// show route - one item in the database
// /url/:id
// shows more info about one campground 
// /campgrounds/:id
router.get("/:id", function(req, res){
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

module.exports = router;