var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo_2", { useNewUrlParser: true });

var Post = require("./models/post");
var User = require("./models/user");

// post model - title and content 

// var postSchema = new mongoose.Schema({
//     title: String,
//     content: String
// });

// var Post = mongoose.model("Post", postSchema);

// user model - email and name

// var userSchema = new mongoose.Schema({
//     email: String,
//     name: String,
//     // posts: [postSchema]
//     posts: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Post"
//     }]
// });

// var User = mongoose.model("User", userSchema);

// seed user collection

// User.create({
//     email: "bob@gmail.com",
//     name: "Bob Belcher"
// });

// add post to user

// Post.create({
//     title: "How to cook the best burger pt. 3",
//     content: "Blah blah blah pt. 3"
// }, function(err, post) {
//     if(err) console.log(err);
//     console.log(post);
//     User.findOne({email:"bob@gmail.com"}, function(err, user){
//       if (err) console.log(err);
//       console.log(user);
//       user.posts.push(post);
//       user.save(function(err, post){
//           if (err) console.log(err);
//           console.log(post);
//       });
//     });
// });

// find user 

User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user) {
    if (err) console.log(err);
    // find all posts for that user
    console.log(user);
});





