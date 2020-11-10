var express = require('express');
var mysql = require('mysql');

var app = express();

app.get('/', (req, res) => {
  console.log(req, res);
  res.send('Hello World!');
});

var port = 49953; // AGGRE 제일 닮은 번호임 ㅋㅋ

app.listen(port, () => {
  console.log('server on http://localhost:' + port);
});

var connection = mysql.createConnection({
  host: "localhost",
  
})