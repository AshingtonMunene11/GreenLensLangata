
from flask import jsonify, request
from app import db
from app.models import PolygonAnalysis, DevelopmentPlan


def register_routes(app):

   # Fetch the latest analysis for a specific plan
    @app.route('/development_plans/<int:plan_id>/analysis', methods=['GET'])
    def get_development_plan_analysis(plan_id):
        plan = DevelopmentPlan.query.get_or_404(plan_id)

        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan.id
        ).order_by(PolygonAnalysis.created_at.desc()).first()

        if not analysis:
            return jsonify({'message': 'No analysis found for this plan'}), 404

        return jsonify({
            **analysis.to_dict(),
            "plan_id": plan.id,
            "title": plan.title,
            "status": plan.status
        })
