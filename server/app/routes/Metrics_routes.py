from flask import Blueprint, send_from_directory
import os

metrics_bp = Blueprint("metrics_bp", __name__)
DATA_FOLDER = os.path.join(os.path.dirname(__file__), "../static_data_explore")


@metrics_bp.route('/polygons', methods=['GET'])
def get_polygons_json():
    return send_from_directory(DATA_FOLDER, 'polygons_2025_2030.json')
