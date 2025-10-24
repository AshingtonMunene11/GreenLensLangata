from flask import Flask, jsonify, request
from app import db
from app.models import DevelopmentPlan
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

# my projects page

def register_routes(app):

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

        new_plan = DevelopmentPlan(
            title=data['title'],
            description=data['description'],
            type=data['type'],
            area_size=data['area_size'],
            polygon_id=data.get('polygon_id'),
            ai_results="Pending analysis"
        )
        db.session.add(new_plan)
        db.session.commit()
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


register_routes(app)
