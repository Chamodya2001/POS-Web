from sqlalchemy import text
from src.utils.extensions import db
from flask import Flask
from src.utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    result = db.session.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'candidate' AND table_name = 'candidate'"))
    for row in result:
        print(f"{row[0]}: {row[1]}")
