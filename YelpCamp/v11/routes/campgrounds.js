var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// campgrounds routes

// index route - list/show all campgrounds
// /campgrounds
router.get("/", function(req, res) {
    // get all campgrounds from db then render file
    // req.user -- info about the User object
    // console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if (err && !allCampgrounds) { 
            // console.log(err); // show message to a user
            req.flash("error", "Campgrounds not found");
        }
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
        // res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// add new campground from form
// create route - same as index route 
// but adds new campground to db
// /campgrounds
router.post("/", middleware.isLoggedIn, function(req, res) {
    // res.send("You're at post route campgrounds.");
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // var newCampground = {name: name, image: image};
    // console.log(req.user);
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err && !newlyCreated) { 
            // console.log(err); 
            req.flash("error", "Something went wrong");
        } 
        // print message to the user; cant be blank 
        // send user back to form to re-enter data
        // console.log(newlyCreated);
        res.redirect("/campgrounds");
    });
    // campgrounds.push(newCampground);
    // redirect back to campgrounds
    // res.redirect("/campgrounds");
});
// route differs b/c one is a post request 
// follows REST convention --
// useful pattern for interacting with APIs

// create a new campgroud - form 
// new route - shows the form to create new campground
// /campgrounds/new
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
        if (err && !foundCampground) { 
            // console.log(err); 
            req.flash("error", "Campground not found");
        }
        res.render("campgrounds/show", {campground: foundCampground});
    });
    // render template with that campground 
    // res.render("show");
    // res.send("This will be the show page!");
});

// edit campground route
// campgrounds/:id/edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err && !foundCampground) { // otherwise redirect
            // console.log(err); 
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds"); 
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// edit campground route
// campgrounds/:id/edit
// router.get("/:id/edit", function(req, res){
//     // res.send("Edit form for campgrounds");
//     // is the user logged in
//     if (req.isAuthenticated()) {
//         // if user is logged in, does user own campground
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err) { // otherwise redirect
//                 console.log(err); 
//                 res.redirect("/campgrounds"); 
//             }
//             // check does the user own the campground 
//             // console.log(foundCampground.author.id, foundCampground.author.username);
//             // mongoose object
//             // console.log(req.user._id, req.user.username); // string
//             if (foundCampground.author.id.equals(req.user._id))
//                 res.render("campgrounds/edit", {campground: foundCampground});
//             else
//                 res.send("You don't have permission to do that.");
//                 // res.render("/campgrounds");
//         });
//     } else {
//       // if not logged in, redirect somewhere
//       // res.send("You need to be logged in to edit campground");
//       res.redirect("/campgrounds");
//     }
// });

// update campground route 
// campgrounds/:id
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  // res.send("Posted from edit form."); 
  // find and update correct campground 
  // findOneAndUpdate
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
    function(err, updatedCampground){
        if (err && !updatedCampground) {
            // console.log(err);
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds"); 
        } 
        // redirect - show page
        res.redirect("/campgrounds/" + req.params.id);
  });
});

// destroy campground route 
// campgrounds/:id
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // res.send("You are trying to delete something!");
    // findOneAndDelete
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);           
            req.flash("error", "Campground not found");  
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

// middleware 

// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()) {
//         return next(); // render new campground or comment form 
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         // if user is logged in
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err) { // otherwise redirect
//                 console.log(err); 
//                 res.redirect("back"); 
//             }
//             // check does the user own the campground 
//             // compare mongoose object to String
//             if (foundCampground.author.id.equals(req.user._id))
//                 next(); // edit, delete ...
//             else
//                 res.redirect("back");
//         });
//     } else { // if not logged in, redirect
//       res.redirect("back");
//     }
// }

module.exports = router;