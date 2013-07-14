#!/usr/bin/env node

var fs = require("fs");

var express = require("express");

var buffer = new Buffer(128);

// buffer = fs.readFileSync("./index.html");

   var app = express.createServer(express.logger());
// var app = express();

// console.log("Buffer is: " + buffer.toString('utf8'));
app.get('/', function(request, response) {
  response.send(fs.readFileSync("./index.html").toString()) ;
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
