"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically load react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);

// Convert WKT to Leaflet coordinates
function parseWKTPolygon(wkt) {
  const coordsText = wkt.replace("POLYGON((", "").replace("))", "").trim();
  const coords = coordsText.split(",").map((pair) => {
    const [lon, lat] = pair.trim().split(" ").map(Number);
    return [lat, lon];
  });
  return [coords];
}

export default function MapView({ onPolygonSelect }) {
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/polygons")
      .then((res) => res.json())
      .then((data) => setPolygons(data))
      .catch((err) => console.error("Error loading polygons:", err));
  }, []);

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon);
    onPolygonSelect(polygon); // pass polygon back to ProjectForm
  };

  return (
    <div style={{ height: "60vh", width: "100%" }}>
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {polygons.map((polygon) => {
          const coords = parseWKTPolygon(polygon.coordinates);
          return (
            <Polygon
              key={polygon.id}
              positions={coords}
              eventHandlers={{ click: () => handlePolygonClick(polygon) }}
              pathOptions={{
                color: selectedPolygon?.id === polygon.id ? "orange" : "green",
                weight: selectedPolygon?.id === polygon.id ? 3 : 2,
                fillOpacity: 0.4,
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
