from flask import Flask, jsonify, request
from app import db
from app.models import Area
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

from datetime import datetime, timedelta


app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)
migrate = Migrate(app, db)

CORS(app)

# # explore pg shows lang'ata(area) analysis and ai-insights(latets, past 5 yrs)
# langataanalysis_bp = Blueprint('langataanalysis', __name__)


def register_routes(app):
    @app.route("/explore", methods=['GET'])
    def get_langataanalysis():
        langata_area = Area.query.filter_by(name="Lang'ata").first()
        if not langata_area:
            return jsonify({"error": "Lang'ata area not found"}), 404

    # ai insight-ltst
        latest_insight = (
            AIInsights.query.filter_by(area_id=langata_area.id)
            .order_by(AIInsights.created_at.desc())
            .first()
        )

        five_years_ago = datetime.utcnow() - timedelta(days=5 * 365)
        past_insights = (
            AIInsights.query.filter(
                AIInsights.area_id == langata_area.id,
                AIInsights.created_at >= five_years_ago
            )
            .order_by(AIInsights.created_at.desc())
            .all()
        )

        # combined response
        response = {
            "area_cover_analysis": langata_area.to_dict(),
            "latest_insight": latest_insight.to_dict() if latest_insight else None,
            "past_insights": [i.to_dict() for i in past_insights]

        }

        return jsonify(response)
