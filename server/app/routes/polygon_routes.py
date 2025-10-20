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


@app.route('/polygons', method=['GET'])
def get_all_polygons():
    polygons = Polygon.query.all()
    return jsonify([polygon.to_dict() for polygon in polygons])

# @app.route('/polygons/<int:polygon_id>', methods=['GET'])
# def get_polygon(polygon_id):
#     polygon=polygon.query.get_or_404(polygon_id)

#     insights=AIinsights.query.filter_by(polygon_id==polygon_id).all()
#     plans=DevelopmentPlan.query.filter_by(polygon_id=polygon_id).all()

#     return jsonify({
#         "polygon":polygon.to_dict(),
#         "ai_insights": [insight.to_dict() for insight in insights]
#         "development_plans": [plan.to_dict() for plan in plans]
#     })


@app.route('/polygons/<int:polygon_id>', methods=['GET'])
def get_polygon(polygon_id):
    polygon = polygon.query.get_or_404(polygon_id)
    return jsonify(polygon.to_dict())


@app.route('/polygons/<int:polygon_id>/plans', methods=['POST'])
def create_plan_on_polygon(polygon_id):
    polygon = polygon.get_or_404(polygon_id)

    data = request.get_json()

    new_plan = DevelopmentPlan(
        title=data.get('title'),
        description=data.get('description'),
        type=data.get('type'),
        area_size=data.get('area_size'),
        status="Pending",
        polygon_id=polygon.id,  # links the plan to this polygon
        centroid_lat=data.get('centroid_lat'),
        centroid_long=data.get('centroid_long'),
        ai_results=data.get('ai_results', '{}')
    )

 # land cover and grade for polygon


@app.route('/polygons/<int:polygon_id>/grading', methods=['GET'])
def get_polygon_grading(polygon_id):
    polygon = polygon.query.get_or_404(polygon_id)
    insights = AIinsights.query.filter_by(area_id=polygon.area).order_by(
        AIinsights.created_at.desc()).first()

    if not insights:
        return jsonify({'message': 'No AI insights found for this polygon'}), 404

    grading = {
        "polygon_name": polygon.name,
        "tree_loss": insights.tree_loss,
        "flood_risk": insights.flood_risk,
        "heat_increase": insights.heat_increase,
        "status": "Passed" if insights.flood_risk < 0.4 and insights.tree_loss < 0.3 else "Failed"
    }

    return jsonify(grading), 200
