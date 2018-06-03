const express = require('express');

const app = express()

const localPort = 8080
const port = process.env.PORT || localPort

const clientId = 26073
const redirectUri = 'http://localhost:8080/login/response'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/login', function (req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code');

  app.get('/login/response', function (req, res) {
    console.log('response')
    console.log(req.query.code)
    console.log(req.query.scope)
  })
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})