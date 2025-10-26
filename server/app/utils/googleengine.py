
import ee

lc = ee.ImageCollection('ESA/WorldCover/v100')


def analyze_area(geojson_coords):

    geometry = ee.Geometry.Polygon(geojson_coords)

# from gee, image collection id
    data = ee.Image('ESA/WorldCover/v100')
    classified = data.clipped(geometry)
    return classified
