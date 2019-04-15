// middleware 

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// for campground

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) { // if user is logged in
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                // console.log(err); 
                req.flash("error", "Campground not found");
                return res.redirect("back"); 
            } 
            // check does user own campground; compare mongoose Obj to Str
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

// for comment

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) { // if user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                // console.log(err); 
                req.flash("error", "Comment not found");  
                return res.redirect("back"); 
            }
            // check does usr own comment; compare mongoose Obj to Str
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

// for login 

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // render new campground or comment form 
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;