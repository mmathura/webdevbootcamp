var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// home or root route

// landing page
router.get("/", function(req, res) {
    // res.send("Welcome to YelpCamp!");
    res.render("landing");
});

// Auth routes 

// show register form - signup 
router.get("/register", function(req, res) {
   res.render("register"); 
});

// handle sign up form logic 
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login form logic 
// route, middleware, callback, next
router.post("/login", 
    passport.authenticate("local", { 
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
}), function(req, res){
    // res.send("Logging into to YelpCamp...");
});

// handle logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// middleware 

// function isLoggedIn(req, res, next){
//     if (req.isAuthenticated()) {
//         return next(); // render new campground or comment form 
//     }
//     res.redirect("/login");
// }

module.exports = router;