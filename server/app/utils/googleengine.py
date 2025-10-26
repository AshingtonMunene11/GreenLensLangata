import ee

def analyze_area(geojson_coords):
    geometry = ee.Geometry.Polygon(geojson_coords)

    image = ee.Image('ESA/WorldCover/v100')

    # Clip to polygon
    classified = image.clip(geometry)

    # Get pixel counts
    stats = classified.reduceRegion(
        reducer=ee.Reducer.frequencyHistogram(),
        geometry=geometry,
        scale=10,
        maxPixels=1e12
    ).getInfo()

    return stats
