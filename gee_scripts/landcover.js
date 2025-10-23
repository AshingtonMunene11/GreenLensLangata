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

// Calc tree loss per polygon
var worldCover = ee.Image("ESA/WorldCover/v200/2021");

var polygonOne = ee.Geometry.Polygon([
  [36.8250, -1.3200],
  [36.8500, -1.3200],
  [36.8600, -1.3050],
  [36.8450, -1.2850],
  [36.8200, -1.2950],
  [36.8250, -1.3200]
]);

var polygonOne_km2 = polygonOne.area().divide(1e6);
print(polygonOne_km2)

// totoalPixels treecover of polygoneOne
var treeCover = worldCover.eq(10);

// Calculate pixel area (in square meters)
var areaImage = ee.Image.pixelArea();

// Mask only tree-covered pixels
var treeArea = areaImage.updateMask(treeCover);

// Calculate total tree cover area within polygon
var treeStats = treeArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: polygonOne,
  scale: 10,  // WorldCover resolution (10m)
  maxPixels: 1e9
});

var treeAreaKm2 = ee.Number(treeStats.get('area')).divide(1e6);
var totalAreaKm2 = ee.Number(polygonOne.area()).divide(1e6);

// Calculate tree cover percentage
var treePercent = treeAreaKm2.divide(totalAreaKm2).multiply(100);


print('Total Area (km²):', totalAreaKm2);
print('Tree Cover Area (km²):', treeAreaKm2);
print('Tree Cover Percentage:', treePercent); 
