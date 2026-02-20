from sqlalchemy import text
from src.utils.extensions import db
from flask import Flask
from src.utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    print("Checking schemas...")
    result = db.session.execute(text("SELECT schema_name FROM information_schema.schemata"))
    schemas = [row[0] for row in result]
    print(f"Schemas: {schemas}")
    
    print("\nChecking tables in 'casior' schema...")
    if 'casior' in schemas:
        result = db.session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'casior'"))
        tables = [row[0] for row in result]
        print(f"Tables in 'casior': {tables}")
    else:
        print("Schema 'casior' NOT FOUND!")
        
    print("\nChecking tables in 'candidate' schema...")
    if 'candidate' in schemas:
        result = db.session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'candidate'"))
        tables = [row[0] for row in result]
        print(f"Tables in 'candidate': {tables}")
    else:
        print("Schema 'candidate' NOT FOUND!")
