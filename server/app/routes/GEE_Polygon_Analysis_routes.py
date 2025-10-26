from flask import Blueprint, jsonify, request
from app import db
from app.models import DevelopmentPlan, PolygonAnalysis, Polygon
import ee
import re

gee_bp = Blueprint("gee", __name__)
# ee.Initialize(project='serene-lotus-475317-i6')
ee_initialized = False


def init_ee():
    """Initialize Earth Engine only once."""
    global ee_initialized
    if not ee_initialized:
        try:
            ee.Initialize(project="serene-lotus-475317-i6")
            ee_initialized = True
            print("Earth Engine initialized successfully.")
        except Exception as e:
            print("Error initializing Earth Engine:", e)
            return False
    return True


@gee_bp.before_request
def ensure_ee_initialized():
    """Ensure EE is initialized before any route runs, except OPTIONS."""
    if request.method == "OPTIONS":
        return  # Skip EE init for CORS preflight
    if not init_ee():
        return jsonify({"error": "Failed to initialize Earth Engine"}), 500


def wkt_to_coords(wkt_str):

    if not wkt_str.startswith("POLYGON(("):
        raise ValueError("Invalid WKT format")

    # Extract the coordinates inside the parentheses
    coords_str = re.search(r"\(\((.*)\)\)", wkt_str).group(1)

    # Split into lon,lat pairs and convert to float
    coords = []
    for pair in coords_str.split(","):
        lon, lat = map(float, pair.strip().split())
        coords.append([lon, lat])

    return [coords]


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["GET"])
def get_analysis(plan_id):
    """Fetch saved analysis results for a development plan."""
    try:
        # Get the latest analysis for this plan
        analysis = PolygonAnalysis.query.filter_by(development_plan_id=plan_id).order_by(
            PolygonAnalysis.created_at.desc()
        ).first()

        if not analysis:
            return jsonify({"error": "No analysis found for this plan"}), 404

        return jsonify(analysis.to_dict()), 200

    except Exception as e:
        print("Error fetching analysis:", e)
        return jsonify({"error": str(e)}), 500


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["POST"])
def analyze_plan(plan_id):
    plan = DevelopmentPlan.query.get(plan_id)
    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    try:
        # Extract and parse the polygon geometry (assuming WKT or stored coords)
        polygon = plan.polygon

        try:
            coords_list = wkt_to_coords(polygon.coordinates)
            geom = ee.Geometry.Polygon(coords_list)
        except Exception as e:
            print("Invalid WKT:", polygon.coordinates)
            return jsonify({"error": "Invalid polygon geometry"}), 400

        image = ee.ImageCollection("ESA/WorldCover/v100").first().select("Map")
        clipped = image.clip(geom)
        stats = clipped.reduceRegion(
            reducer=ee.Reducer.frequencyHistogram(),
            geometry=geom,
            scale=50,
            maxPixels=1e13
        )

        hist = ee.Dictionary(stats.get("Map")).getInfo()
        total_pixels = sum(hist.values())
        built_up_pct = round(hist.get("50", 0) / total_pixels * 100, 2)
        flora_pct = round(hist.get("10", 0) / total_pixels * 100, 2)

        # Save to DB
        analysis = PolygonAnalysis(
            development_plan_id=plan.id,
            polygon_id=plan.polygon_id,
            built_up_area=plan.area_size * (built_up_pct / 100),
            flora_area=plan.area_size * (flora_pct / 100),
            built_up_pct=built_up_pct,
            flora_pct=flora_pct
        )

        db.session.add(analysis)
        db.session.commit()

        return jsonify(analysis.to_dict())

    except Exception as e:
        print("Error running GEE analysis:", e)
        return jsonify({"error": str(e)}), 500
