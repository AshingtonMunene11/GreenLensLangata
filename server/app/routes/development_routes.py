from flask import Flask, jsonify, request, Blueprint
from app import db
from app.models import DevelopmentPlan, Polygon, PolygonAnalysis
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config


def register_routes(app):
    @app.route('/development_plans', methods=['GET'])
    def get_development_plans():
        """Return all development plans."""
        plans = DevelopmentPlan.query.all()
        return jsonify([plan.to_dict() for plan in plans])

    @app.route('/development_plans/<int:id>', methods=['GET'])
    def get_development_plan(id):
        """Return a specific development plan."""
        plan = DevelopmentPlan.query.get_or_404(id)
        return jsonify(plan.to_dict())

    @app.route('/development_plans', methods=['POST'])
    def create_plan():
        """Create a new development plan."""
        data = request.get_json()
        print("POST data received:", data)

        required_fields = ['title', 'description', 'type', 'area_size', 'polygon_id']
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
        """Update a development plan."""
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
            if "status" in data:
                plan.status = data['status']

            db.session.commit()
            return jsonify(plan.to_dict()), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/development_plans/<int:id>', methods=['DELETE'])
    def delete_plan(id):
        """Delete a development plan and its analyses."""
        plan = DevelopmentPlan.query.get_or_404(id)

        try:
            # Delete associated analysis (if cascade isn't set up)
            PolygonAnalysis.query.filter_by(development_plan_id=plan.id).delete()

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
        """Get the latest analysis for a development plan."""
        plan = DevelopmentPlan.query.get_or_404(id)

        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan.id
        ).order_by(PolygonAnalysis.created_at.desc()).first()

        if not analysis:
            return jsonify({
                'message': 'No analysis found for this plan',
                'plan_id': id
            }), 404

        return jsonify(analysis.to_dict()), 200

    @app.route('/')
    def index():
        """API health check."""
        return jsonify({
            "message": "GreenLensLangata API is running",
            "version": "1.0",
            "endpoints": {
                "development_plans": "/development_plans",
                "plan_analysis": "/development_plans/<id>/analysis"
            }
        }), 200
