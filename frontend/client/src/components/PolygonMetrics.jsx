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

  const metricKeys = Object.keys(metricsData[0]).filter((k) => k !== "year");

  return (
    <div className="mt-4 space-y-6">
      <h1 className="text-[38px] text-emerald-950 mt-20 ml-15">
        Current Insights and AI Projections
      </h1>

      {/* ZONE NAME */}
      <p className="text-[15px] text-[#515151] font-semibold ml-15 mb-4 border border-[#515151] rounded-full p-2 px-6 max-w-fit inline-block text-center"
      >
      {selectedPolygon.polygon_name?.toUpperCase()}
      </p>

      {/* LATEST (2025) */}
      <p className="text-[15px] text-[#515151] font-semibold ml-15 mb-6 border border-[#515151] rounded-full p-2 w-40 inline-block text-center">
        LATEST (2025)
      </p>

      <div className="flex space-x-8 ml-15 mr-15">
        {metricsData
          .filter((m) => m.year === 2025)
          .map((m, idx) =>
            metricKeys.map((key) => (
              <div
                key={`${key}-${idx}`}
                className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#E8E8E8]"
              >
                <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">
                  {key.replace(/_/g, " ").toUpperCase()}
                </p>
                <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">
                  {m[key] >= 0 ? "+" : ""}
                  {m[key].toFixed(0)}
                  {key.includes("index") ? "c" : "%"}
                </p>
              </div>
            ))
          )}
      </div>

      {/* FUTURE (2030) */}
      <p className="text-[15px] text-[#515151] font-semibold ml-15 mb-4 border border-[#515151] rounded-full p-2 w-40 inline-block text-center">
        2030 PROJECTION
      </p>

      <p className="text-[15px] text-[#515151] font-semibold ml-15 mb-6 border border-[#515151] rounded-full p-2 w-40 inline-block text-center">
        PAST 5 YEARS
      </p>

      <div className="flex space-x-8 ml-15 mr-15">
        {metricsData
          .filter((m) => m.year === 2030)
          .map((m, idx) =>
            metricKeys.map((key) => (
              <div
                key={`${key}-${idx}`}
                className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#E8E8E8]"
              >
                <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">
                  {key.replace(/_/g, " ").toUpperCase()}
                </p>
                <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">
                  {m[key] >= 0 ? "+" : ""}
                  {m[key].toFixed(0)}
                  {key.includes("index") ? "c" : "%"}
                </p>
              </div>
            ))
          )}
      </div>
    </div>
  );
}
