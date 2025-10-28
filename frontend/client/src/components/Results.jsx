"use client";

import { useEffect, useState } from "react";

export default function ResultsComponent({ planId, projectArea }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!planId) return;

    let isMounted = true;

    const triggerAnalysis = async () => {
      if (!isMounted) return;

      try {
        setAnalyzing(true);
        console.log(`Triggering POST analysis for plan ${planId}...`);

        const postRes = await fetch(
          `http://127.0.0.1:5000/gee/development_plans/${planId}/analyze`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: 1, // Replace with actual user ID if available
              // userId || 1,
            }),
          }
        );

        if (!postRes.ok) {
          const errorData = await postRes.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to run analysis (${postRes.status})`
          );
        }

        const data = await postRes.json();
        console.log("Analysis complete:", data);

        if (isMounted) {
          setAnalysis(data);
          setLoading(false);
          setAnalyzing(false);
        }
      } catch (err) {
        console.error("Analysis error:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
          setAnalyzing(false);
        }
      }
    };

    const fetchExistingAnalysis = async () => {
      if (!isMounted) return;

      try {
        console.log(`Checking for existing analysis for plan ${planId}...`);

        const getRes = await fetch(
          `http://127.0.0.1:5000/gee/development_plans/${planId}/analyze`
        );

        if (getRes.ok) {
          const data = await getRes.json();
          console.log("Found existing analysis:", data);

          if (isMounted) {
            setAnalysis(data);
            setLoading(false);
          }
        } else if (getRes.status === 404) {
          // No existing analysis found, trigger a new one
          console.log("No analysis found, triggering new analysis...");
          await triggerAnalysis();
        } else {
          throw new Error(`Unexpected response: ${getRes.status}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // If GET fails for any reason, try to trigger new analysis
        if (isMounted) {
          await triggerAnalysis();
        }
      }
    };

    // Start by checking for existing analysis
    fetchExistingAnalysis();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  if (loading || analyzing) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            {analyzing
              ? "Running Earth Engine analysis..."
              : "Loading results..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This may take 10-30 seconds
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto mt-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Analysis Error</p>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  // Extract data from analysis
  const builtUpArea = analysis.built_up_area ?? 0;
  const floraArea = analysis.flora_area ?? 0;
  const builtUpPct = analysis.built_up_pct ?? 0;
  const floraPct = analysis.flora_pct ?? 0;
  const floraLossArea = analysis.flora_loss_area ?? 0;
  const floraLossPct = analysis.flora_loss_pct ?? 0;
  const newBuiltUpPct = analysis.new_built_up_pct ?? 0;
  const polygonArea = analysis.polygon_area ?? 0;
  const recommendation = analysis.recommendation ?? "";
  const status = analysis.status ?? "Pending";

  const isPass = status === "Pass";

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        Land Suitability Results
      </h2>
      <p className="text-gray-600 mb-6">
        Custom generated insights for sustainability.
      </p>

      {/* Current State */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Current Land State
        </h3>
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <p className="flex justify-between">
            <span className="text-gray-600">Polygon area:</span>
            <span className="font-semibold">{polygonArea.toFixed(4)} km²</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Current built-up:</span>
            <span className="font-semibold">{builtUpPct.toFixed(2)}%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Current flora cover:</span>
            <span className="font-semibold">{floraPct.toFixed(2)}%</span>
          </p>
        </div>
      </div>

      {/* Impact Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Development Impact
        </h3>
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <p className="flex justify-between">
            <span className="text-gray-600">Plan area:</span>
            <span className="font-semibold">{projectArea} km²</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Flora loss area:</span>
            <span className="font-semibold text-orange-600">
              {floraLossArea.toFixed(4)} km²
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Flora loss percentage:</span>
            <span className="font-semibold text-orange-600">
              {floraLossPct.toFixed(2)}%
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">New built-up percentage:</span>
            <span className="font-semibold">{newBuiltUpPct.toFixed(2)}%</span>
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-gray-700 font-medium">Assessment:</span>
        <div
          className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
            isPass ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isPass ? "✓ Pass" : "✗ Fail"}
        </div>
      </div>

      {/* Recommendation Section */}
      {recommendation && (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            recommendation.includes("High impact") ||
            recommendation.includes("Over-development")
              ? "bg-red-50 border-red-500"
              : recommendation.includes("Low impact")
              ? "bg-green-50 border-green-500"
              : "bg-yellow-50 border-yellow-500"
          }`}
        >
          <h3 className="font-semibold mb-2 text-gray-800">Recommendation</h3>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      )}
    </div>
  );
}
