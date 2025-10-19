from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

from .ai_insight import AIinsights
from .development_plan import DevelopmentPlan
from .area import Area
from .polygon import Polygon
