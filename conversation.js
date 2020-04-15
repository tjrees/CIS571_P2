// conversation .js
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parseurl = require('parseurl');
var convert = require('xml-js');
var http = require('http');
var bodyParser = require('body-parser');

var states = require(process.argv[2]);

// create the app
var app = express();

// Middlewares for the express app
app.use(cookieParser());

app.use(session({
	secret: 'mysuperdupersecretstringforCIS571',
	saveUninitialized: false,
	resave: false
}))

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public/'));

const possibleStates = {
	'a': true,
	'b': true,
	'c': true,
	'd': true,
	'e': true,
	'f': true,
	'g': true,
	'h': true,
	'i': true,
	'j': true
}

function transitionAllowed(username, srcState, dstState)
{
	var usernameLower = username.toLowerCase();
	if (srcState in states)
	{
		if (dstState in states[srcState])
		{
			var condition = states[srcState][dstState];
			if (condition === true)
			{
				return true;
			}
			if (condition.startsWith('='))
			{
				var compare = condition.replace('=', '');
				return (usernameLower === compare);
			}
			else if (condition.startsWith('!='))
			{
				var compare = condition.replace('!=', '');
				return (usernameLower !== compare);
			}
			else if (condition.startsWith('>='))
			{
				var compare = condition.replace('>=', '');
				return (usernameLower >= compare);
			}
			else if (condition.startsWith('<='))
			{
				var compare = condition.replace('<=', '');
				return (usernameLower <= compare);
			}
			else if (condition.startsWith('>'))
			{
				var compare = condition.replace('>', '');
				return (usernameLower > compare);
			}
			else if (condition.startsWith('<'))
			{
				var compare = condition.replace('<', '');
				return (usernameLower < compare);
			}
			return false;
		}
	}
	return false;
}

async function synchronousHttp(username, state)
{
	var reqJson = {
		username: username
	};
	var reqStr = JSON.stringify(reqJson);
	var reqOptions = {
		hostname: 'localhost',
		port: 5000,
		path: '/api/' + state,
		methods: 'GET',
		headers: {
			'content-type': 'application/json',
			'content-length': Buffer.byteLength(reqStr)
		}
	};

	return new Promise((resolve, reject) => {
		var responseData = ''
		var request = http.request(reqOptions, response => {
			if (response.statusCode != 200)
			{
				reject('Invalid status code <' + response.statusCode + '>');
			}
			response.on('data', (chunk) => {
				responseData += chunk;
			});
			response.on('end', () => {
				resolve({'content-type': response.headers['content-type'], data: responseData })
			});
		});
		request.end(reqStr);
	});
}

// get index html
app.get('/', function(req, res) {
	res.sendFile('index.html', { root: __dirname + '/public/views/'});
});

// Fetch available transitions (for page load)
app.get('/fetchtransitions', function(req, res) {
	if (!req.session.username)
	{
		req.session.username = '';
	}
	if (!req.session.currentState)
	{
		req.session.currentState = '';
	}
	var jsonObject = {};
	jsonObject.next = [];
	var candidates = Object.keys(states[req.session.currentState]);
	for (var i = 0; i < candidates.length; i++)
	{
		if (transitionAllowed(req.session.username, req.session.currentState, candidates[i]))
		{
			jsonObject.next.push(candidates[i]);
		}
	}

	res.status(200).json(jsonObject);
});

// Conversation Handler
app.post('/conversationhandler', async function(req, res) {
	if (req.header('content-type') === 'application/json')
	{
		var requestJson = req.body;

		if (!('username' in requestJson) ||
			  !('state' in requestJson))
		{
			res.status(400).json({'errors': [{'message': 'Conversation handler requires username and state in the request.'}]});
			return;
		}
		var username = requestJson.username.toLowerCase();
		var dstState = requestJson.state;

		req.session.username = username;

		if (!req.session.currentState)
		{
			req.session.currentState = '';
		}

		if (!(dstState in possibleStates))
		{
			res.status(400).json({'errors': [{'message': 'The state you requested does not exist'}]});
			return;
		}
		
		if (!transitionAllowed(username, req.session.currentState, dstState))
		{
			res.status(401).json({'errors': [{'message': 'You cannot access this state.'}]});
			return;
		}

		// If the transition is allowed, request data from the REST API
		var apiResults = await synchronousHttp(username, dstState);

		// Otherwise, update the state and continue to the actual state handler.
		req.session.currentState = dstState;

		var nextStates = [];
		var candidates = Object.keys(states[dstState]);
		for (var i = 0; i < candidates.length; i++)
		{
			if (transitionAllowed(username, dstState, candidates[i]))
			{
				nextStates.push(candidates[i]);
			}
		}

		if (apiResults['content-type'].includes('xml'))
		{
			// Add <next> tags to XML string
			var xmlString = apiResults.data.replace('</root>\n', '');
			for (var i = 0; i < nextStates.length; i++)
			{
				xmlString += '<next>' + nextStates[i] + '</next>\n';
			}
			xmlString += '</root>\n';
			res.set('content-type', 'text/xml');

			res.status(200).send(xmlString);
			return;
		}
		else
		{
			var jsonObject = JSON.parse(apiResults.data);
			jsonObject.next = [];
			for (var i = 0; i < nextStates.length; i++)
			{
				jsonObject.next.push(nextStates[i]);
			}
			res.status(200).json(jsonObject);
			return;
		}// json
	}
	else
	{
		res.status(400).json({'errors': [{'message': 'Conversation handler only accepts application/json as its content-type'}]});
		return;
	}
});


let port = 8000;
if (port == null || port == '')
{
    port = 8000;
}
app.listen(port);
console.log('App listening on port', port);
