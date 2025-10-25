# from flask import jsonify, request
# from app import db
# from app.models import PolygonAnalysis, DevelopmentPlan


# def register_routes(app):

#     @app.route("/analyses", methods=["POST"])
#     def create_analysis():
#         data = request.get_json()
#         plan_id = data.get("plan_id")
#         built_up_area = data.get("built_up_area")
#         flora_area = data.get("flora_area")
#         built_up_pct = data.get("built_up_pct", 0)
#         flora_pct = data.get("flora_pct", 0)

#         plan = DevelopmentPlan.query.get_or_404(plan_id)

#         new_analysis = PolygonAnalysis(
#             development_plan_id=plan.id,
#             polygon_id=plan.polygon_id,
#             built_up_area=built_up_area,
#             flora_area=flora_area,
#             built_up_pct=built_up_pct,
#             flora_pct=flora_pct
#         )

#         db.session.add(new_analysis)
#         db.session.commit()

#         new_analysis.calculate_and_update_plan_status()

#         return jsonify(new_analysis.to_dict()), 201

#     #  analysis for a specific  plan + test

#     @app.route('/development_plans/<int:plan_id>/analysis', methods=['GET'])
#     def get_development_plan_analysis(plan_id):
#         plan = DevelopmentPlan.query.get_or_404(plan_id)

#         analysis = PolygonAnalysis.query.filter_by(
#             development_plan_id=plan.id
#         ).order_by(PolygonAnalysis.created_at.desc()).first()

#         if not analysis:
#             return jsonify({'message': 'No analysis found for this plan'}), 404

#         analysis.calculate_and_update_plan_status()

#         flora_loss_pct = None
#         if analysis.flora_area and plan.area_size:
#             flora_loss_pct = (plan.area_size / analysis.flora_area) * 100
#         #     plan.status = "Pass" if flora_loss_pct <= 5 else "Fail"
#         # else:
#         #     plan.status = "Unknown"

#         # db.session.commit()

#         return jsonify({
#             "plan_id": plan.id,
#             "title": plan.title,
#             "flora_area": analysis.flora_area,
#             "built_up_area": analysis.built_up_area,
#             "flora_loss_pct": flora_loss_pct,
#             "status": plan.status
#         })
from flask import jsonify, request
from app import db
from app.models import PolygonAnalysis, DevelopmentPlan


def register_routes(app):

    # Create a new analysis and automatically update plan status
    @app.route("/analyses", methods=["POST"])
    def create_analysis():
        data = request.get_json()
        plan_id = data.get("plan_id")
        built_up_area = data.get("built_up_area")
        flora_area = data.get("flora_area")
        built_up_pct = data.get("built_up_pct", 0)
        flora_pct = data.get("flora_pct", 0)

        # Ensure plan exists
        plan = DevelopmentPlan.query.get_or_404(plan_id)

        # Create the new analysis record
        new_analysis = PolygonAnalysis(
            development_plan_id=plan.id,
            polygon_id=plan.polygon_id,
            built_up_area=built_up_area,
            flora_area=flora_area,
            built_up_pct=built_up_pct,
            flora_pct=flora_pct
        )

        # Calculate flora loss percentage
        flora_loss_pct = max(0, 100 - flora_pct)

        # Logic to determine pass/fail/warning
        if flora_loss_pct > 30 or built_up_pct > 50:
            plan.status = "Fail"
        elif flora_loss_pct > 10:
            plan.status = "Warning"
        else:
            plan.status = "Pass"

        # Save both analysis + updated plan
        db.session.add(new_analysis)
        db.session.add(plan)
        db.session.commit()

        return jsonify({
            "id": new_analysis.id,
            "plan_id": plan.id,
            "polygon_id": plan.polygon_id,
            "built_up_area": built_up_area,
            "flora_area": flora_area,
            "built_up_pct": built_up_pct,
            "flora_pct": flora_pct,
            "status": plan.status
        }), 201

    # Fetch the latest analysis for a specific plan
    @app.route('/development_plans/<int:plan_id>/analysis', methods=['GET'])
    def get_development_plan_analysis(plan_id):
        plan = DevelopmentPlan.query.get_or_404(plan_id)

        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan.id
        ).order_by(PolygonAnalysis.created_at.desc()).first()

        if not analysis:
            return jsonify({'message': 'No analysis found for this plan'}), 404

        # Calculate loss
        flora_loss_pct = None
        if analysis.flora_area and plan.area_size:
            flora_loss_pct = (plan.area_size / analysis.flora_area) * 100

        return jsonify({
            "plan_id": plan.id,
            "title": plan.title,
            "flora_area": analysis.flora_area,
            "built_up_area": analysis.built_up_area,
            "flora_loss_pct": flora_loss_pct,
            "status": plan.status
        })
