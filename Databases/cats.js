var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/cat_app', {useNewUrlParser: true});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//     name: "George",
//     age: 11,
//     temperament: "Grouchy"
// });

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

// george.save(function(err, cat){
//     if (err) {
//         console.log("Something went wrong.");
//         console.log(err);
//     } else {
//         console.log("A cat was added to the database.");
//         console.log(cat);
//     }
// });

// Cat.create({
//     name: "Snow White", 
//     age: 15, 
//     temperament: "Bland"
// }, function(err,cat) {
//     if (err) {
//         console.log("Cat was not added to the database");
//         console.log(err);
//     }
//     else {
//         console.log("Cast was added to the database");
//         console.log(cat);
//     }
// });

Cat.find({}, function(err, cats) {
    if (err) {
        console.log("Could not find cat.");
        console.log(err);
    }
    else {
        console.log("All cats in the database.");
        console.log(cats);
    }
});

