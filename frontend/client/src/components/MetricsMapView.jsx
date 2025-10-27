"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Leaflet dynamic imports
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

// Hardcoded polygon coordinates
const polygonCoords = {
  "Langata Zone 01": [
    [-1.334, 36.785],
    [-1.334, 36.795],
    [-1.324, 36.795],
    [-1.324, 36.785],
    [-1.334, 36.785],
  ],
  "Karen Polygon": [
    [-1.315, 36.71],
    [-1.315, 36.725],
    [-1.3, 36.725],
    [-1.3, 36.71],
    [-1.315, 36.71],
  ],
  "Lavington-Kilimani Zone": [
    [-1.315, 36.76],
    [-1.315, 36.79],
    [-1.295, 36.79],
    [-1.285, 36.775],
    [-1.29, 36.755],
    [-1.315, 36.76],
  ],
  "DandoraNjiru Zone": [
    [-1.27, 36.885],
    [-1.27, 36.905],
    [-1.25, 36.91],
    [-1.235, 36.895],
    [-1.245, 36.875],
    [-1.27, 36.885],
  ],
};

export default function MetricsMapView({ onPolygonSelect }) {
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  // Load metrics JSON from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/data/polygons")
      .then((res) => res.json())
      .then((data) => {
        setPolygons(data);

        // Default selection = first polygon
        if (data.length > 0) {
          setSelectedPolygon(data[0]);
          onPolygonSelect(data[0]);
        }
      })
      .catch((err) => console.error("Error loading polygon metrics:", err));
  }, [onPolygonSelect]);

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon);
    onPolygonSelect(polygon);
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
          const coords = polygonCoords[polygon.polygon_name];
          if (!coords) return null;

          return (
            <Polygon
              key={polygon.polygon_name}
              positions={coords}
              pathOptions={{
                color:
                  selectedPolygon?.polygon_name === polygon.polygon_name
                    ? "orange"
                    : "green",
                weight:
                  selectedPolygon?.polygon_name === polygon.polygon_name
                    ? 3
                    : 2,
                fillOpacity: 0.4,
              }}
              eventHandlers={{
                click: () => handlePolygonClick(polygon),
                mouseover: (e) => {
                  e.target.setStyle({ color: "orange" });
                },
                mouseout: (e) => {
                  e.target.setStyle({
                    color:
                      selectedPolygon?.polygon_name === polygon.polygon_name
                        ? "orange"
                        : "green",
                  });
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
