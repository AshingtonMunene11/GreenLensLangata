from flask import Blueprint, request, jsonify, url_for, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app.models.report import db, Report
from app.models.user import User
import os

community_bp = Blueprint("community", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "static", "uploads")
UPLOAD_FOLDER = os.path.normpath(UPLOAD_FOLDER)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# CREATE a new report
@community_bp.route("/reports", methods=["POST"])
def create_report():
    title = request.form.get("title")
    description = request.form.get("description")
    location = request.form.get("location")
    image_url = request.form.get("image_url")
    user_id = request.form.get("user_id")
    username = request.form.get("username")

    if not title or not description or not location:
        return jsonify({"error": "Title, description, and location are required"}), 400

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not username:
        username = user.username

    public_image_url = None
    if "image_file" in request.files:
        file = request.files["image_file"]
        if file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            public_image_url = url_for("static", filename=f"uploads/{filename}", _external=True)

    new_report = Report(
        title=title,
        description=description,
        location=location,
        image_url=image_url if image_url else public_image_url,
        user_id=user_id,
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({
        "message": "Post created successfully",
        "report": {
            "id": new_report.id,
            "title": new_report.title,
            "description": new_report.description,
            "location": new_report.location,
            "image_url": new_report.image_url,
            "user_id": new_report.user_id,
            "username": username,
            "created_at": new_report.created_at,
        }
    }), 201


# GET all reports
@community_bp.route("/reports", methods=["GET"])
def get_reports():
    reports = Report.query.order_by(Report.created_at.desc()).all()
    data = []

    for r in reports:
        user = User.query.get(r.user_id)
        username = user.username if user else "Anonymous"
        data.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "location": r.location,
            "image_url": r.image_url,
            "user_id": r.user_id,
            "username": username,
            "created_at": r.created_at,
        })

    return jsonify(data), 200


# GET single report
@community_bp.route("/reports/<int:id>", methods=["GET"])
def get_report(id):
    report = Report.query.get(id)
    if not report:
        return jsonify({"error": "Post not found"}), 404

    user = User.query.get(report.user_id)
    username = user.username if user else "Anonymous"

    return jsonify({
        "id": report.id,
        "title": report.title,
        "description": report.description,
        "location": report.location,
        "image_url": report.image_url,
        "user_id": report.user_id,
        "username": username,
        "created_at": report.created_at,
    }), 200


# UPDATE a report
@community_bp.route("/reports/<int:id>", methods=["PUT"])
def update_report(id):
    report = Report.query.get(id)
    if not report:
        return jsonify({"error": "Post not found"}), 404

    data = request.form
    report.title = data.get("title", report.title)
    report.description = data.get("description", report.description)
    report.location = data.get("location", report.location)

    if "image_file" in request.files:
        file = request.files["image_file"]
        if file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            report.image_url = url_for("static", filename=f"uploads/{filename}", _external=True)
    elif data.get("image_url"):
        report.image_url = data.get("image_url")

    db.session.commit()
    return jsonify({"message": "Post updated successfully"}), 200


# DELETE a report
@community_bp.route("/reports/<int:id>", methods=["DELETE"])
def delete_report(id):
    report = Report.query.get(id)
    if not report:
        return jsonify({"error": "Post not found"}), 404

    db.session.delete(report)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200

def register_community_routes(app):
    app.register_blueprint(community_bp)
