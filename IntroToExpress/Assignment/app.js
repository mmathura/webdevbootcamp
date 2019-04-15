// console.log("From app.js!");

var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hi there, welcome to my assignment!");
});

app.get("/speak/:animal", function(req, res) {
    // console.log(req.params.animal);
    if (req.params.animal === "dog")
        res.send("The " + req.params.animal + " says, \'Woof Woof!\'");
    else if (req.params.animal === "cow")
        res.send("The " + req.params.animal + " says, \'Moo\'");
    else if (req.params.animal === "pig")
        res.send("The " + req.params.animal + " says, \'Oink\'");
});

app.get("/repeat/:string/:number", function(req, res) {
    // console.log(req.params.string, req.params.number);
    var temp = "";
    for (var i = 0; i < parseInt(req.params.number, 10); i++) {
        temp += req.params.string;
        temp += " ";
    }
    res.send(temp);
});

app.get("*", function(req, res) {
    res.send("Sorry, page not found ... what are you doing with your life!");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is listening for a request");
});