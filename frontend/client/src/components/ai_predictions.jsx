"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";

function Aipredictions({ polygonId }) {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (polygonId == null || polygonId === undefined) return;

    const fetchInsights = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/polygon-temperatures-ai/${polygonId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error("Error fetching AI predictions:", err);
        setError(err.message);
      }
    };
    fetchInsights();
  }, [polygonId]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!insights) return <div>Loading insights...</div>;

  return (
    <div className="min-h-screen bg-[#f3f8ed] flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Google Earth Engine Insights
      </h1>

      {/* Zone name */}
      <div className="flex gap-2 mb-6">
        <button className="bg-green-900 text-white text-sm px-4 py-1 rounded-full">
          {insights.name.toUpperCase()}
        </button>
        <button className="bg-green-800 text-white text-sm px-4 py-1 rounded-full opacity-80">
          LATEST
        </button>
        <button className="border border-gray-400 text-sm px-4 py-1 rounded-full text-gray-500 cursor-not-allowed">
          PAST 5 YEARS
        </button>
      </div>

      {/* Row for 2025 stats */}
      <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-3xl">
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">TREE LOSS</h2>
          <p className="text-4xl font-bold text-green-900">+4%</p>
        </div>
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">RAINFALL INDEX</h2>
          <p className="text-4xl font-bold text-green-900">1%</p>
        </div>
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">HEAT INDEX</h2>
          <p className="text-4xl font-bold text-green-900">
            +{insights.max_temp_2025.toFixed(1)}°C
          </p>
        </div>
      </div>

      {/* Row for 2030 predicted stats */}
      <div className="flex gap-2 mb-6">
        <button className="border border-gray-400 text-sm px-4 py-1 rounded-full text-gray-500 cursor-not-allowed">
          LATEST
        </button>
        <button className="bg-green-800 text-white text-sm px-4 py-1 rounded-full opacity-80">
          PREDICTED 2030
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">TREE LOSS</h2>
          <p className="text-4xl font-bold text-green-900">+12%</p>
        </div>
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">RAINFALL INDEX</h2>
          <p className="text-4xl font-bold text-green-900">0%</p>
        </div>
        <div className="bg-gray-200 rounded-2xl flex flex-col items-center justify-center h-40">
          <h2 className="text-sm text-gray-700">HEAT INDEX</h2>
          <p className="text-4xl font-bold text-green-900">
            +{insights.predicted_2030.toFixed(1)}°C
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiPredictions;
