from app import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func


class PolygonAnalysis(db.Model, SerializerMixin):
    __tablename__ = "polygon_analyses"

    id = db.Column(db.Integer, primary_key=True)

    development_plan_id = db.Column(db.Integer, db.ForeignKey(
        "development_plans.id"), nullable=False)

    polygon_id = db.Column(db.Integer, db.ForeignKey(
        "polygons.id"), nullable=False)

    # losses
    flora_loss_pct = db.Column(db.Float, nullable=True)
    new_built_up_pct = db.Column(db.Float, nullable=True)

    # Areas in km²
    built_up_area = db.Column(db.Float, nullable=False)
    flora_area = db.Column(db.Float, nullable=False)

    # Percentages
    built_up_pct = db.Column(db.Float, nullable=False)
    flora_pct = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    # Relationships
    polygon = db.relationship(
        "Polygon", backref=db.backref("analyses", lazy=True))
    development_plan = db.relationship(
        "DevelopmentPlan", back_populates="analysis")

    # ---USER R/SHIP --
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", backref=db.backref("analyses", lazy=True))

    serialize_rules = ("-development_plan", "-polygon", "-user",)

    def to_dict(self):
        return {
            "id": self.id,
            "polygon_id": self.polygon_id,
            "development_plan_id": self.development_plan_id,
            "built_up_area": self.built_up_area,
            "flora_area": self.flora_area,
            "built_up_pct": self.built_up_pct,
            "flora_pct": self.flora_pct,
            "flora_loss_pct": self.flora_loss_pct,
            "new_built_up_pct": self.new_built_up_pct,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat()
        }
