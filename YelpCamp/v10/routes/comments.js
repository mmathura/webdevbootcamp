var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// comments routes 

// new - campgrounds/:id/comments/new get
// /campgrounds/:id/comments/new
router.get("/new", isLoggedIn, function(req, res){
    // res.send("This will be the comment form.");
    // find campcround by id
    // console.log(req.params.id);
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) console.log(err);
        res.render("comments/new", {campground: foundCampground});
    });
    // res.render("comments/new");
});

// create - campgrounds/:id/comments post
// Can't add a comment unless your signed in.
// /campgrounds/:id/comments
router.post("/", isLoggedIn, function(req, res){
    // res.send("This will show the comments.");
    // lookup campground with ID
    Campground.findById(req.params.id, function(err, foundCampground) {
       if (err) { console.log(err); res.redirect("/campgrounds"); }
       // console.log(req.body.comment); 
       // { text: 'This is a comment', author: 'Homer S.' }
       // create a new comment
      Comment.create(req.body.comment, function(err, comment){
          if(err) console.log(err);
          // console.log(req.user.username);
          // add username and id to campground
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment 
          comment.save(function(err){
             if(err) console.log(err); 
          });
          // console.log(comment);
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

// edit comment 
// /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    // res.send("Edit route for comments");
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
    });
});

// update comment - from edit comment form 
// /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
    // res.send("Updating comment.");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
        function(err, updatedComment){
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            res.redirect("/campgrounds/" + req.params.id);
    });
});

// delete comments - comment destroy route
// /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    // res.send("Trying to delete a comment");
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// middleware

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        // if user is logged in
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) { // otherwise redirect
                console.log(err); 
                res.redirect("back"); 
            }
            // check does the user own the comment
            // compare mongoose object to String
            if (foundComment.author.id.equals(req.user._id))
                next(); // edit, delete ...
            else
                res.redirect("back");
        });
    } else { // if not logged in, redirect
       res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next(); // render new campground or comment form 
    }
    res.redirect("/login");
}

// middleware will be moved to its own file

module.exports = router;