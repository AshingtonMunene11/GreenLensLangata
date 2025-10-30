from flask import Flask, send_from_directory
from flask_migrate import Migrate
from app.models import db, DevelopmentPlan, Area, Polygon, PolygonAnalysis, Insights
from config import Config
from flask_cors import CORS
# from app.routes.GEE_Polygon_Analysis_routes import gee_bp
import os

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)


# app.register_blueprint(gee_bp, url_prefix="/gee")
