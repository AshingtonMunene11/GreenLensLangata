from flask import Flask, jsonify, request
from models import db, DevelopmentPlan, Area, AIinsights, Polygon
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

# my projects page
@app.route('/api/development_plans', methods=['GET'])
def get_development_plans():
    plans = DevelopmentPlan.query.all()
    return jsonify([plan.to_dict() for plan in plans])
