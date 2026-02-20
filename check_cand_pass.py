from sqlalchemy import text
from src.utils.extensions import db
from flask import Flask
from src.utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    result = db.session.execute(text("SELECT email, password_hash FROM candidate.candidate")).fetchall()
    for r in result:
        print(f"Email: {r[0]}, Hash: {r[1]}")
