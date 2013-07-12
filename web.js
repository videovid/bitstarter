var express = require('express');

var buffer = Buffer(128);

buffer = fs.readFileSync('Index.html');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(buf.toString(buffer)) ;
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
