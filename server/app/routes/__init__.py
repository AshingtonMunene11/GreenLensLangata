from .development_routes import register_routes as register_development_routes
from .explore_routes import register_routes as register_explore_routes
from .polygon_routes import register_routes as register_polygon_routes
from .langata_insights_routes import register_langata_routes
from .community_routes import register_community_routes
from .auth_routes import auth
from .GEE_Polygon_Analysis_routes import gee_bp
from .Metrics_routes import metrics_bp
# from app.routes.chat_routes import chat_bp
# from .chat import chat_bp
# from .chat_routes import chat_bp



# <<<<<<< HEAD
# from .development_routes import register_routes as register_development_routes
# from .explore_routes import register_routes as register_explore_routes
# from .polygon_routes import register_routes as register_polygon_routes
# from .langata_insights_routes import register_langata_routes
# from .community_routes import register_community_routes
# from .auth_routes import auth
# # from app.routes.chat_routes import chat_bp
# # from .chat import chat_bp
# # from .chat_routes import chat_bp
# =======
# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from config import Config
# from app.routes.GEE_Polygon_Analysis_routes import gee_bp

# db = SQLAlchemy()


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     db.init_app(app)
#     migrate = Migrate(app, db)
#     CORS(app)

#     from app.routes import (
#         polygon_routes,
#         development_routes,
#         explore_routes,
#         langata_insights_routes,
#         # PolygonPlanAnalysis_routes,
#     )

#     polygon_routes.register_routes(app)
#     development_routes.register_routes(app)
#     explore_routes.register_routes(app)
#     langata_insights_routes.register_langata_routes(app)
#     # PolygonPlanAnalysis_routes.register_routes(app)

#     app.register_blueprint(gee_bp)
#     return app
# >>>>>>> origin/Akumu
