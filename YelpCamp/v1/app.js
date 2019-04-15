var express = require("express");
var app = express();
var bodyparser = require("body-parser");

// make camp grounds global; later replace with DB
// not persistant 
var campgrounds = [
        {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3241/2984981452_e9008b9280.jpg"},
        {name: "Granite Hill", image: "https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg"}
    ];

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({extended: true}));

// landing page

app.get("/", function(req, res) {
    // res.send("Welcome to YelpCamp!");
    res.render("landing");
});

// camp grounds 

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

// add new camp ground from form

app.post("/campgrounds", function(req, res) {
    // res.send("You're at post route campgrounds.");
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds
    res.redirect("/campgrounds");
});
// route differs b/c one is a post request 
// follows REST convention

// create a new camp groud form 

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// listener 

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started!");
    console.log("Listening on port " + process.env.PORT + " at " + process.env.IP + "...");
});