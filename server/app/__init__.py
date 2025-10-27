from flask import Flask, send_from_directory
from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.models import DevelopmentPlan, Area, Polygon, Report
from app.routes.auth_routes import auth
import os



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    # cors.init_app(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://greenlens.ke"]}})

    # Register blueprints
    from app.routes import (
        register_development_routes,
        register_explore_routes,
        register_polygon_routes,
        register_langata_routes,
        register_community_routes
    )

    register_development_routes(app)
    register_explore_routes(app)
    register_polygon_routes(app)
    register_langata_routes(app)
    register_community_routes(app)

    # Auth blueprint prefix
    app.register_blueprint(auth, url_prefix="/api/auth")

    # uploaded files from static/uploads
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        
        uploads_dir = os.path.join(app.root_path, "..", "static", "uploads")
        return send_from_directory(uploads_dir, filename)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
