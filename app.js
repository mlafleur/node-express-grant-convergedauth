// Properties from https://apps.dev.microsoft.com/ registration
// Application Id: fc9a6fcf-bcd0-451c-9641-12ca455b9a34
// Password: tXVebOX8jdhgv5i6HN9Ep9w

var authProps = {
    id: 'fc9a6fcf-bcd0-451c-9641-12ca455b9a34', // Application Id (Client Id)
    password: 'tXVebOX8jdhgv5i6HN9Ep9w', // Password (Client Secret)
    scopes: [
        'https://graph.microsoft.com/User.Read', // Read user information 
        'openid', // Use OpenID (returns an id_token) 
        'offline_access' // Allow offline access (referns a refresh_token)
    ],
    authorizeUri: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUri: "https://login.microsoftonline.com/common/oauth2/v2.0/token"
}

// Reference Express and Express-Session
var express = require('express'), session = require('express-session')

// Reference Grant and Configure
var Grant = require('grant-express')
    , grant = new Grant({
        "server": {
            "protocol": "http",
            "host": "localhost:3000",
            "transport": "session"
        },
        // Grant doesn't have built in support yet so here
        // we are creating a custom provider named MSFTv2.
        "msftv2": {
            "authorize_url": authProps.authorizeUri,
            "access_url": authProps.tokenUri,
            "key": authProps.id,
            "secret": authProps.password,
            "scope": authProps.scopes,
            "oauth": 2, // Use OAUTH2 model
            "callback": "/msftv2/callback", // Redirect URI
            "scope_delimiter": " " // Microsoft requires scopes be space delimited
        }
    });

var app = express();
app.use(session({ name: 'grant', secret: 'very secret', saveUninitialized: true, resave: true }));
app.use(grant);

app.get('/', function(req, res) {
    res.send('<a href="./connect/msftv2" target="_blank">Click to Start</a>');
});

app.get('/msftv2/callback', function(req, res) {
    // Return the RAW token data
    res.end(JSON.stringify(req.session.grant.response.raw, null, 2))
})

// Start listening at http://localhost:3000
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

