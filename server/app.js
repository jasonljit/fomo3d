var express = require('express');
var app = express();
const path = require('path');

app.use(express.static(__dirname + '/../public/js'));
app.use(express.static(__dirname + '/../stylus'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/../views/action.html'));
});

app.listen(3333, function () {
  console.log('Example app listening on port 3333!');
});