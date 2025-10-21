from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Import models so SQLAlchemy knows them
    from app.models import DevelopmentPlan, Area, Polygon
    # You can import AIInsights later when it’s ready

    # Import and register routes
    from app.routes import development_routes, explore_routes, polygon_routes
    # Import ai_insights later when ready

    development_routes.register_routes(app)
    explore_routes.register_routes(app)
    polygon_routes.register_routes(app)

    # Create database tables if they don’t exist
    with app.app_context():
        db.create_all()

    return app






    
