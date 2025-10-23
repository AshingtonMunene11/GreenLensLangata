import models.polygon
import ee

lc = ee.ImageCollection('ESA/WorldCover/v100')

ee.Initialize(project='My First Project')


def analyze_area(geojson_coords):

    # polygon to gee coords then analyze
    geometry = ee.Geometry.Polygon(geojson_coords)

# from gee, image collection id
    data = ee.Image('ESA/WorldCover/v100')
    classified = data.clipped(geometry)
