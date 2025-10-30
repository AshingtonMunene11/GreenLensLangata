import os
from dotenv import load_dotenv

load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class Config:
    # Base paths
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')
    
    # BASE_DIR = os.path.abspath(os.path.dirname(__file__)) 
    # INSTANCE_DIR = os.path.join(BASE_DIR, '..', 'instance')
    # UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'static', 'uploads')

    # Database
    # SQLALCHEMY_DATABASE_URI = os.getenv("postgresql://greenlens_db2_user:coM6K760W43QzIZ1kEVmm7bQctjYa3J8@dpg-d41ek4jipnbc73fanj4g-a.oregon-postgres.render.com/greenlens_db2",
    #     "DATABASE_URI",
    #     'sqlite:///' + os.path.join(INSTANCE_DIR, 'greenlens.db')
    # )
    # SQLALCHEMY_TRACK_MODIFICATIONS = False

    _database_url = os.environ.get("DATABASE_URL")
    if _database_url and _database_url.startswith("postgres://"):
        _database_url = _database_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = _database_url or f"sqlite:///{os.path.join(INSTANCE_DIR, 'greenlens.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # Uploads
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
