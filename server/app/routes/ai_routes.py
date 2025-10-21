from flask import Flask, jsonify, request
from app import db

from app.models import Area, AIInsights, Polygon
from flask_cors import CORS
from flask_migrate import Migrate
from server.config import Config
from app import app

import openai

import ee
ee.Initialize()


app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)
# langata area cover analysis
# langata ai insights
# polygon ai land suitability results
@app.route('/polygons/<int:polygon_id>/ai_analysis', methods=['GET'])
def analyze_polygon():
    data=request.json.get_json()
    polygon_id=data.get('polygon_id')
    coordinates = data.get('coordinates')

    # leflet coord to GEE geometry
    region = ee.Geometry.Polygon(coordinates)


