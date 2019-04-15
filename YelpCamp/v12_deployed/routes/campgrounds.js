var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// campgrounds routes

// index route - list/show all campgrounds
// /campgrounds
router.get("/", function(req, res) { // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err || !allCampgrounds) { 
            // console.log(err); // show message to a user
            req.flash("error", "Campgrounds not found");
            res.redirect("/campgrounds");
        } // then render file
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
    });
});

// add new campground from form
// create route - same as index route but adds new campground to db
// /campgrounds
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    var newCampground = {name: name, image: image, price: price, description: desc, author: author};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err || !newlyCreated) { 
            // console.log(err); 
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        } // send user back to form to re-enter data
        res.redirect("/campgrounds");
    });
});

// create a new campgroud - form 
// new route - shows the form to create new campground
// /campgrounds/new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// show route - one item in the database
// /url/:id - shows more info about one campground 
// /campgrounds/:id
router.get("/:id", function(req, res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err || !foundCampground) { 
            // console.log(err); 
            req.flash("error", "Campground not found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", {campground: foundCampground});
    }); // render template with that campground 
});

// edit campground route
// campgrounds/:id/edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) { // otherwise redirect
            // console.log(err); 
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds"); 
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// update campground route 
// campgrounds/:id
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  // find and update correct campground 
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
    function(err, updatedCampground){
        if (err || !updatedCampground) {
            // console.log(err);
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds"); 
        } // redirect - show page
        res.redirect("/campgrounds/" + req.params.id);
  });
});

// destroy campground route 
// campgrounds/:id
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            // console.log(err);           
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

module.exports = router;