const express = require('express');
const request = require('request');

const app = express()

const localPort = 8080
const port = process.env.PORT || localPort

const clientId = 26073
const clientSecret = process.env.CLIENT_SECRET
const stravaRedirectUri = 'https://gold-glamorous-goldfish.cyclic.app/login/strava/response'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/login/strava', function (req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + stravaRedirectUri + '&response_type=code&scope=profile:read_all,activity:read_all,activity:write');
})

app.get('/login/strava/response', function (req, res) {
  const code = req.query.code

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
      if (!error && response.statusCode == 200) {
        res.redirect('fox://login?state=strava&result=success&access_token=' + response.body.access_token + "&refresh_token=" + response.body.refresh_token);
      } else {
        res.redirect('fox://login?state=strava&result=error');
      }
    }
  );
})

app.get('/refresh/strava', function (req, res) {
  const refreshToken = req.query.refresh_token

  request.post(
    'https://www.strava.com/oauth/token',
    {
      json:
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(
          {
            status: "success",
            accessToken: response.body.access_token,
            refreshToken: response.body.refresh_token
          }
        )
      } else {
        res.json(
          {
            status: "error",
            accessToken: null,
            refreshToken: null
          }
        )
      }
    }
  );
})

app.listen(port, function () {
  console.log('Strava app listening on port ' + port)
})