var express = require("express");
var app = express();

app.set("view engine", "ejs");

// home page - root route 

app.get("/", function(req, res) {
    res.render("home");
});

// about page - route 

app.get("/about", function(req, res) {
    res.render("about");
});

// listener 

app.listen(process.env.PORT, process.env.IP, function(){
    // console.log("Server is waiting for a request.");
});