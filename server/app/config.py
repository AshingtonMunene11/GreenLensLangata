import os
from dotenv import load_dotenv

load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class Config:
    # Base paths
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    INSTANCE_DIR = os.path.join(BASE_DIR, '..', 'instance')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'static', 'uploads')

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URI",
        'sqlite:///' + os.path.join(INSTANCE_DIR, 'greenlens.db')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Uploads
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
