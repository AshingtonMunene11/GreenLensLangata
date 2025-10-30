from flask import Flask, send_from_directory
from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.models import DevelopmentPlan, Area, Polygon, Report
from app.routes.auth_routes import auth
# from app.routes.GEE_Polygon_Analysis_routes import gee_bp
from app.routes.Metrics_routes import metrics_bp
from app.routes import (
    polygon_routes,
    development_routes,
    explore_routes,
    langata_insights_routes,
    community_routes,
)
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register Blueprints
    # app.register_blueprint(gee_bp, url_prefix="/gee")
    app.register_blueprint(metrics_bp, url_prefix="/data")
    app.register_blueprint(auth, url_prefix="/api/auth")

    # Register function-based route groups
    polygon_routes.register_routes(app)
    development_routes.register_routes(app)
    explore_routes.register_routes(app)
    langata_insights_routes.register_langata_routes(app)
    community_routes.register_community_routes(app)

    # Chat routes
    from app.routes import chat_routes
    app.register_blueprint(chat_routes.chat_bp, url_prefix="/api")

    # Uploaded files
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        # uploads_dir = os.path.join(app.root_path, "..", "static", "uploads")
        # return send_from_directory(uploads_dir, filename)
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
