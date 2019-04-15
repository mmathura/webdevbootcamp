var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Home or root route

// landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// Auth routes 

// show register form - signup 
router.get("/register", function(req, res) {
   res.render("register"); 
});

// handle sign up form logic 
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err || !user) { // check username is not undefined
            // console.log(err); 
            req.flash("error", err.message); // use err in view
            return res.redirect("back"); // sign-up form 
        } 
        // return newly created user
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form 
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login form logic 
router.post("/login", 
    passport.authenticate("local", { 
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
}), function(req, res){
});

// handle logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

module.exports = router;