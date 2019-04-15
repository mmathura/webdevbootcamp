var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo", { useNewUrlParser: true });

// post model - title and content 

var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

// user model - email and name

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema]
});

// var userSchema = new mongoose.Schema({
//     email: String,
//     name: String,
// });

// var Post = mongoose.model("Post", postSchema);
var User = mongoose.model("User", userSchema);

// var newUser = new User({
//     email: "charlie@brown.edu",
//     name: "Charlie Brown"
// });

// newUser.save(function(err, user){
//     if(err) console.log(err);
//     console.log(user);
// });

// var newPost = new Post({
//     title: "Reflections on Apples",
//     content: "They are delicious!"
// });

// newPost.save(function(err, post){
//     if(err) console.log(err);
//     console.log(post);
// });

// var newUser = new User({
//     email: "hermieone@hogwarts.edu",
//     name: "Hermieone Granger"
// });

// newUser.posts.push({
//     title: "How to brew poly juice potion",
//     content: "Just kidding, go to potions class!"
// });

// newUser.save(function(err, user){
//     if(err) console.log(err);
//     console.log(user);
// });

// User.find({name: "Hermieone Granger"}, function(err, user) {
//     if(err) { 
//         console.log(err); 
//     }
//     else {
//         console.log(user);
//         user.posts.push({
//             title: "3 things I really hate",
//             content: "Voldemort Voldemort Voldemort"
//         });
//         user.save(function(err, user){
//             if(err) console.log(err);
//             console.log(user);
//         });
//     }
// });


