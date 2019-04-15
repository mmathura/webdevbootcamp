// var mongoose = require("mongoose");
var Campground  = require("./models/campground");
var Comment  = require("./models/comment");

var data = [
        {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3241/2984981452_e9008b9280.jpg", description: "blah blah Blah"},
        {name: "Granite Hill", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg", description: "blah blah Blah"},
        {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg", description: "blah blah Blah"},
        {name: "Cloud's Rest", image: "https://farm6.staticflickr.com/5098/5496185186_d7d7fed22a.jpg", description: "blah blah Blah"},
        {name: "Desert Mesa", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f1c278a5ebb6b1_340.jpg", description: "blah blah Blah"},
        {name: "Canyon Floor", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144594f3c07ba1eebc_340.jpg", description: "blah blah Blah"}
    ];

function seedDB() {
    // remove all campgrounds
    // Campground.remove({}, function(err){
    Campground.deleteMany({}, function(err) {
      // Use deleteOne, deleteMany, or bulkWrite instead.
      if (err) console.log(err);
      console.log("Campgrounds removed from database.");
      // add a few campgrounds 
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if (err) console.log(err); 
            console.log("Added campground.");
            // console.log(campground);
            // create a comment on a campground
            Comment.create({
                    text: "This place is great, but I wish it had Internet",
                    author: "Homer"
                }, 
                function(err, comment){
                    if(err) console.log(err);
                    console.log("Created new comment.");
                    campground.comments.push(comment);
                    campground.save(function(err){
                        if(err) console.log(err);
                    });
                });
        }); 
      });
    });
    
    // add a few comments 
}

module.exports = seedDB;