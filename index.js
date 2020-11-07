var express = require('express');

var app = express();

app.get('/', function(req, res) {
  console.log(req, res);
  res.send('Hello World!');
});

var port = 49953; // AGGRE 제일 닮은 번호임 ㅋㅋ

app.listen(port, function() {
  console.log('server on http://localhost:' + port);
});