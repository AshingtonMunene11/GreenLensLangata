from app import db

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
import json

# db = SQLAlchemy()

class Polygon(db.Model, SerializerMixin):
    __tablename__ = 'polygons'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    coordinates = db.Column(db.Text, nullable=False)
    area = db.Column(db.Integer, db.ForeignKey('areas.id'), nullable=False)

# rships
    # insights = db.relationship(
    #     'Insights', back_populates='polygon', cascade='all, delete-orphan')
    development_plans = db.relationship(
        'DevelopmentPlan', back_populates='polygon', cascade='all, delete-orphan')

    serialize_rules = ('-area.polygons',) #'insights.polygon'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'coordinates': self.coordinates,
            'area': self.area,
        }
