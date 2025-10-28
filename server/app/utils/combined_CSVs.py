import os
import pandas as pd
import json
from sklearn.linear_model import LinearRegression

# Folder where CSVs are stored
data_folder = os.path.join(os.path.dirname(__file__), "../static_data_explore")

# Read CSVs
tree_cover = pd.read_csv(os.path.join(data_folder, "Tree_Cover_2020_2025.csv"))
temperature = pd.read_csv(os.path.join(data_folder, "Nairobi_Temperature_2020_2025.csv"))
rainfall = pd.read_csv(os.path.join(data_folder, "Nairobi_Rainfall_Stats.csv"))

# Generate JSON
polygons_json = []

for polygon in tree_cover['Polygon_Name'].unique():
    poly_dict = {"polygon_name": polygon, "metrics": []}

    # Tree cover & temperature data for 2020 and 2025
    tree_data = tree_cover[tree_cover['Polygon_Name'] == polygon]
    temp_data = temperature[temperature['Polygon_Name'] == polygon]

    tree_2020 = float(tree_data[tree_data['Year'] == 2020]['Tree_Cover_%'].values[0])
    tree_2025 = float(tree_data[tree_data['Year'] == 2025]['Tree_Cover_%'].values[0])
    temp_2020 = float(temp_data[temp_data['Year'] == 2020]['Max_Temperature_C'].values[0])
    temp_2025 = float(temp_data[temp_data['Year'] == 2025]['Max_Temperature_C'].values[0])

    # Linear regression to predict 2030
    model_tree = LinearRegression().fit([[2020],[2025]], [[tree_2020],[tree_2025]])
    model_temp = LinearRegression().fit([[2020],[2025]], [[temp_2020],[temp_2025]])

    tree_2030 = model_tree.predict([[2030]])[0][0]
    temp_2030 = model_temp.predict([[2030]])[0][0]

    # Rainfall 
    rainfall_2025 = float(rainfall['Rainfall_2025_mm'].values[0])
    rainfall_2030 = rainfall_2025 * 1.05  # example 5% increase

    # Append 2025 metrics
    poly_dict['metrics'].append({
        "year": 2025,
        "tree_loss": tree_2025,
        "temperature": temp_2025,
        "rainfall": rainfall_2025
    })

    # Append 2030 metrics
    poly_dict['metrics'].append({
        "year": 2030,
        "tree_loss": tree_2030,
        "temperature": temp_2030,
        "rainfall": rainfall_2030
    })

    polygons_json.append(poly_dict)


# Save JSON
output_file = os.path.join(data_folder, "polygons_2025_2030.json")
with open(output_file, 'w') as f:
    json.dump(polygons_json, f, indent=2)

print("JSON created at:", output_file)
