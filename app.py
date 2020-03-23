from flask import *

app = Flask(__name__)

# Route for the actual services implemented 
@app.route('/service/<id>', methods=['GET'])
def web_service():
	return "GO BLUE", 200

@app.route('/', methods=['GET'])
def index_page():
	return render_template('index.html')


	
