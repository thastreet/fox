const express = require('express');
const request = require('request');
const app = express()

const localPort = 8080
const port = process.env.PORT || localPort

const clientId = 26073
const redirectUri = 'stravastreet/response'

app.get('/', function (req, res) {
  res.send('Suh')
})

app.get('/login', function (req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code');
})

app.get('/login/response', function (req, res) {
  res.send(req.query.code)
})

app.listen(port, function () {
  console.log('Strava app listening on port ' + port)
})