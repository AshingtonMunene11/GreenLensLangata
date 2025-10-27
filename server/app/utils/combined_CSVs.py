import pandas as pd
import json
import os

from sklearn.linear_model import LinearRegression

data_folder = "../static_data_explore"

tree_cover = pd.read_csv(os.path.join(data_folder, "tree_cover.csv"))
tree_cover = tree_cover.rename(
    columns={tree_cover.columns[2]: "tree_loss"})  # Tree_Cover_% → tree_loss
tree_cover = tree_cover[['Polygon_Name', 'Year', 'tree_loss']]


temperature = pd.read_csv(os.path.join(data_folder, "temperature.csv"))
# Max_Temperature_C → temperature
temperature = temperature.rename(
    columns={temperature.columns[1]: "temperature"})
temperature = temperature[['Polygon_Name', 'Year', 'temperature']]

# Load Rainfall CSV and expand for all polygons
rainfall = pd.read_csv(os.path.join(data_folder, "rainfall.csv"))
# Assume your Nairobi CSV has Rainfall_2020_mm and Rainfall_2025_mm
rainfall_values = {
    2020: float(rainfall['Rainfall_2020_mm'][0]),
    2025: float(rainfall['Rainfall_2025_mm'][0])
}

polygons = ["Langata Zone 01", "Karen Polygon",
            "Lavington-Kilimani Zone", "DandoraNjiru Zone"]
# Build long-form rainfall DataFrame
rainfall_long = pd.DataFrame([
    {'Polygon_Name': p, 'Year': y, 'rainfall': v}
    for p in polygons
    for y, v in rainfall_values.items()
])

# Merge all three 
merged = pd.merge(tree_cover, temperature, on=['Polygon_Name', 'Year'])
merged = pd.merge(merged, rainfall_long, on=['Polygon_Name', 'Year'])


# 2030 predictions 
grouped = []
for polygon_name, group in merged.groupby('Polygon_Name'):
    group = group.sort_values('Year')

    predicted = {}
    for metric in ['tree_loss', 'temperature', 'rainfall']:
        x = group['Year'].values.reshape(-1, 1)  # 2020, 2025
        y = group[metric].values
        model = LinearRegression().fit(x, y)
        pred_2030 = model.predict([[2030]])[0]
        predicted[metric] = round(pred_2030, 2)

    # Metrics array: 2025 row + 2030 predicted
    row_2025 = group[group['Year'] == 2025].iloc[0]
    metrics = [
        {
            'year': 2025,
            'tree_loss': round(row_2025['tree_loss'], 2),
            'temperature': round(row_2025['temperature'], 2),
            'rainfall': round(row_2025['rainfall'], 2)
        },
        {
            'year': 2030,
            'tree_loss': predicted['tree_loss'],
            'temperature': predicted['temperature'],
            'rainfall': predicted['rainfall']
        }
    ]

    grouped.append({
        'polygon_name': polygon_name,
        'metrics': metrics
    })

# Save JSON
output_file = os.path.join(data_folder, "polygons_2025_2030.json")
with open(output_file, "w") as f:
    json.dump(grouped, f, indent=2)

print(f"JSON with 2025 + 2030 predictions saved at {output_file}")
