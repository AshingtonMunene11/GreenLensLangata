// --------- DOCUMENTING PURPOSES ONLY ------ DOESN'T RUN IN VSCODE
// Map.addLayer(area3)
var ADM0_NAME = 'Kenya';
var COUNTY = 'Nairobi';

var selected = area3
  .filter(ee.Filter.eq('ADM0_NAME', ADM0_NAME))
  .filter(ee.Filter.eq('ADM2_NAME', COUNTY));

// zoom to nrbi
var geometry=selected.geometry();
Map.centerObject(geometry);
Map.addLayer(selected);

// Load ESA World cover data
// cover 1
print(NairobiCover)

var filtered = NairobiCover.filter(ee.Filter.date('2020-01-01', '2024-01-01'));
print(filtered)

// cover classsification(tree, water etc.)
var classification = ee.Image(filtered.first());
print(classification)

// clip to geometry(nairobi)
var clipped = classification.clip(geometry);
Map.addLayer(clipped);

// export data
Export.image.toDrive({
  image: clipped, 
  description: 'export_image',
  folder: 'EarthEngine', 
  fileNamePrefix: 'classification_raw',
  region: geometry, 
  scale: 10,
  maxPixels: 1e10})