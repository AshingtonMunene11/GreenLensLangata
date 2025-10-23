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


# SUGGESTED ROUTE:
from flask import request, jsonify
from app import app
import ee

# Initialize GEE
ee.Initialize()

@app.route("/analyze-polygon", methods=["POST"])
def analyze_polygon():
    data = request.get_json()
    coordinates = data.get("coordinates")

    if not coordinates:
        return jsonify({"error": "No coordinates provided"}), 400

    # Convert to GEE polygon
    geom = ee.Geometry.Polygon(coordinates)

    # Example analysis (you’ll replace with your actual logic)
    landcover = ee.Image("ESA/WorldCover/v100").select('ADM2_NAME')
    flood = ee.Image("JRC/GSW1_3/YearlyRecurrence").select('occurrence')

    # Sample flood & vegetation stats
    flood_mean = flood.reduceRegion(
        reducer=ee.Reducer.mean(), geometry=geom, scale=1000, maxPixels=1e9
    )
    landcover_mode = landcover.reduceRegion(
        reducer=ee.Reducer.mode(), geometry=geom, scale=500, maxPixels=1e9
    )

    flood_risk = flood_mean.getInfo().get('occurrence', 0)
    land_type = landcover_mode.getInfo().get('Land_Cover_Type_1', 0)

    # Example AI insight-like summary
    return jsonify({
        "flood_risk": round(float(flood_risk), 2),
        "tree_loss": 0.25,
        "heat_increase": 0.18,
        "status": "Passed" if flood_risk < 0.4 else "Failed"
    })

# Get area2 from form
# what does area2 displace on polygon area2
# if tree loss > 0.52% fail else pass