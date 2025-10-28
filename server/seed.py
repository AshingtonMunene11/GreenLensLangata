from app import create_app, db
from app.models import Area, Polygon, DevelopmentPlan, AIInsights

# Create the Flask app
app = create_app()

with app.app_context():
    # Clear old data in the right order
    AIInsights.query.delete()
    DevelopmentPlan.query.delete()
    Polygon.query.delete()
    Area.query.delete()

    # --- Seed Areas ---
    area1 = Area(name="Lang'ata", polygon_id="poly001")
    area2 = Area(name="Karen", polygon_id="poly002")
    area3 = Area(name="Lavington-Kilimani Zone", polygon_id="poly003")
    area4 = Area(name="DandoraNjiru Zone", polygon_id="poly004")

    db.session.add_all([area1, area2, area3, area4])
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
    polygon3 = Polygon(
        name="Lavington-Kilimani Zone",
        coordinates="POLYGON((36.7600 -1.3150, 36.7900 -1.3150, 36.7900 -1.2950, 36.7750 -1.2850, 36.7550 -1.2900, 36.7600 -1.3150))",
        area=area3.id
    )
    polygon4 = Polygon(
        name="DandoraNjiru Zone",
        coordinates="POLYGON((36.8850 -1.2700, 36.9050 -1.2700, 36.9100 -1.2500, 36.8950 -1.2350, 36.8750 -1.2450, 36.8850 -1.2700))",
        area=area4.id
    )

    db.session.add_all([polygon1, polygon2, polygon3, polygon4])
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
    ai1 = AIInsights(
        area_id=area1.id,
        polygon_id=polygon1.id,
        tree_loss=0.2,
        flood_risk=0.1,
        heat_increase=1.5
    )
    db.session.add(ai1)
    db.session.commit()

    print("Database seeded successfully!")
