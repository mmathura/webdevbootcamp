var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// comments routes 

// new - campgrounds/:id/comments/new get
// /campgrounds/:id/comments/new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) { 
            // console.log(err); 
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        res.render("comments/new", {campground: foundCampground});
    });
});

// create - campgrounds/:id/comments post
// Can't add comment unless signed in.
// /campgrounds/:id/comments
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
       if (err || !foundCampground) { 
           // console.log(err); 
           req.flash("error", "Campground not found");  
           res.redirect("/campgrounds"); 
       }
      // create a new comment
      Comment.create(req.body.comment, function(err, comment){
          if(err || !comment) { 
              // console.log(err); 
              req.flash("error", "Something went wrong");
              req.redirect("back");
          }
          // add username and id to campground
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment 
          comment.save(function(err){
             if(err) { 
                 // console.log(err); 
                 req.flash("error", "Something went wrong");
                 req.redirect("back");
             }
          });
          // connect new comment with campground
          foundCampground.comments.push(comment);
          // save to database
          foundCampground.save(function(err){
             if(err) { 
                 // console.log(err); 
                 req.flash("error", "Something went wrong");
                 req.redirect("back");
             }
          });
          // redirect to the campground's show page
          req.flash("success", "Successfully added a comment");  
          res.redirect("/campgrounds/" + foundCampground._id);
      });
    });
});

// edit comment 
// /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
       if (err || !foundCampground) {
           req.flash("error", "Campground not found");
           return res.redirect("back");
       }
       Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment) {
                // console.log(err);
                req.flash("error", "Comment not found");  
                res.redirect("back");
            }
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        });
    });
});

// update comment - from edit comment form 
// /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
        function(err, updatedComment){
            if (err || !updatedComment) {
                // console.log(err);
                req.flash("error", "Comment not found");  
                res.redirect("back");
            }
            res.redirect("/campgrounds/" + req.params.id);
    });
});

// delete comments - comment destroy route
// /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            // console.log(err);
            req.flash("error", "Comment not found");  
            res.redirect("back");
        }
        req.flash("success", "You deleted a comment");  
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;