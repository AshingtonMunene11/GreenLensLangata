from app import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates


class DevelopmentPlan(db.Model, SerializerMixin):
    __tablename__ = 'development_plans'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(25), nullable=False)

    area_size = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, default="Pending")
    # status: pending or failed or passed
    area_id = db.Column(db.Integer, db.ForeignKey('areas.id'))

    polygon_id = db.Column(db.Integer, db.ForeignKey(
        'polygons.id'), nullable=False)

    ai_results = db.Column(db.Text, nullable=True)

    area = db.relationship(
        'Area', back_populates='development_plans',)
    # user = db.relationship(
    #     'User', back_populates='development_plans', cascade='all, delete-orphan')
    polygon = db.relationship('Polygon', back_populates='development_plans')
    analysis = db.relationship(
        "PolygonAnalysis", back_populates="development_plan", uselist=False)

    serialize_rules = ('-area.station',)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'area_size': self.area_size,
            'status': self.status,
            'polygon_id': self.polygon_id,

        }

    @validates('title')
    def validate_name(self, key, title):
        if not title or len(title) < 1:
            raise ValueError("Title must be at least 1 letter")

        existing = DevelopmentPlan.query.filter_by(title=title.strip()).first()
        if existing and existing.id != getattr(self, "id", None):
            raise ValueError("Development plan title must be unique")
        return title.strip()
