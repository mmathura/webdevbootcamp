var mongoose = require("mongoose");

// post model - title and content 

var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// var Post = mongoose.model("Post", postSchema);
// module.exports = Post;

module.exports = mongoose.model("Post", postSchema);