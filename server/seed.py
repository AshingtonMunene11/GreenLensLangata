from app import create_app, db
from app.models import Area, Polygon, DevelopmentPlan, AIInsights

# Create the Flask app
app = create_app()

with app.app_context():
    Area.query.delete()
    Polygon.query.delete()
    DevelopmentPlan.query.delete()
    AIInsights.query.delete()

    # --- Seed Areas ---
    area1 = Area(name="Lang'ata", polygon_id="poly001")
    area2 = Area(name="Karen", polygon_id="poly002")
    db.session.add_all([area1, area2])
    db.session.commit()

    # --- Seed Polygons ---
    polygon1 = Polygon(
        name="Langata Zone 01 Polygon",
        coordinates="POLYGON((36.785 -1.334, 36.795 -1.334, 36.795 -1.324, 36.785 -1.324, 36.785 -1.334))",
        area=area1.id
    )
    polygon2 = Polygon(
        name="Karen Polygon",
        coordinates="POLYGON((36.710 -1.315, 36.725 -1.315, 36.725 -1.300, 36.710 -1.300, 36.710 -1.315))",
        area=area2.id
    )
    db.session.add_all([polygon1, polygon2])
    db.session.commit()

    # --- Seed Development Plan ---
    plan1 = DevelopmentPlan(
        title="Road Expansion",
        description="Expand the main road",
        type="Infrastructure",
        area_size=2.5,
        status="Pending",
        area_id=area1.id,
        polygon_id=polygon1.id,
        centroid_lat=-1.329,
        centroid_long=36.790,
        ai_results="{}"
    )
    db.session.add(plan1)
    db.session.commit()

    # --- Seed AI Insights ---
    ai1 = AIInsights(area_id=area1.id, polygon_id=polygon1.id, tree_loss=0.2, flood_risk=0.1, heat_increase=1.5)
    db.session.add(ai1)
    db.session.commit()
