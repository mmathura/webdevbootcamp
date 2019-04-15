var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

// connection to db

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });

// app config 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); // placed after body parser
app.use(methodOverride("_method"));

// mongoose modle/schema config

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1540652617484-913cb0b00891?ixlib=rb-0.3.5&s=0b90feb696be41432e865cad2027c658&auto=format&fit=crop&w=391&q=80",
//     body: "Hello, this is a test blog post!"
// }, function(err, blog){
//     if (err) console.log(err);
//     console.log(blog);
// });

// RESTful routes 

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// index

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
        if (err) console.log(err);
        res.render("index", { blogs: blogs });
    });
    // res.render("index");
});

// new - /blogs/new shows a form 

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// create

app.post("/blogs", function(req, res){
    // create blog post
    // console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) res.render("new");
        // redirect to index
        res.redirect("/blogs");
    });
});

// show - blogs/:id

app.get("/blogs/:id", function(req, res){
    // res.send("Show page");
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) res.redirect("/blogs"); // index page
        res.render("show", {blog: foundBlog});
    });
});

// edit - /blogs/:id/edit

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) res.redirect("/blogs");
        res.render("edit", {blog: foundBlog});
    });
    // res.render("edit");
});

// update - /blogs/:id

app.put("/blogs/:id", function(req, res){
    // res.send("Update route");
    // Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
    // middleware - running line twice on 2 routes
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) res.redirect("/blogs");
        res.redirect("/blogs/" + req.params.id);
    });
});

// destroy - /blogs/:id 

app.delete("/blogs/:id", function(req, res){
    // res.send("Destroy route.");
    // destroy blog post 
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) res.redirecct("/blogs");
    });
    // redirect 
    res.redirect("/blogs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Blog app is listening for requests.");
});
