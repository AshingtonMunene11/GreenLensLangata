from app import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func


class PolygonAnalysis(db.Model, SerializerMixin):
    __tablename__ = "polygon_analyses"

    id = db.Column(db.Integer, primary_key=True)

    development_plan_id = db.Column(db.Integer, db.ForeignKey(
        "development_plans.id"), nullable=False)
    development_plan = db.relationship(
        "DevelopmentPlan", backref=db.backref("analyses", lazy=True))

    polygon_id = db.Column(db.Integer, db.ForeignKey(
        "polygons.id"), nullable=False)

    # Areas in km²
    built_up_area = db.Column(db.Float, nullable=False)
    flora_area = db.Column(db.Float, nullable=False)

    # Percentages
    built_up_pct = db.Column(db.Float, nullable=False)
    flora_pct = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    # Relationship to polygon
    polygon = db.relationship(
        "Polygon", backref=db.backref("analyses", lazy=True))

    serialize_rules = ("-development_plan", "-Polygon",)

    # ---USER R/SHIP --

    # user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # user = db.relationship("User", backref=db.backref("analyses", lazy=True))

    def calculate_and_update_plan_status(self):
        """
        Automatically calculates flora loss % and updates associated DevelopmentPlan status.
        """
        plan = self.development_plan
        if self.flora_area and plan.area_size:
            flora_loss_pct = (plan.area_size / self.flora_area) * 100
            plan.status = "Pass" if flora_loss_pct <= 5 else "Fail"
        else:
            plan.status = "Unknown"
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "polygon_id": self.polygon_id,
            "built_up_area": self.built_up_area,
            "flora_area": self.flora_area,
            "built_up_pct": self.built_up_pct,
            "flora_pct": self.flora_pct,

            "created_at": self.created_at.isoformat()
        }
