var mongoose = require("mongoose");

// user model - email and name

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    // posts: [postSchema]
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

// var User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);