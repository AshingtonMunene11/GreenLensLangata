from flask import Flask, jsonify
import ee

app = Flask(__name__)

# Initialize Earth Engine
ee.Initialize(project='your-project-id')  # replace with your GEE project ID

@app.route("/areas/langata/insights", methods=["GET"])
def get_langata_insights():
    """Return land cover percentages for Langata polygon."""
    try:
        # Define Langata polygon manually (in GeoJSON format)
        langata_coords = [
            [36.7405, -1.3222],
            [36.7405, -1.3628],
            [36.7850, -1.3628],
            [36.7850, -1.3222],
            [36.7405, -1.3222]
        ]
        geometry = ee.Geometry.Polygon([langata_coords])

        # Load ESA WorldCover data (latest available)
        cover = ee.ImageCollection("ESA/WorldCover/v100").filterDate('2020-01-01', '2024-01-01')
        classification = cover.first().clip(geometry)

        # Calculate pixel counts
        stats = classification.reduceRegion(
            reducer=ee.Reducer.frequencyHistogram(),
            geometry=geometry,
            scale=30,
            maxPixels=1e13
        )

        histogram = stats.get('Map')
        if histogram is None:
            return jsonify({"error": "No data found for Langata"}), 404

        # Convert and compute percentages
        histogram = ee.Dictionary(histogram).getInfo()
        total_pixels = sum(histogram.values())

        percentages = {
            "tree_cover": round(histogram.get('10', 0) / total_pixels * 100, 2),
            "grassland": round(histogram.get('30', 0) / total_pixels * 100, 2),
            "built_up": round(histogram.get('50', 0) / total_pixels * 100, 2),
            "water": round(histogram.get('80', 0) / total_pixels * 100, 2),
        }

        return jsonify({
            "area": "Langata",
            "percentages": percentages
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
