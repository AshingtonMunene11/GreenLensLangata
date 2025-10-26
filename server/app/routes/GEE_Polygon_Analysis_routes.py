from flask import Blueprint, jsonify, request
from app import db
from app.models import DevelopmentPlan, PolygonAnalysis
import ee
import re

gee_bp = Blueprint("gee", __name__)
ee.Initialize(project='serene-lotus-475317-i6')


def wkt_to_coords(wkt_str):
    """
    Convert WKT POLYGON string to list of [lon, lat] pairs for GEE.
    Example: "POLYGON((36.785 -1.334, 36.795 -1.334))"
    """
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


@gee_bp.route("/development_plans/<int:plan_id>/analysis", methods=["GET"])
def analyze_plan(plan_id):
    plan = DevelopmentPlan.query.get(plan_id)
    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    try:
        # Extract and parse the polygon geometry (assuming WKT or stored coords)
        polygon = plan.polygon

        # Example: parse if your polygon looks like "POLYGON((lng lat, lng lat, ...))"
        coordinates = polygon.replace("POLYGON((", "").replace("))", "")
        coords_list = [
            [float(c.split()[0]), float(c.split()[1])] for c in coordinates.split(", ")
        ]
        geom = ee.Geometry.Polygon([coords_list])

        # Run GEE WorldCover classification
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


@gee_bp.route("/analyze", methods=["POST"])
def analyze_polygon():
    try:
        data = request.get_json()
        dev_plan_id = data.get("development_plan_id")

        # Find the polygon linked to this development plan
        from app.models import DevelopmentPlan
        plan = DevelopmentPlan.query.get(dev_plan_id)
        polygon = plan.polygon

        coords = wkt_to_coords(polygon.coordinates)
        geometry = ee.Geometry.Polygon(coords)

        # Now run your Earth Engine analysis here...
        result = {"message": "Geometry valid, analysis started"}

        return jsonify(result), 200

    except Exception as e:
        print("Error running GEE analysis:", e)
        return jsonify({"error": str(e)}), 500
