from flask import *
import datetime
import read_state_diagram

app = Flask(__name__)

states = {}
transitions = {}
current_conversations = {}


def app_startup(input_filename):
	global states
	global transitions
	states, transitions = read_state_diagram(input_filename)

# Returns true if the state requested is valid. Otherwise returns false.
def validate_state(state, name):
	global states
	global transition
	global current_conversations

	if state not in states:
		return False

	prev_state = ''
	if name in current_conversations:
		prev_state = current_conversations[name]

	if state not in transitions[prev_state]:
		return False

	condition = transitions[prev_state][state]
	if condition == True:
		return True

	if condition.startswith('='):
		compare = condition.split('=')[1]
		return name == compare

	if condition.startswith('!='):
		compare = condition.split('!=')[1]
		return name != compare

	if condition.startswith('>'):
		compare = condition.split('>')[1]
		return name > compare

	if condition.startswith('>='):
		compare = condition.split('>=')[1]
		return name >= compare

	if condition.startswith('<'):
		compare = condition.split('<')[1]
		return name < compare

	if condition.startswith('<='):
		compare = condition.split('<=')[1]
		return name <= compare

	else:
		except

@app.route('/conversationhandler', methods=['GET'])
def conversation_handler():
	request_data = request.get_json()
	if ('name' not in request_data or
		'state' not in request_data):
		return jsonify({'errors': [{'message': 'Requests to conversation handler must include name and state'}]}), 400

	name = request_data['name']
	upper_name = name.upper()
	if upper_name == '':
		return jsonify({'errors': [{'message': 'Name cannot be an empty string'}]}), 400

	if !(upper_name[0].isalpha()):
		return jsonify({'errors': [{'message': 'Name must start with a letter'}]}), 400

	state = request_data['state']
	# 10 allowed states
	if state not in {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'}:
		return jsonify({'errors': [{'message': 'Not a valid state'}]}), 400

	if (!validate_state(state, upper_name)):
		return jsonify({'result': False}), 200

	else:
		return jsonify({'result': True}), 200


# Route for the actual services implemented 
@app.route('/service/<state>', methods=['GET'])
def web_service():
	# 10 allowed states
	if state not in {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'}:
		return jsonify({'errors': [{'message': 'Not a valid state'}]}), 404

	request_data = request.get_json()
	if ('name' not in request_data):
		return jsonify({'errors': [{'message': 'Request must include name.'}]}), 400

	name = request_data['name']
	upper_name = name.upper()
	if upper_name == '':
		return jsonify({'errors': [{'message': 'Name cannot be an empty string'}]}), 400

	if !(upper_name[0].isalpha()):
		return jsonify({'errors': [{'message': 'Name must start with a letter'}]}), 400

	if (!conversation_handler(state, upper_name)):
		return jsonify({'errors': [{'message': 'Cannot transition to this state'}]}, 403)

	timestamp = datetime.datetime.now()
	date = str(timestamp.year) + '-' + str(timestamp.month) + '-' + str(timestamp.day)
	time = str(timestamp.hour) + ':' + str(timestamp.minute) + ':' + str(timestamp.second)

	return "GO BLUE", 200

@app.route('/', methods=['GET'])
def index_page():
	return render_template('index.html')


	
