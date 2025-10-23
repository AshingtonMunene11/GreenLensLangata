from flask import Flask
from flask_migrate import Migrate
from models import db, DevelopmentPlan, Area, AIinsights, Polygon
from config import Config
from flask_cors import CORS


app=Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate=Migrate(app, db)

CORS(app)

