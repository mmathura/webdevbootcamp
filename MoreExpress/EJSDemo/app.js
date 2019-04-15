var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    // res.send("<h1>Welcome to the home page!</h1>");
    // res.render("home.ejs");
    res.render("home");
});

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing; 
    // res.send("You fell in love with " + thing);
    // res.render("love.ejs", {thingVar: thing});
    res.render("love", {thingVar: thing});
});

app.get("/posts", function(req, res) {
   var posts = [
       {title: "title 1", author: "author 1"},
       {title: "title 1", author: "author 1"}, 
       {title: "title 1", author: "author 1"}
   ];
   // res.render("posts.ejs", {posts: posts});
   res.render("posts", {posts: posts});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Listening for requests.");
});