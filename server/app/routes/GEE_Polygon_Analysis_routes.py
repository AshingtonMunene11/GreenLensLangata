from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app import db
from app.models import DevelopmentPlan, PolygonAnalysis, Polygon, User
import ee
import re
import os
from dotenv import load_dotenv

load_dotenv()

gee_bp = Blueprint("gee", __name__)

ee_initialized = False


# def init_ee():
#     global ee_initialized
#     if not ee_initialized:
#         try:
#             ee.Initialize(project="serene-lotus-475317-i6")
#             ee_initialized = True
#             print("Earth Engine initialized successfully.")
#         except Exception as e:
#             print("Error initializing Earth Engine:", e)
#             return False
#     return True
@gee_bp.route("/test", methods=["GET"])
def test_gee_connection():
    """Simple endpoint to verify GEE authentication and access."""
    try:
        if not init_ee():
            return jsonify({"status": "error", "message": "Earth Engine not initialized"}), 500

        image = ee.Image("USGS/SRTMGL1_003")  
        info = image.getInfo()

        return jsonify({
            "status": "success",
            "message": "Earth Engine connected successfully ",
            "sample_band_keys": list(info.get("bands", [])),
            "dataset": info.get("id", "N/A")
        }), 200

    except Exception as e:
        print("GEE test error:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# def init_ee():
#     """Initialize Google Earth Engine using the service account key."""
#     global ee_initialized
#     if ee_initialized:
#         return True

#     try:
#         key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
#         if not key_path or not os.path.exists(key_path):
#             raise FileNotFoundError(f"GEE key not found at {key_path}")

#         creds = ee.ServiceAccountCredentials(None, key_path)
#         ee.Initialize(creds)
#         ee_initialized = True
#         print("Earth Engine initialized successfully with service account key.")
#         return True
#     except Exception as e:
#         print("Error initializing Earth Engine:", e)
#         return False

import json

def init_ee():
    """Initialize Google Earth Engine using the service account key."""
    global ee_initialized
    if ee_initialized:
        return True

    try:
        key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not key_path or not os.path.exists(key_path):
            raise FileNotFoundError(f"GEE key not found at {key_path}")

        # Load service account email from JSON
        with open(key_path) as f:
            service_account_info = json.load(f)
            service_account = service_account_info["client_email"]

        creds = ee.ServiceAccountCredentials(service_account, key_path)
        ee.Initialize(creds)
        ee_initialized = True
        print(f" Earth Engine initialized as {service_account}")
        return True

    except Exception as e:
        print(" Error initializing Earth Engine:", e)
        return False


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

    coords_str = re.search(r"\(\((.*)\)\)", wkt_str).group(1)
    coords = []

    for pair in coords_str.split(","):
        lon, lat = map(float, pair.strip().split())
        coords.append([lon, lat])

    return [coords]


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["GET"])
def get_analysis(plan_id):
    """Fetch saved analysis results for a development plan."""
    try:
        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan_id).first()

        if not analysis:
            return jsonify({"error": "No analysis found for this plan"}), 404

        return jsonify(analysis.to_dict()), 200

    except Exception as e:
        print("Error fetching analysis:", e)
        return jsonify({"error": str(e)}), 500


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["POST"])
def analyze_plan(plan_id):
    """Run Earth Engine analysis and save results for a development plan."""

# -------USER ID --------
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    plan = DevelopmentPlan.query.get(plan_id)
    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    try:
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

        plan_area = plan.area_size

# assuming plan is proportional to poly cover
        built_up_area = plan_area * (built_up_pct/100)
        flora_area = plan_area * (flora_pct/100)

        # impact
        flora_loss_area = flora_area

        # flora loss % of total flora
        polygon_area_ee = geom.area().divide(1e6).getInfo()
        total_flora_in_polygon = polygon_area_ee * (flora_pct / 100)
        flora_loss_pct = (flora_loss_area / total_flora_in_polygon *
                          100) if total_flora_in_polygon > 0 else 0

# built up pct after dvlpmnt
        total_built_up_in_polygon = polygon_area_ee * (built_up_pct / 100)
        new_built_up_area = total_built_up_in_polygon + plan_area
        new_built_up_pct = (new_built_up_area / polygon_area_ee * 100)

        if flora_loss_pct <= 10 and new_built_up_pct <= 60:
            status = "Pass"
        elif flora_loss_pct <= 20 and new_built_up_pct <= 70:
            status = "Pass"
        else:
            status = "Fail"

        analysis = PolygonAnalysis(
            development_plan_id=plan.id,
            polygon_id=plan.polygon_id,
            built_up_area=built_up_area,
            flora_area=flora_area,
            built_up_pct=built_up_pct,
            flora_pct=flora_pct,
            flora_loss_pct=flora_loss_pct,
            new_built_up_pct=new_built_up_pct,
            status=status,
            user_id=user_id
        )

        plan.status = status

        db.session.add(analysis)
        db.session.commit()

        result = analysis.to_dict()
        result.update({
            'status': status,
            'polygon_area': round(polygon_area_ee, 4),
            'plan_area': plan_area,
            'flora_loss_area': round(flora_loss_area, 4),
            'flora_loss_pct': round(flora_loss_pct, 2),
            'new_built_up_pct': round(new_built_up_pct, 2),
            'recommendation': get_recommendation(
                plan.type,
                flora_pct,
                flora_loss_pct,
                new_built_up_pct
            )
        })

        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()  # Rollback on error
        print("Error running GEE analysis:", e)
        return jsonify({"error": str(e)}), 500


def get_recommendation(plan_type, current_flora_pct, flora_loss_pct, new_built_up_pct):
    """Generate a recommendation based on impact metrics."""
    if flora_loss_pct > 20:
        return f" High impact: This {plan_type} development will destroy {flora_loss_pct:.1f}% of the polygon's flora. Consider reducing your project size."
    elif new_built_up_pct > 70:
        return f" Over-development: Polygon will be {new_built_up_pct:.1f}% built-up. Consider alternative locations."
    elif flora_loss_pct <= 10:
        return f"Low impact: Minimal environmental impact ({flora_loss_pct:.1f}% flora loss)."
    else:
        return f"Moderate impact: {flora_loss_pct:.1f}% flora loss. Implement mitigation measures."