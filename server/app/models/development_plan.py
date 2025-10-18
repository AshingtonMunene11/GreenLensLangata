from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

db = SQLAlchemy()

class DevelopmentPlan(db.Model):
    __tablename__ = 'development_plans'

    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(80), nullable = False)
    type = db.Column(db.String(25), nullable=False)

    area_size = db.Column(db.Float, nullable=False)
    status = db.Column(db.__subclasshook__tring, default="Pending")

    polygon_id=db.Column(db.String(50), nullable=False)
    centrod_lat=db.Column(db.Float, nullable=False)
    centrod_long=db.Column(db.Float, nullable=False)

    ai_results=db.Column(db.Text(20), nullable=False)

    # rships
    user_id=db.Column(db.Integer, db.ForeignKey('users.id'))
    area_id = db.relationship('Area', back_populates='development_plans', cascade= 'all, delete-orphan')
    user_id = db.relationship('User', back_populates='development_plans', cascade= 'all, delete-orphan')



    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'area_size': self.area_size,
            'status': self.status,
            'polygon_id': self.polygon_id,
            'centrod_lat':self.centrod_lat,
            'centrod_long':self.centrod_long
        }











