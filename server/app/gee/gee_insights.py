import ee
ee.Initialize()

# nairobi coords
geom = ee.Geometry.Polygon([[
    [36.80, -1.35],
    [36.82, -1.35],
    [36.82, -1.30],
    [36.80, -1.30],
    [36.80, -1.35]
]])

worldcover = ee.ImageCollection("ESA/WorldCover/v100").first().select("Map")
clipped = worldcover.clip(geom)

# 
stats = clipped.reduceRegion(
    reducer=ee.Reducer.frequencyHistogram(),
    geometry=geom,
    scale=10,
    maxPixels=1e13
    # turn gee stats to python dict
).getInfo()

print(stats)
