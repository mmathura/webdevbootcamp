var express = require("express");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");

var app = express();
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Rust is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));

// routes 

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

app.get("/", function(req, res){
    res.render("home");
});

// Auth routes 

// show signup form 

app.get("/register", function(req, res){
    res.render("register");
});

// hendeling user signup 

app.post("/register", function(req, res){
    // res.send("Register post route.");
    // salt and hash 
    User.register(
        new User({username: req.body.username}), 
        req.body.password, 
        function(err, user) {
            if (err) { 
                console.log(err);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        });
});

// login routes 

// render login form 

app.get("/login", function(req, res) {
   res.render("login"); 
});

// login logic 
// middleware -- code executed between route and handler 
app.post("/login", passport.authenticate("local", {
   successRedirect: "/secret",
   failureRedirect: "/login"
}), function(req, res) {
});

// logout route

app.get("/logout", function(req, res) {
   // res.send("You have logged out!"); 
   req.logout();
   res.redirect("/");
});

// middleware

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening for a request...");
});