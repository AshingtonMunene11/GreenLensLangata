from flask import Flask
from .extensions import db, migrate, jwt, cors
from .config import Config
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    from .routes.auth_routes import auth
    app.register_blueprint(auth, url_prefix="/api/auth")

    return app
