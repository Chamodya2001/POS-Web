from flask import Flask
from .utils.config import Config
from .utils.extensions import db, migrate, jwt, ma
from .utils.namespace import NameSpace
from flask_cors import CORS

def app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
     # Enable CORS
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    expose_headers=["Authorization", "x-api-name"],
    allow_headers=["Authorization", "Content-Type", "x-api-name"],
    )

    
    from src.routes.candidate.candidate_route import candidate_bp
    from src.routes.category.category_route import category_bp
    from src.routes.casior.casior_route import casior_bp
    from src.routes.item.item_route import item_bp
    from src.routes.customer.customer_route import customer_bp
    from src.routes.common.commonRoute import candidate_full_bp
    from src.routes.order.order_routes import order_bp
    from src.routes.order.order_process_routes import order_process_bp
   
    app.register_blueprint(candidate_bp, url_prefix= NameSpace.CANDIDATE_PREFIX)
    app.register_blueprint(category_bp,url_prefix = NameSpace.CATEGORY_PREFIX)
    app.register_blueprint(casior_bp,url_prefix = NameSpace.CASIOR_PREFIX)
    app.register_blueprint(item_bp,url_prefix = NameSpace.ITEM_PREFIX)
    app.register_blueprint(customer_bp,url_prefix = NameSpace.CUSTOMER_PREFIX)
    app.register_blueprint(candidate_full_bp,url_prefix = NameSpace.CANDIDATE_FULL_PREFIX)
    app.register_blueprint(order_bp,url_prefix = NameSpace.ORDER_PREFIX)
    app.register_blueprint(order_process_bp,url_prefix = NameSpace.ORDER_PROCESS_PREFIX)
    
    return app
EnvironmentError