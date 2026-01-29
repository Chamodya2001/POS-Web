from src.app import app as create_app

if __name__ == "__main__":
    application = create_app() 
    application.run()
