import ee
from shapely import wkt
from app.models import Polygon

ee.Initialize(project="serene-lotus-475317-i6")

def run_polygon_analysis(plan):
    polygon = Polygon.query.get(plan.polygon_id)
    if not polygon:
        raise ValueError("Polygon not found")

    geom = wkt.loads(polygon.coordinates)
    geometry = ee.Geometry.Polygon(list(geom.exterior.coords))

    image = ee.ImageCollection("ESA/WorldCover/v100").first().select("Map")
    clipped = image.clip(geometry)

    histogram = (
        ee.Dictionary(
            clipped.reduceRegion(
                reducer=ee.Reducer.frequencyHistogram(),
                geometry=geometry,
                scale=30,
                maxPixels=1e13,
            ).get("Map")
        )
        .getInfo()
    )

    total = sum(histogram.values()) or 1
    built_up_pct = round(histogram.get("50", 0) / total * 100, 2)
    flora_pct = round(
        (histogram.get("10", 0) + histogram.get("30", 0)) / total * 100, 2
    )

    return {
        "built_up_area": plan.area_size * (built_up_pct / 100),
        "flora_area": plan.area_size * (flora_pct / 100),
        "built_up_pct": built_up_pct,
        "flora_pct": flora_pct,
    }
