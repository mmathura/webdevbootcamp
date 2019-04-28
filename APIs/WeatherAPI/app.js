/* {
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
} */

// const request = require("request");
// var -> const
// function(err, res, body)
// request("https://jsonplaceholder.typicode.com/users/1", (err, res, body) => {
//     // eval(require('locus'))
//     if (!err && res.statusCode === 200) {
//         // console.log(body);
//         const parsedData = JSON.parse(body);
//         // console.log(parsedData.name + ", " + parsedData.address.city);
//         console.log(`${parsedData.name} ${parsedData.address.city}`);
//     }
// });
const rp = require("request-promise");
rp("https://jsonplaceholder.typicode.com/users/1")
  .then(function(body) {
    // console.log(body);
    const parsedData = JSON.parse(body);
    console.log(`${parsedData.name} ${parsedData.address.city}`);
  })
  .catch(function(error) {
    console.log(error);
  });