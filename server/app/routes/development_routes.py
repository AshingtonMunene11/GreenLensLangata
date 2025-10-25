from flask import Flask, jsonify, request
from app import db
from app.models import DevelopmentPlan
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
import ee


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)


ee_initialized = False


def init_ee():
    global ee_initialized
    if not ee_initialized:
        try:
            ee.Initialize(project='serene-lotus-475317-i6')
            ee_initialized = True
        except Exception as e:
            print("Error initializing Earth Engine:", e)
            return False
    return True


def register_routes(app):
    @app.before_request
    def ensure_ee_initialized():
        if not init_ee():
            return jsonify({"error": "Failed to initialize Earth Engine"}), 500

    @app.route('/development_plans', methods=['GET'])
    def get_development_plans():
        plans = DevelopmentPlan.query.all()
        return jsonify([plan.to_dict() for plan in plans])

    @app.route('/development_plans/<int:id>', methods=['GET'])
    def get_development_plan(id):
        plan = DevelopmentPlan.query.get_or_404(id)
        return jsonify(plan.to_dict())

    @app.route('/development_plans', methods=['POST'])
    def create_plan():
        data = request.get_json()
        polygon_coords = data.get('geojson_coords')
        if not polygon_coords:
            return jsonify({'error': 'Missing polygon coordinates'}), 400

        # Create plan with Pending status
        new_plan = DevelopmentPlan(
            title=data['title'],
            description=data['description'],
            type=data['type'],
            area_size=data['area_size'],
            polygon_id=data.get('polygon_id'),
            # results="Pending analysis",
            status="Pending"
        )
        db.session.add(new_plan)
        db.session.commit()  # Commit first so we have an ID

        try:
            # Convert GeoJSON coordinates to ee.Geometry.Polygon
            geometry = ee.Geometry.Polygon(polygon_coords)

            # Load ESA WorldCover
            landcover = ee.Image('ESA/WorldCover/v100').select('Map')

            # Built-up area (code 50)
            built_up_mask = landcover.eq(50)
            built_up_area_m2 = built_up_mask.multiply(ee.Image.pixelArea()) \
                .reduceRegion(reducer=ee.Reducer.sum(),
                              geometry=geometry,
                              scale=10,
                              maxPixels=1e12).get('Map')
            built_up_area_km2 = float(
                ee.Number(built_up_area_m2).getInfo() or 0) / 1e6

            # Flora area (tree 10, grass 30, water 80)
            flora_mask = landcover.eq(10).Or(
                landcover.eq(30)).Or(landcover.eq(80))
            flora_area_m2 = flora_mask.multiply(ee.Image.pixelArea()) \
                .reduceRegion(reducer=ee.Reducer.sum(),
                              geometry=geometry,
                              scale=10,
                              maxPixels=1e12).get('Map')
            flora_area_km2 = float(
                ee.Number(flora_area_m2).getInfo() or 0) / 1e6

            # Calculate percentages
            total_area_km2 = new_plan.area_size
            built_up_pct = (built_up_area_km2 / total_area_km2) * 100
            flora_pct = (flora_area_km2 / total_area_km2) * 100

            # Determine Pass/Fail based on flora loss <= 5%
            flora_loss_pct = (total_area_km2 / flora_area_km2) * \
                100 if flora_area_km2 > 0 else 100
            status = "Pass" if flora_loss_pct <= 5 else "Fail"
            new_plan.status = status

            # Save analysis to PolygonAnalysis table
            analysis = PolygonAnalysis(
                development_plan_id=new_plan.id,
                polygon_id=new_plan.polygon_id,
                built_up_area=built_up_area_km2,
                flora_area=flora_area_km2,
                built_up_pct=built_up_pct,
                flora_pct=flora_pct
            )
            db.session.add(analysis)
            db.session.commit()

        except Exception as e:
            print("Error running GEE analysis:", e)
            new_plan.status = "Error"
            db.session.commit()

        # Return plan immediately with final status
        return jsonify(new_plan.to_dict()), 201

    @app.route('/development_plans/<int:id>', methods=['PATCH'])
    def update_plan(id):
        plan = DevelopmentPlan.query.get_or_404(id)
        data = request.get_json()
        if "title" in data:
            plan.title = data['title']
        if "description" in data:
            plan.description = data['description']
        if "type" in data:
            plan.type = data['type']
        if "area_size" in data:
            plan.area_size = data['area_size']
        db.session.commit()
        return jsonify(plan.to_dict())

    @app.route('/development_plans/<int:id>', methods=['DELETE'])
    def delete_plan(id):
        plan = DevelopmentPlan.query.get_or_404(id)
        db.session.delete(plan)
        db.session.commit()
        return jsonify({'message': f'Development plan deleted'}), 200

    # make sure this model is imported at the top
    from app.models import PolygonAnalysis

    @app.route('/development_plans/<int:id>/analysis', methods=['GET'])
    def get_plan_analysis(id):
        plan = DevelopmentPlan.query.get_or_404(id)

        # Get latest analysis for this plan
        analysis = PolygonAnalysis.query.filter_by(development_plan_id=plan.id)\
            .order_by(PolygonAnalysis.created_at.desc()).first()

        if not analysis:
            return jsonify({'message': 'No analysis found for this plan'}), 404

        # Optionally update plan status based on analysis
        flora_loss_pct = (plan.area_size / analysis.flora_area) * 100
        plan.status = "Pass" if flora_loss_pct <= 5 else "Fail"
        db.session.commit()

        return jsonify({
            **analysis.to_dict(),
            "status": plan.status,
            "flora_loss_pct": flora_loss_pct
        }), 200

    @app.route("/development_plans/<int:plan_id>/update_status", methods=["PATCH"])
    def update_plan_status(plan_id):
        plan = DevelopmentPlan.query.get_or_404(plan_id)
        data = request.get_json()
        status = data.get("status")

        if status not in ["Pending", "Pass", "Fail"]:
            return jsonify({"error": "Invalid status"}), 400

        plan.status = status
        db.session.commit()

        return jsonify(plan.to_dict()), 200

    @app.route('/development_plans/all', methods=['GET'])
    def get_all_development_plans():
        # Sort by creation date descending
        plans = DevelopmentPlan.query.order_by(
            DevelopmentPlan.created_at.desc()).all()
        return jsonify([plan.to_dict() for plan in plans])


register_routes(app)
