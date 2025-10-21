from app import db

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- Initialize extensions ---
    db.init_app(app)

    # --- Import models so SQLAlchemy knows them ---
    from app.models import DevelopmentPlan, Area, Polygon, AIInsights

   
    # These imports must come *after* the app is created
    from app.routes import development_routes, explore_routes, polygon_routes

    # --- Local testing: create tables automatically ---
    with app.app_context():
        db.create_all()

    return app
