from flask import Blueprint, request, jsonify
from ..models.user import User
from ..extensions import db
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required_fields = ["username", "email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        user = User(username=data["username"], email=data["email"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": f"{user} registered successfully"}), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": f"{user} already exists"}), 409

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and user.check_password(data["password"]):
        token = create_access_token(identity=user.id)
        return jsonify({"token": token}), 200

    return jsonify({"message": "Invalid credentials"}), 401
