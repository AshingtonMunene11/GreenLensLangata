from flask import jsonify
from flask_cors import CORS
from app import db
from app.models import Area
import ee
import math

# ee.Initialize(project='serene-lotus-475317-i6')

def register_langata_routes(app):
    """Attach Langata/Nairobi insights routes to the main Flask app."""
    CORS(app)

    @app.route("/areas/langata/insights", methods=["GET"])
    def get_langata_insights():
        try:
            #  Nairobi geometry using GAUL admin boundaries
            nairobi_fc = ee.FeatureCollection("FAO/GAUL/2015/level2") \
                .filter(ee.Filter.eq('ADM0_NAME', 'Kenya')) \
                .filter(ee.Filter.eq('ADM2_NAME', 'Nairobi'))
            geometry = nairobi_fc.geometry()

            image = ee.ImageCollection(
                "ESA/WorldCover/v100").first().select('Map')
            
            clipped = image.clip(geometry)

            # Compute histogram
            histogram_dict = ee.Dictionary(
                clipped.reduceRegion(
                    reducer=ee.Reducer.frequencyHistogram(),
                    geometry=geometry,
                    scale=50,
                    maxPixels=1e13
                ).get('Map')
            )

            # Sum of all pixels
            total_pixels = ee.Number(
                histogram_dict.values().reduce(ee.Reducer.sum()))

# round
            def percent_round_up(value):
                return math.ceil(value * 10) / 10

            percentages = {
                "tree_cover": percent_round_up(
                    ee.Number(histogram_dict.get('10', 0)).divide(
                        total_pixels).multiply(100).getInfo()
                ),
                "grassland": percent_round_up(
                    ee.Number(histogram_dict.get('30', 0)).divide(
                        total_pixels).multiply(100).getInfo()
                ),
                "built_up": percent_round_up(
                    ee.Number(histogram_dict.get('50', 0)).divide(
                        total_pixels).multiply(100).getInfo()
                ),
                "water": percent_round_up(
                    ee.Number(histogram_dict.get('80', 0)).divide(
                        total_pixels).multiply(100).getInfo()
                ),
            }

            return jsonify({
                "area": "Langata/Nairobi",
                "percentages": percentages
            })

        except Exception as e:
            return jsonify({"error": str(e)}), 500
