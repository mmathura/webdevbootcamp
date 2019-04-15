var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");

app.get("/", function(req, res){
    // res.send("<h1>Movie Database API Demo</h1>");
    res.render("search");
});

app.get("/results", function(req, res){
    // API call goes here
    // res.send("Hello, from results, it worked!");
    // http://www.omdbapi.com/?s=guardians+of+the+galaxy&apikey=thewdb 
    // http://www.omdbapi.com/?i=tt3896198&apikey=thewdb 
    // &apikey=thewdb
    // http://www.omdbapi.com/?s=california&apikey=thewdb
    // console.log(req.query.search);
    var search = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + search + "&apikey=thewdb";
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // res.send(body);
            var data = JSON.parse(body);
            // res.send(results["Search"][0]["Title"]);
            res.render("results", {data: data});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening for requests.");
});