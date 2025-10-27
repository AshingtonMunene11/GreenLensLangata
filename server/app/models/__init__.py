from app.extensions import db

from .area import Area
from .development_plan import DevelopmentPlan
from .polygon import Polygon
from .report import Report
from .ai_insight import AIInsights
from .user import User  # Uncomment when ready

__all__ = [
    "db",
    "Area",
    "DevelopmentPlan",
    "Polygon",
    "Report",
    "AIInsights",
    "User"
]