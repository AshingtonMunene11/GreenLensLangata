from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, cors
from app.models import DevelopmentPlan, Area, Polygon, Report  # Include other models as needed
from app.routes.polygon_routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    from app.routes import (
        development_routes,
        explore_routes,
        polygon_routes,
        langata_insights_routes,
        # community_bp,
        # auth_routes
    )

    development_routes.register_routes(app)
    explore_routes.register_routes(app)
    polygon_routes.register_routes(app)
    langata_insights_routes.register_langata_routes(app)
    # app.register_blueprint(community_bp)
    # app.register_blueprint(auth_routes.auth, url_prefix="/api/auth")

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app


# from flask import Flask
# from app.config import Config
# from app.extensions import db, migrate, jwt, cors
# from app.models.report import Report  # if needed for early registration

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     # Initialize extensions
#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)
#     cors.init_app(app)

#     # Optional: register models or blueprints here
#     # from app.routes import main_bp
#     # app.register_blueprint(main_bp)

#     return app

# # <<<<<<< Akumu
# # from flask_sqlalchemy import SQLAlchemy
# # from flask_migrate import Migrate
# # from flask_cors import CORS

# # db = SQLAlchemy()
# # migrate = Migrate()

# # def create_app():
# #     app = Flask(__name__)

# #     # Load configuration
# #     app.config.from_object('config.Config')
# # =======
# # from flask_cors import CORS
# # from app.extensions import db, migrate
# # from app.config import Config
# # from app.models.report import Report
# # from .extensions import db, migrate, jwt, cors


# # def create_app():
# #     app = Flask(__name__)
# #     app.config.from_object(Config)
# # >>>>>>> Development

# #     # Initialize extensions
# #     db.init_app(app)
# #     migrate.init_app(app, db)
# #     CORS(app)

# <<<<<<< Akumu
#     # Import models so SQLAlchemy knows them
#     from app.models import DevelopmentPlan, Area, Polygon, report
#     # You can import AIInsights later when it’s ready

#     # Import and register routes
#     from app.routes import development_routes, explore_routes, polygon_routes, langata_insights_routes, community_bp
#     # Import ai_insights later when ready

#     development_routes.register_routes(app)
#     explore_routes.register_routes(app)
#     polygon_routes.register_routes(app)
#     langata_insights_routes.register_langata_routes(app)

#     # Create database tables if they don’t exist
#     with app.app_context():
#         db.create_all()

#     return app






    
# =======
#     app.register_blueprint(community_bp)

#     # Create database tables if it does not exist
#     with app.app_context():
#         db.create_all()
#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)

#     # cors.init_app(app, resources={r"/*": {"origins": "*"}})
#     cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#     from .routes.auth_routes import auth
#     app.register_blueprint(auth, url_prefix="/api/auth")

#     return app
# >>>>>>> Development
