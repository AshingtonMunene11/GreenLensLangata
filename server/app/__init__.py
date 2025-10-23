from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate
from app.config import Config
from app.models.report import Report
from .extensions import db, migrate, jwt, cors


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
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # cors.init_app(app, resources={r"/*": {"origins": "*"}})
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    from .routes.auth_routes import auth
    app.register_blueprint(auth, url_prefix="/api/auth")

    return app
