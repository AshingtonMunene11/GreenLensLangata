from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, cors


from app.routes.GEE_Polygon_Analysis_routes import gee_bp
from app.routes.Metrics_routes import metrics_bp
from app.routes import (
    polygon_routes,
    development_routes,
    explore_routes,
    langata_insights_routes,
)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    app.register_blueprint(gee_bp, url_prefix="/gee")
    app.register_blueprint(metrics_bp, url_prefix="/data")

    polygon_routes.register_routes(app)
    development_routes.register_routes(app)
    explore_routes.register_routes(app)
    langata_insights_routes.register_langata_routes(app)

    return app
