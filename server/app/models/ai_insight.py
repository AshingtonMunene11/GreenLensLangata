from app import db

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime


# db = SQLAlchemy()

class AIInsights(db.Model, SerializerMixin):
    __tablename__ = 'aiinsights'

    id = db.Column(db.Integer, primary_key = True)
    area_id = db.Column(db.Integer, db.ForeignKey('areas.id'), nullable=False)
    polygon_id = db.Column(db.Integer, db.ForeignKey('polygons.id'), nullable=True)
    tree_loss = db.Column(db.Float)
    flood_risk = db.Column(db.Float)
    heat_increase = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # rship to area
    area = db.relationship('Area', back_populates='ai_insights')
    polygon = db.relationship('Polygon', back_populates='ai_insights')

    serialize_rules=('-area.ai_insights','-polygon.ai_insights')

    def to_dict(self):
        return {
            'id':self.id,
            'area_id':self.area_id,
            'polygon_id': self.polygon_id,
            'tree_loss':self.tree_loss,
            'flood_risk':self.flood_risk,
            'heat_increase':self.heat_increase,
            'created_at':self.created_at.isoformat()
        }

