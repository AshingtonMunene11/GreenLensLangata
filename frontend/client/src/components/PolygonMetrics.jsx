"use client";

import { useEffect, useState } from "react";

export default function PolygonMetrics({ selectedPolygon }) {
  const [metricsData, setMetricsData] = useState([]);

  useEffect(() => {
    if (!selectedPolygon) return;

    fetch("http://127.0.0.1:5000/data/polygons")
      .then((res) => res.json())
      .then((data) => {
        const polyData = data.find(
          (p) => p.polygon_name === selectedPolygon.polygon_name
        );
        if (polyData) setMetricsData(polyData.metrics);
      })
      .catch((err) => console.error("Error loading polygon metrics:", err));
  }, [selectedPolygon]);

  if (!selectedPolygon || metricsData.length === 0) {
    return (
      <p className="text-gray-500 mt-4">Select a polygon to see metrics.</p>
    );
  }

  // Get all metric keys dynamically (excluding "year")
  const metricKeys = Object.keys(metricsData[0]).filter((k) => k !== "year");

  return (
    <div className="mt-4 space-y-6">
      <p className="text-[38px] text-emerald-950 mt-10 ml-15 ">
        Current Insights and AI Projections
      </p>
      {/* 2025 Row */}
      <div>
        <p className="font-semibold text-lg mb-2">
          {selectedPolygon.polygon_name}{" "}
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 text-sm">
            2025
          </span>
        </p>
        <div className="flex space-x-4">
          {metricsData
            .filter((m) => m.year === 2025)
            .map((m, idx) =>
              metricKeys.map((key) => (
                <div
                  key={`${key}-${idx}`}
                  className="bg-white shadow rounded p-4 w-40 text-center"
                >
                  <p className="text-sm font-medium text-gray-600">
                    {key
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-2xl font-semibold mt-2">
                    {m[key].toFixed(2)}
                  </p>
                </div>
              ))
            )}
        </div>
      </div>

      {/* 2030 Row */}
      <div>
        <div className="flex space-x-4">
          {metricsData
            .filter((m) => m.year === 2030)
            .map((m, idx) =>
              metricKeys.map((key) => (
                <div
                  key={`${key}-${idx}`}
                  className="bg-white shadow rounded p-4 w-40 text-center"
                >
                  <p className="text-sm font-medium text-gray-600">
                    {key
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-2xl font-semibold mt-2">
                    {m[key].toFixed(2)}
                  </p>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}
