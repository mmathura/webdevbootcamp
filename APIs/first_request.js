// an API request in JavaScript

// var request = require("request");

// request("http://www.google.com", function(err, res, body) {
//     if (!err && res.statusCode === 200) {
//         console.log(body);
//     }
// });

var request = require("request");

console.log("Sunset in Hawaii is at ... ");

request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(err, res, body) {
    if (!err && res.statusCode === 200) {
        // console.log(body);
        // console.log(body["query"]);
        var parsedData = JSON.parse(body);
        console.log(parsedData["query"]["results"]["channel"]["astronomy"]["sunset"]);
    }
});