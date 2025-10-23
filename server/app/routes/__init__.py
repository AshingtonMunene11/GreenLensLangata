
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  

def create_app():
    app = Flask(__name__)

   
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
    db.init_app(app)

    from app.models import DevelopmentPlan, Area, Polygon, AIInsights
  
    from app.routes import development_routes, explore_routes, polygon_routes, langata_insights

    # Register your new routes
    langata_insights.register_langata_routes(app)

   
    with app.app_context():
        db.create_all()

    return app

