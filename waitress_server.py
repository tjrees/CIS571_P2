from waitress import serve
import sys
import app

if __name__ == '__main__':
	app.app_startup(sys.argv[1])
	serve(app.app, host='0.0.0.0', port=8000)
