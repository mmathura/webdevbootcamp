// middleware 

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) { // if user is logged in
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err && !foundCampground) { // otherwise redirect
                // console.log(err); 
                req.flash("error", "Campground not found");
                res.redirect("back"); 
            } 
            // check does the user own the campground 
            // compare mongoose Object to String
            if (foundCampground.author.id.equals(req.user._id))
                next(); // edit, delete ...
            else {
                req.flash("error", "You do not have permission to do that");  
                res.redirect("back");
            }
        });
    } else { // if not logged in, redirect
       req.flash("error", "You need to be logged in to do that");    
       res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) { // if user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err && !foundComment) { // otherwise redirect
                // console.log(err); 
                req.flash("error", "Comment not found");  
                res.redirect("back"); 
            }
            // check does the user own the comment
            // compare mongoose Object to String
            if (foundComment.author.id.equals(req.user._id))
                next(); // edit, delete ...
            else {
                req.flash("error", "You do not have permission to do that");  
                res.redirect("back");
            }
        });
    } else { // if not logged in, redirect
       req.flash("error", "You need to be logged in to do that");  
       res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // render new campground or comment form 
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

// other ways to define the Object
// in middlewareObj = { ... } etc.

module.exports = middlewareObj;