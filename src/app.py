from flask import Flask
from .utils.config import Config
from .utils.extensions import db, migrate, jwt, ma
from .utils.namespace import NameSpace

def app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    
    from src.routes.candidate.candidate_route import candidate_bp
    from src.routes.category.category_route import category_bp
    from src.routes.casior.casior_route import casior_bp
   
    app.register_blueprint(candidate_bp, url_prefix= NameSpace.CANDIDATE_PREFIX)
    app.register_blueprint(category_bp,url_prefix = NameSpace.CATEGORY_PREFIX)
    app.register_blueprint(casior_bp,url_prefix = NameSpace.CASIOR_PREFIX)
    
    
    return app
EnvironmentError