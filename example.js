// example.js
var http = require('http');

async function synchronousHttp()
{
	var reqJson = {
		username: 'andrew'
	};
	var reqStr = JSON.stringify(reqJson);
	var reqOptions = {
		hostname: 'localhost',
		port: 5000,
		path: '/api/a',
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
			})
		});
		request.end(reqStr);
	});
}

async function callApi()
{
	var apiResponse = await synchronousHttp();
	console.log(apiResponse);
}

callApi()