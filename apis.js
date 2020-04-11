// conversation .js
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parseurl = require('parseurl');
var convert = require('xml-js');

// create the app
var app = express();

// Middlewares for the express app
app.use(express.json());

function createXML(jsonObj)
{
	console.log(JSON.stringify(jsonObj));
	var options = {
		compact: true,
		ignoreComment: true,
		spaces: 4
	};
	var xmlStr = convert.json2xml(JSON.stringify(jsonObj), options);
	return '<?xml version="1.0" encoding="utf-8"?>\n<root>\n' + xmlStr + '\n</root>\n';
}

// Returns a json object with the data required by the API
function apiHandler(username)
{
	var usernameLower = username.toLowerCase();
	var returnObj = {};
	// API will return JSON if username starts with A-M.
	if (usernameLower < 'n')
	{
		returnObj.type = 'json';
	}
	else
	{
		returnObj.type = 'xml';
	}
	var dateObj = new Date();

	var date = ('0' + dateObj.getDate()).slice(-2);
	var month = ('0' + dateObj.getMonth()).slice(-2);
	var year = dateObj.getFullYear();
	var hours = ('0' + dateObj.getHours()).slice(-2);
	var minutes = ('0' + dateObj.getMinutes()).slice(-2);
	var seconds = ('0' + dateObj.getSeconds()).slice(-2);
	returnObj.date = year + '-' + month + '-' + date;
	returnObj.time = hours + ':' + minutes + ':' + seconds;
	returnObj.username = username;
	return returnObj;
}

// REST APIs
app.get('/api/a', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/a only accepts application/json as its content-type'}]});
		return;
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/a requires username in the request JSON.'}]});
		return;
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/b', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/b only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/b requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/c', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/c only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/c requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/d', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/d only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/d requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/e', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/e only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/e requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/f', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/f only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/f requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/g', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/g only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/g requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/h', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/h only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/h requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/i', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/i only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/i requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

app.get('/api/j', function(req, res) {
	if (req.header('content-type') !== 'application/json')
	{
		res.status(400).json({'errors': [{'message': '/api/j only accepts application/json as its content-type'}]});
	}
	var requestJson = req.body;
	if (!('username' in requestJson))
	{
		res.status(400).json({'errors': [{'message': '/api/j requires username in the request JSON.'}]});
	}
	var functionData = apiHandler(requestJson.username);

	if (functionData.type === 'json')
	{
		delete functionData.type;
		res.status(200).json(functionData)
	}
	else
	{
		delete functionData.type;
		res.set('content-type', 'text/xml');
		res.status(200).send(createXML(functionData));
	}
});

let port = 5000;
if (port == null || port == '')
{
    port = 5000;
}
app.listen(port);
console.log('App listening on port', port);
