from flask import Flask, jsonify
import ee
import numpy as np
from sklearn.linear_model import LinearRegression

# Initialize GEE
ee.Initialize()

app = Flask(__name__)

# Define polygons
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

# Helper: fetch January max temperature for a year


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
        results.append({'name': polygon_names[idx], 'max_temp': max_temp})
    return results

# Flask route for AI API


@app.route('/api/polygon-temperatures-ai')
def polygon_temperatures_ai():
    jan_2025 = get_max_temp(2025)
    jan_2020 = get_max_temp(2020)

    merged = []
    for i in range(len(polygon_names)):
        # Linear regression to predict 2030 temperature
        years = np.array([2020, 2025]).reshape(-1, 1)
        temps = np.array([jan_2020[i]['max_temp'], jan_2025[i]['max_temp']])
        model = LinearRegression().fit(years, temps)
        pred_2030 = model.predict([[2030]])[0]

        merged.append({
            'name': polygon_names[i],
            'max_temp_2025': jan_2025[i]['max_temp'],
            'max_temp_2020': jan_2020[i]['max_temp'],
            'temp_increase': jan_2025[i]['max_temp'] - jan_2020[i]['max_temp'],
            'predicted_2030': round(pred_2030, 1)
        })

    return jsonify(merged)


if __name__ == "__main__":
    app.run(debug=True)
