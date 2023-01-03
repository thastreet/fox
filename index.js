const express = require('express')
const request = require('request')

const app = express()

app.use(bodyParser.urlencoded())

const localPort = 8080
const port = process.env.PORT || localPort

const stravaClientId = 26073
const stravaClientSecret = process.env.STRAVA_CLIENT_SECRET
const stravaRedirectUri = 'https://gold-glamorous-goldfish.cyclic.app/login/strava/response'

const spotifyClientId = "8c1f114b54644b92838df9529358a3d4"
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyRedirectUri = 'https://gold-glamorous-goldfish.cyclic.app/login/spotify/response'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/login/strava', function (req, res) {
  res.redirect('https://www.strava.com/oauth/authorize?client_id=' + stravaClientId + '&redirect_uri=' + stravaRedirectUri + '&response_type=code&scope=profile:read_all,activity:read_all,activity:write')
})

app.get('/login/spotify', function (req, res) {
  res.redirect('https://accounts.spotify.com/authorize?client_id=' + spotifyClientId + '&redirect_uri=' + spotifyRedirectUri + '&response_type=code&scope=user-read-recently-played')
})

app.get('/login/strava/response', function (req, res) {
  const code = req.query.code

  request.post(
    'https://www.strava.com/oauth/token',
    {
      json:
      {
        client_id: stravaClientId,
        client_secret: stravaClientSecret,
        code: code
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.redirect('fox://login?state=strava&result=success&access_token=' + response.body.access_token + "&refresh_token=" + response.body.refresh_token)
      } else {
        res.redirect('fox://login?state=strava&result=error')
      }
    }
  )
})

app.get('/login/spotify/response', function (req, res) {
  const code = req.query.code

  request.post(
    'https://accounts.spotify.com/api/token?grant_type=authorization_code&code=' + code + '&redirect_uri=' + spotifyRedirectUri,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret, 'utf-8').toString('base64'))
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response.body)
        res.redirect('fox://login?state=spotify&result=success&access_token=' + response.body.access_token + "&refresh_token=" + response.body.refresh_token)
      } else {
        res.redirect('fox://login?state=spotify&result=error')
      }
    }
  )
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
  )
})

app.listen(port, function () {
  console.log('Strava app listening on port ' + port)
})