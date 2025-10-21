from flask import Flask, jsonify, request
from models import db, DevelopmentPlan, Polygon, AIInsights
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from app import app

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)


@app.route('/polygons', methods=['GET'])
def get_all_polygons():
    polygons = Polygon.query.all()
    return jsonify([polygon.to_dict() for polygon in polygons])


@app.route('/polygons/<int:polygon_id>', methods=['GET'])
def get_polygon(polygon_id):
    polygon = Polygon.query.get_or_404(polygon_id)
    return jsonify(polygon.to_dict())


@app.route('/polygons/<int:polygon_id>/plans', methods=['POST'])
def create_plan_on_polygon(polygon_id):
    polygon = Polygon.get_or_404(polygon_id)

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
    db.session.add(new_plan)
    db.session.commit()

    return jsonify(new_plan.to_dict())

 # land cover and grade for polygon
@app.route('/polygons/<int:polygon_id>/grading', methods=['GET'])
def get_polygon_grading(polygon_id):

    polygon = Polygon.query.get_or_404(polygon_id)
    insights = AIInsights.query.filter_by(area_id=polygon.area).order_by(
        AIInsights.created_at.desc()).first()

    if not insights:
        return jsonify({'message': 'No AI insights found for this polygon'}), 404

    grading = {
        "polygon_name": polygon.name,
        "tree_loss": insights.tree_loss,
        "flood_risk": insights.flood_risk,
        "heat_increase": insights.heat_increase,
        "status": "Passed" if insights.flood_risk < 0.2 and insights.tree_loss < 0.1 else "Failed"
    }

    return jsonify(grading), 200
