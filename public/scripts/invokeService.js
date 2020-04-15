// includes scripts for invoking web services.
window.onload = function() {
	this.fetchTransitions();
};

function fetchTransitions()
{
	var errors = []
	$.ajax('/fetchtransitions', {
		type: 'get',
		success: function(data, status)
		{
			document.getElementById('state_content').innerHTML = '';
			var nextStates = data['next'];
			for (var i = 0; i < nextStates.length; i++)
			{
				var text = '<h4 onclick="invokeService(' + "'" + nextStates[i] + "'" + ')">State ' + nextStates[i] + '</h4>';
				document.getElementById('state_content').innerHTML += text;
			}
		},
		error: function(jqXHR, exception){
			var errors = jqXHR.responseJSON.errors;
			var text = "";
			for(var i = 0; i < errors.length; i++) {
				text += '<p class="error">' + errors[i].message + '</p>';
			}
			document.getElementById("error_messages").innerHTML = text;
		}
	})
}


function invokeService(state)
{
	var inputData = {
		username: document.getElementById('username').value,
		state: state
	}

	var errors = []
	$.ajax('/conversationhandler', {
		type: 'post',
		contentType: 'application/json',
		data: JSON.stringify(inputData),
		success: function(data, status, jqXHR)
		{
			document.getElementById('state_content').innerHTML = '';
			document.getElementById('response_data').innerHTML = '';
			var contentType = jqXHR.getResponseHeader('content-type') || '';
			console.log(contentType);
			if (contentType.includes('xml'))
			{
				var nextStates = data.getElementsByTagName('next');
				var username = data.getElementsByTagName('username')[0].textContent;
				var date = data.getElementsByTagName('date')[0].textContent;
				var time = data.getElementsByTagName('time')[0].textContent;

				for (var i = 0; i < nextStates.length; i++)
				{
					if (nextStates[i].textContent !== '')
					{
						var services = '<h4 onclick="invokeService(' + "'" + nextStates[i].textContent + "'" + ')">State ' + 
							nextStates[i].textContent + '</h4>';
						document.getElementById('state_content').innerHTML += services;
					}
				}
				document.getElementById('state_content').innerHTML += '---<br/>';
				var text = '';
				text += '<p>Received an XML response.</p>\n';
				text += '<p>Username: ' + username + '</p>\n';
				text += '<p>Date accessed: ' + date + '</p>\n';
				text += '<p>Time accessed: ' + time + '</p>\n';

				document.getElementById('response_data').innerHTML = text;
			}
			else if (contentType.includes('json'))
			{
				console.log('here');
				var nextStates = data['next'];
				for (var i = 0; i < nextStates.length; i++)
				{
					if (nextStates[i] !== '')
					{
						var services = '<h4 onclick="invokeService(' + "'" + nextStates[i] + "'" + ')">State ' + nextStates[i] + '</h4>';
						document.getElementById('state_content').innerHTML += services;
					}
				}
				document.getElementById('state_content').innerHTML += '---<br/>';
				var text = ''
				text += '<p>Received a JSON response.</p>';
				text += '<p>Username: ' + data['username'] + '</p>';
				text += '<p>Date accessed ' + data['date'] + '</p>';
				text += '<p>Time accessed ' + data['time'] + '</p>';
				document.getElementById('response_data').innerHTML = text;
			}
		},
		error: function(jqXHR, exception){
			var errors = jqXHR.responseJSON.errors;
			var text = "";
			for(var i = 0; i < errors.length; i++) {
				text += '<p class="error">' + errors[i].message + '</p>';
			}
			document.getElementById('state_content').innerHTML = '';
			document.getElementById('response_data').innerHTML = '';
			document.getElementById("error_messages").innerHTML = text;
		}
	})
}