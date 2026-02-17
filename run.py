from src.app import app as create_app

import os

if __name__ == "__main__":
    application = create_app() 
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5005))
    application.run(host=host, port=port)
