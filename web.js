#!/usr/bin/env node

var fs = require("fs");

var express = require("express");

var buffer = Buffer(128);

buffer = fs.readFileSync("./index.html");

// var app = express.createServer(express.logger());
var app = express();

console.log("Buffer is: " + buf.toString(buffer));
app.get('/', function(request, response) {
  response.send(buf.toString(buffer)) ;
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
