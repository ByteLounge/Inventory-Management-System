from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Switch to SQLite for local demo since Docker is unavailable
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'inventory_saas.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    
    # Register models so Alembic can find them
    with app.app_context():
        from app import models

    # Register blueprints 
    from app.api.auth import auth_bp
    from app.api.products import products_bp
    from app.api.warehouses import warehouses_bp
    from app.api.inventory import inventory_bp
    from app.api.suppliers import suppliers_bp
    from app.api.sales import sales_bp
    from app.api.analytics import analytics_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(warehouses_bp, url_prefix='/api/warehouses')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(suppliers_bp, url_prefix='/api/suppliers')
    app.register_blueprint(sales_bp, url_prefix='/api/sales')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
        
    return app
