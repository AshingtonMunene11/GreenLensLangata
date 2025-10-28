from flask import Flask, jsonify
import ee
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

polygons = [
    ee.Geometry.Polygon([[36.785, -1.334], [36.795, -1.334],
                        [36.795, -1.324], [36.785, -1.324], [36.785, -1.334]]),
    ee.Geometry.Polygon([[36.710, -1.315], [36.725, -1.315],
                        [36.725, -1.300], [36.710, -1.300], [36.710, -1.315]]),
    ee.Geometry.Polygon([[36.7600, -1.3150], [36.7900, -1.3150], [36.7900, -1.2950],
                        [36.7750, -1.2850], [36.7550, -1.2900], [36.7600, -1.3150]]),
    ee.Geometry.Polygon([[36.8850, -1.2700], [36.9050, -1.2700], [36.9100, -1.2500],
                        [36.8950, -1.2350], [36.8750, -1.2450], [36.8850, -1.2700]])
]

polygon_names = [
    "Langata Zone 01",
    "Karen Polygon",
    "Lavington-Kilimani Zone",
    "DandoraNjiru Zone"
]

# fetch January max temperature for a year


def get_max_temp(year, month=1):
    dataset = ee.ImageCollection(
        "ECMWF/ERA5_LAND/MONTHLY_AGGR").select('temperature_2m')
    image = dataset.filter(ee.Filter.calendarRange(year, year, 'year')) \
                   .filter(ee.Filter.calendarRange(month, month, 'month')) \
                   .first() \
                   .subtract(273.15)  # K -> Celsius

    results = []
    for idx, poly in enumerate(polygons):
        max_temp = image.reduceRegion(
            reducer=ee.Reducer.max(),
            geometry=poly,
            scale=1000,
            maxPixels=1e13
        ).get('temperature_2m').getInfo()

        max_temp = max_temp if max_temp is None else 0
        results.append({'name': polygon_names[idx], 'max_temp': max_temp})
    return results


@app.route('/api/polygon-temperatures-ai/<int:polygon_id>', methods=["GET"])
def polygon_temperatures_ai(polygon_id):

    try:

        if polygon_id < 0 or polygon_id >= len(polygons):
            return jsonify({"error": "Invalid polygon ID"}), 400

        name = polygon_names[polygon_id]

        jan_2025 = get_max_temp(2025)
        jan_2020 = get_max_temp(2020)

        temp_2020 = jan_2020[polygon_id]['max_temp']
        temp_2025 = jan_2025[polygon_id]['max_temp']

        # Predict 2030 using linear regression
        years = np.array([2020, 2025]).reshape(-1, 1)
        temps = np.array([temp_2020, temp_2025])
        model = LinearRegression().fit(years, temps)
        pred_2030 = model.predict([[2030]])[0]

        result = {
            'polygon_id': polygon_id,
            'name': name,
            'max_temp_2020': temp_2020,
            'max_temp_2025': temp_2025,
            'temp_increase': round(temp_2025 - temp_2020, 2),
            'predicted_2030': round(pred_2030, 1)
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
