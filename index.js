const express = require('express');
const request = require('request');
const app = express()

const localPort = 8080
const port = process.env.PORT || localPort

const clientId = 26073
const clientSecret = process.env.CLIENT_SECRET
const redirectUri = 'https://strava-street.herokuapp.com/login/response'

var appIdMap = new Map();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/status', function (req, res) {
  
})

app.get('/login', function (req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code');
})

app.get('/login/response', function (req, res) {
  const code = req.query.code

  console.log(req)
  console.log(res)

  request.post(
    'https://www.strava.com/oauth/token',
    {
      json:
        {
          client_id: clientId,
          client_secret: clientSecret,
          code: code
        }
    },
    function (error, response, body) {
      const statusCode = response.statusCode

      if (statusCode == 200) {
        
      }

      res.sendStatus(statusCode)
    }
  );
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})