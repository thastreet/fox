const express = require('express')
const app = express()

var serverPort = 8080;
var port = process.env.PORT || serverPort;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})