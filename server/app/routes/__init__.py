
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.routes.polygon_routes import register_routes

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from app.models import DevelopmentPlan, Area, Polygon, AIInsights

    from app.routes import development_routes, explore_routes, polygon_routes, langata_insights_routes

    # Register your new routes
    langata_insights_routes.register_langata_routes(app)

    with app.app_context():
        db.create_all()

    register_routes(app)

    return app
