// server .js
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parseurl = require('parseurl');

var states = require(process.argv[2]);
var statesList = Object.keys(states);

// create the app
var app = express();

// Middlewares for the express app
app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret: 'mysuperdupersecretstringforCIS571',
	saveUninitialized: false,
	resave: false
}))

app.use(express.static(__dirname + '/public/'));

// conversation handler
app.use(function(req, res, next) {
	var pathname = parseurl(req).pathname;

	// Can't access HTML directly
	if (pathname.includes('views'))
	{
		res.redirect('/');
	}
	if (pathname === '/')
	{
		next();
	}

	// APIs
	if (pathname.startsWith('/api/'))
	{
		pathname.replace('/api/', '');
		if (pathname === '')
		{
			res.status(404).json({'errors': [{'message': 'This route does not exist.'}]});
		}
		if (!(pathname in states))
		{
			res.status(404).json({'errors': [{'message': 'This route does not exist.'}]});
		}

		if (req.header('content-type') !== 'application/json')
		{
			res.status(400).json({'errors': [{'message': 'This route only accepts application/json as its content-type'}]});
		}
		if (!('username' in req.body))
		{
			res.status(400).json({'errors': [{'message': 'Username must be in request body'}]});
		}
		username = req.body['username'];

		// Conversation handling starts here
		if (!req.session.currentState)
		{
			req.session.currentState = '';
		}
		var transitionAllowed = false;
		if (req.session.currentState in states)
		{
			if (pathname in states[req.session.currentState])
			{
				var condition = states[req.session.currentState][pathname];
				if (condition === true)
				{
					transitionAllowed = true;
				}
				if (condition.startsWith('='))
				{
					condition.replace('=', '');
					transitionAllowed = (username === condition);
				}
				else if (condition.startsWith('!='))
				{
					condition.replace('!=', '');
					transitionAllowed = (username !== condition);
				}
				else if (condition.startsWith('>='))
				{
					condition.replace('>=', '');
					transitionAllowed = (username >= condition);
				}
				else if (condition.startsWith('<='))
				{
					condition.replace('<=', '');
					transitionAllowed = (username <= condition);
				}
				else if (condition.startsWith('>'))
				{
					condition.replace('>', '');
					transitionAllowed = (username > condition);
				}
				else if (condition.startsWith('<'))
				{
					condition.replace('<', '');
					transitionAllowed = (username < condition);
				}
			}
		}
	}
	else
	{
		res.status(404).json({'errors': [{'message': 'This route does not exist.'}]});
	}

});

// get index html
app.get('/' function(req, res) {
	res.sendFile('index.html', { root: __dirname + '/public/views/'})
});

// REST APIs
// not entirely RESTful as they use sessions
app.get('/api/a' function(req, res) {

});

app.get('/api/b' function(req, res) {

});

app.get('/api/c' function(req, res) {

});

app.get('/api/d' function(req, res) {

});

app.get('/api/e' function(req, res) {

});

app.get('/api/f' function(req, res) {

});

app.get('/api/g' function(req, res) {

});

app.get('/api/h' function(req, res) {

});

app.get('/api/i' function(req, res) {

});

app.get('/api/j' function(req, res) {

});
