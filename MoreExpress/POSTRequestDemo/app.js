var express = require("express");
var app = express();
var bodyparser = require("body-parser");

var friends = ["friend 1", "friend 2"];

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    // res.send("This is from home");
    res.render("home.ejs");
});

app.get("/friends", function(req, res) {
    // res.send("This is from home");
    res.render("friends.ejs", {friends: friends});
});

app.post("/addfriend", function(req, res){
    // console.log(req.body.newfriend);
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("/friends");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is listening for requests.");
});

