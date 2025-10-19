from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates


db = SQLAlchemy()

class Area(db.Model, SerializerMixin):
    __tablename__ = 'areas'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True, unique=True)
    polygon_id = db.Column(db.String(50), nullable=False, unique=True)

    # stats
    avg_temp = db.Column(db.Float)
    green_cover = db.Column(db.Float)
    water_cover = db.Column(db.Float)
    build_cover = db.Column(db.Float)
    empty_cover = db.Column(db.Float)
    flood_risk = db.Column(db.Float)
    latest = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

# geometry field for polygons
# srid => standard lat/long
    polygon = db.Column(Geometry("POLYGON", srid=4326), nullable=False)

# rships
    development_plans = db.relationship(
        'DevelopmentPlan', back_populates='area', cascade='all, delete-orphan')
    reports = db.relationship('Report', back_populates='area', cascade='all, delete-orphan')
    ai_insights = db.relationship('AIInsight', back_populates='area', cascade='all, delete-orphan')
    development_plans = db.relationship('DevelopmentPlan', back_populates='area', cascade='all, delete-orphan')

    serialize_rules = ('-reports.area', '-ai_insights.area', '-development_plans.area')

