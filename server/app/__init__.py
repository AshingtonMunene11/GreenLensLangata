from flask import Flask, send_from_directory
from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.models import DevelopmentPlan, Area, Polygon, Report
from app.routes.auth_routes import auth
from app.routes.GEE_Polygon_Analysis_routes import gee_bp
from app.routes.Metrics_routes import metrics_bp
from app.routes import (
    polygon_routes,
    development_routes,
    explore_routes,
    langata_insights_routes,
)
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    # cors.init_app(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://greenlens.ke"]}})

    # Register blueprints and routes
    app.register_blueprint(gee_bp, url_prefix="/gee")
    app.register_blueprint(metrics_bp, url_prefix="/data")

    # Option 1: Keep if you still use these functions
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

    # Auth and chat routes
    from app.routes import auth_routes, chat_routes
    app.register_blueprint(auth_routes.auth, url_prefix="/api/auth")
    app.register_blueprint(chat_routes.chat_bp, url_prefix="/api")

    # Option 2: Keep these only if they register *different* routes
    polygon_routes.register_routes(app)
    development_routes.register_routes(app)
    explore_routes.register_routes(app)
    langata_insights_routes.register_langata_routes(app)

    # Uploaded files
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        uploads_dir = os.path.join(app.root_path, "..", "static", "uploads")
        return send_from_directory(uploads_dir, filename)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app


# <<<<<<< HEAD
#     from app.routes import (
#         register_development_routes,
#         register_explore_routes,
#         register_polygon_routes,
#         register_langata_routes,
#         register_community_routes
#     )

#     register_development_routes(app)
#     register_explore_routes(app)
#     register_polygon_routes(app)
#     register_langata_routes(app)
#     register_community_routes(app)
    
#     from app.routes import auth_routes          
#     from app.routes import chat_routes

#     app.register_blueprint(auth_routes.auth, url_prefix="/api/auth")
#     app.register_blueprint(chat_routes.chat_bp, url_prefix="/api")
    
#     # uploaded files from static/uploads
#     @app.route("/uploads/<path:filename>")
#     def uploaded_file(filename):
        
#         uploads_dir = os.path.join(app.root_path, "..", "static", "uploads")
#         return send_from_directory(uploads_dir, filename)

#     # Create database tables if they don't exist
#     with app.app_context():
#         db.create_all()
# =======
#     app.register_blueprint(gee_bp, url_prefix="/gee")
#     app.register_blueprint(metrics_bp, url_prefix="/data")

#     polygon_routes.register_routes(app)
#     development_routes.register_routes(app)
#     explore_routes.register_routes(app)
#     langata_insights_routes.register_langata_routes(app)
# >>>>>>> origin/Akumu

    return app
