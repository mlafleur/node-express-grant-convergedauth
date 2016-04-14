// Reference express, express-session and grant packages
var express = require('express'), session = require('express-session'), Grant = require('grant-express')

// Create an instance of Grant and configure it for the micrsoft v2 auth endpoint
var grant = new Grant({
    "server": {
        "protocol": "http",
        "host": "localhost:3000",
        "transport": "session"
    },
    "microsoft": {
        "key": "fc9a6fcf-bcd0-451c-9641-12ca455b9a34",
        "secret": "tXVebOX8jdhgv5i6HN9Ep9w",
        "scope": ["https://graph.microsoft.com/User.Read", "offline_access", "openid"],
        "callback": "/loggedIn"
    }
});

// Create an instance of express using our session and grant instances 
var app = express();
app.use(session({ name: 'grant', secret: 'very secret', saveUninitialized: true, resave: true }));
app.use(grant);

// This is the web root and provides a simple "Click to Start" link for the user 
app.get('/', function(req, res) {
    res.send('<a href="./connect/microsoft" target="_blank">Click to Start</a>');
});

// This is the callback we land at after authenication
app.get('/loggedIn', function(req, res) {
    var result = '<pre>' + JSON.stringify(req.session.grant.response.raw, null, 2) + '</pre>';
    res.end(result)
});

// Start listening on port 3000
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

