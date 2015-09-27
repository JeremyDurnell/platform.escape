var express = require('express');
var app = express();

app.use(express.static(__dirname + '/site'));
var port = process.env.PORT || 3000;

console.log("listening on " + port);
app.listen(port);