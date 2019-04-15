var Campground = require("./models/campground");
// var Comment = require("./models/comment");

/* var lorem_ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris \
                  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in  \
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla \
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in \
                  culpa qui officia deserunt mollit anim id est laborum"; */

/* var data = [
    { name: "Salmon Creek", image: "https://farm4.staticflickr.com/3241/2984981452_e9008b9280.jpg", description: lorem_ipsum },
    { name: "Granite Hill", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg", description: lorem_ipsum },
    { name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg", description: lorem_ipsum },
    { name: "Cloud's Rest", image: "https://farm6.staticflickr.com/5098/5496185186_d7d7fed22a.jpg", description: lorem_ipsum },
    { name: "Desert Mesa", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg", description: lorem_ipsum },
    { name: "Canyon Floor", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg", description: lorem_ipsum }
]; */

function seedDB() {
    // remove all campgrounds
    Campground.deleteMany({}, function(err) {
        if (err) console.log(err);
        console.log("Campgrounds removed from database.");
        // add a few campgrounds
        // data.forEach(function(seed) {
        //     Campground.create(seed, function(err, campground) {
        //         if (err) console.log(err);
        //         console.log("Added campground.");
        //         // console.log(campground);
        //         // create a comment on a campground
        //         Comment.create({
        //                 text: "This place is great, but I wish it had Internet",
        //                 author: "Homer"
        //             },
        //             function(err, comment) {
        //                 if (err) console.log(err);
        //                 console.log("Created new comment.");
        //                 campground.comments.push(comment);
        //                 campground.save(function(err) {
        //                     if (err) console.log(err);
        //                 });
        //             });
        //     });
        // });
    });
    // add a few comments 
}

module.exports = seedDB;
