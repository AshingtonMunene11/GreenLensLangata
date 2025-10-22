from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate
from app.config import Config
from app.models.report import Report



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # import report model
    from app.models import report

    # Import and register blueprint
    from app.routes.community_routes import community_bp
    app.register_blueprint(community_bp)

    # Create database tables if it does not exist
    with app.app_context():
        db.create_all()

    return app
