import os
from dotenv import load_dotenv

# Load environment variables from .env or .flaskenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallbacksecret")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "postgresql://postgres:1234@localhost:5432/posDB")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


#config later after ubdate dev/qa
class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///pos.db")
    DEBUG = True

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    DEBUG = False