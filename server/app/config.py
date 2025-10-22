import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    INSTANCE_DIR = os.path.join(BASE_DIR, '..', 'instance')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(INSTANCE_DIR, 'greenlens.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 
    SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key_here")
