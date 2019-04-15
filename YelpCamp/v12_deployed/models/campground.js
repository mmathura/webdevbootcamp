var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    createdAt: { 
        type: Date, 
        default: Date.now()
    },
    author: {
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// var Campground = mongoose.model("Campground", campgroundSchema);
// module.exports = Campground; // below combines these two lines.

module.exports = mongoose.model("Campground", campgroundSchema);