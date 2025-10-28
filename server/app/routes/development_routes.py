# from flask import Flask, jsonify, request, Blueprint
# from app import db
# from app.models import DevelopmentPlan, Polygon, PolygonAnalysis
# from flask_cors import CORS
# from flask_migrate import Migrate
# from config import Config
# import ee
# # from app.utils.analysis import run_polygon_analysis

# ee_initialized = False


# def init_ee():
#     global ee_initialized
#     if not ee_initialized:
#         try:
#             ee.Initialize(project='serene-lotus-475317-i6')
#             ee_initialized = True
#         except Exception as e:
#             print("Error initializing Earth Engine:", e)
#             return False
#     return True


# def register_routes(app):
#     @app.before_request
#     def ensure_ee_initialized():
#         if not init_ee():
#             return jsonify({"error": "Failed to initialize Earth Engine"}), 500

#     @app.route('/development_plans', methods=['GET'])
#     def get_development_plans():
#         plans = DevelopmentPlan.query.all()
#         return jsonify([plan.to_dict() for plan in plans])

#     @app.route('/development_plans/<int:id>', methods=['GET'])
#     def get_development_plan(id):
#         plan = DevelopmentPlan.query.get_or_404(id)
#         return jsonify(plan.to_dict())

#     @app.route('/development_plans', methods=['POST'])
#     def create_plan():
#         data = request.get_json()
#         print("POST data received:", data)  # debug

#         polygon_coords = data.get('geojson_coords')
#         if not polygon_coords:
#             return jsonify({'error': 'Missing polygon coordinates'}), 400

#         required_fields = ['title', 'description', 'type', 'area_size']
#         missing = [f for f in required_fields if not data.get(f)]
#         if missing:
#             return jsonify({'error': f'Missing fields: {missing}'}), 400

#         try:
#             new_plan = DevelopmentPlan(
#                 title=data['title'],
#                 description=data['description'],
#                 type=data['type'],
#                 area_size=data['area_size'],
#                 polygon_id=data.get('polygon_id'),
#                 status="Pending"
#             )
#             db.session.add(new_plan)
#             db.session.commit()
#             return jsonify(new_plan.to_dict()), 201

#         except Exception as e:
#             print("Error creating plan:", e)
#             return jsonify({'error': str(e)}), 500

#     @app.route('/development_plans/<int:id>', methods=['PATCH'])
#     def update_plan(id):
#         plan = DevelopmentPlan.query.get_or_404(id)
#         data = request.get_json()
#         if "title" in data:
#             plan.title = data['title']
#         if "description" in data:
#             plan.description = data['description']
#         if "type" in data:
#             plan.type = data['type']
#         if "area_size" in data:
#             plan.area_size = data['area_size']
#         db.session.commit()
#         return jsonify(plan.to_dict())

#     @app.route('/development_plans/<int:id>', methods=['DELETE'])
#     def delete_plan(id):
#         # Fetch the plan or return 404 if it doesn't exist
#         plan = DevelopmentPlan.query.get_or_404(id)

#         try:
#             # Delete associated analysis first (optional, depends on cascade)
#             PolygonAnalysis.query.filter_by(
#                 development_plan_id=plan.id).delete()

#             # Delete the plan
#             db.session.delete(plan)
#             db.session.commit()

#             return jsonify({'message': f'Development plan {id} deleted successfully'}), 200

#         except Exception as e:
#             db.session.rollback()
#             return jsonify({'error': f'Failed to delete plan: {str(e)}'}), 500

#     # make sure this model is imported at the top

#     @app.route('/development_plans/<int:id>/analysis', methods=['GET'])
#     def get_plan_analysis(id):
#         plan = DevelopmentPlan.query.get_or_404(id)

#         # Get latest analysis for this plan
#         analysis = PolygonAnalysis.query.filter_by(development_plan_id=plan.id)\
#             .order_by(PolygonAnalysis.created_at.desc()).first()

#         if not analysis:
#             return jsonify({'message': 'No analysis found for this plan'}), 404

#         # Optionally update plan status based on analysis
#         flora_loss_pct = (plan.area_size / analysis.flora_area) * 100
#         plan.status = "Pass" if flora_loss_pct <= 5 else "Fail"
#         db.session.commit()

#         return jsonify({
#             **analysis.to_dict(),
#             "status": plan.status,
#             "flora_loss_pct": flora_loss_pct
#         }), 200

#     @app.route("/development_plans/<int:plan_id>/update_status", methods=["PATCH"])
#     def update_plan_status(plan_id):
#         plan = DevelopmentPlan.query.get_or_404(plan_id)
#         data = request.get_json()
#         status = data.get("status")

#         if status not in ["Pending", "Pass", "Fail"]:
#             return jsonify({"error": "Invalid status"}), 400

#         plan.status = status
#         db.session.commit()

#         return jsonify(plan.to_dict()), 200

#     @app.route('/development_plans/all', methods=['GET'])
#     def get_all_development_plans():
#         # Sort by creation date descending
#         plans = DevelopmentPlan.query.order_by(
#             DevelopmentPlan.created_at.desc()).all()
#         return jsonify([plan.to_dict() for plan in plans])

#     @app.route('/')
#     def index():
#         return jsonify({"message": "GreenLensLangata API is running"}), 200


# # register_routes(app)
from flask import Flask, jsonify, request, Blueprint
from app import db
from app.models import DevelopmentPlan, Polygon, PolygonAnalysis
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
import ee

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
        print("POST data received:", data)

        required_fields = ['title', 'description',
                           'type', 'area_size', 'polygon_id']
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({'error': f'Missing fields: {missing}'}), 400

        try:
            new_plan = DevelopmentPlan(
                title=data['title'],
                description=data['description'],
                type=data['type'],
                area_size=float(data['area_size']),
                polygon_id=data['polygon_id'],
                status="Pending"
            )
            db.session.add(new_plan)
            db.session.commit()
            return jsonify(new_plan.to_dict()), 201

        except Exception as e:
            db.session.rollback()
            print("Error creating plan:", e)
            return jsonify({'error': str(e)}), 500

    @app.route('/development_plans/<int:id>', methods=['PATCH'])
    def update_plan(id):

        plan = DevelopmentPlan.query.get_or_404(id)
        data = request.get_json()

        try:
            if "title" in data:
                plan.title = data['title']
            if "description" in data:
                plan.description = data['description']
            if "type" in data:
                plan.type = data['type']
            if "area_size" in data:
                plan.area_size = float(data['area_size'])

            db.session.commit()
            return jsonify(plan.to_dict()), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/development_plans/<int:id>', methods=['DELETE'])
    def delete_plan(id):
        plan = DevelopmentPlan.query.get_or_404(id)

        try:
            # Delete associated analysis (if cascade isn't set up)
            PolygonAnalysis.query.filter_by(
                development_plan_id=plan.id
            ).delete()

            # Delete the plan
            db.session.delete(plan)
            db.session.commit()

            return jsonify({
                'message': f'Development plan {id} deleted successfully'
            }), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to delete plan: {str(e)}'}), 500

    @app.route('/development_plans/<int:id>/analysis', methods=['GET'])
    def get_plan_analysis(id):
        """
        Get the latest analysis for a development plan.
        This route is for fetching existing analysis data.
        Use POST /gee/development_plans/<id>/analyze to run new analysis.
        """
        plan = DevelopmentPlan.query.get_or_404(id)

        # Get latest analysis for this plan
        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan.id
        ).order_by(PolygonAnalysis.created_at.desc()).first()

        if not analysis:
            return jsonify({
                'message': 'No analysis found for this plan',
                'plan_id': id
            }), 404

        # Return analysis data (status is already in the analysis from GEE route)
        return jsonify(analysis.to_dict()), 200

    @app.route('/')
    def index():
        """API health check."""
        return jsonify({
            "message": "GreenLensLangata API is running",
            "version": "1.0",
            "endpoints": {
                "development_plans": "/development_plans",
                "gee_analysis": "/gee/development_plans/<id>/analyze"
            }
        }), 200
