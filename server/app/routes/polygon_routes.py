from flask import Flask, jsonify, request
from models import db, DevelopmentPlan, polygon, AIinsights
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from app import app

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

@app.route('/polygons/<int:polygon_id>', methods=['GET'])
def get_polygon(polygon_id):
    polygon=polygon.query.get_or_404(polygon_id)

    insights=AIinsights.query.filter_by(polygon_id==polygon_id).all()
    plans=DevelopmentPlan.query.filter_by(polygon_id=polygon_id).all()

    return jsonify({
        "polygon":polygon.to_dict(),
        "ai_insights": [insight.to_dict() for insight in insights]
        "development_plans": [plan.to_dict() for plan in plans]
    })


