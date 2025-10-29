"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function ResultsComponent({ planId, projectArea }) {
  const router = useRouter();
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: 1 }),
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
          console.log("No analysis found, triggering new analysis...");
          await triggerAnalysis();
        } else {
          throw new Error(`Unexpected response: ${getRes.status}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          await triggerAnalysis();
        }
      }
    };

    fetchExistingAnalysis();

    return () => {
      isMounted = false;
    };
  }, [planId]);

  if (loading || analyzing) {
  return (
    <div className="p-6 bg-[#112C23] rounded-2xl shadow-md max-w-xl mx-auto mt-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFFFFF] border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-[#FFFFFF]">
          {analyzing
            ? "Running AI Earth Engine analysis..."
            : "Loading results..."}
        </p>
        <p className="text-sm text-[#FFFFFF] opacity-80 mt-2">
          This may take 10–30 seconds
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

  const floraLossPct = analysis.flora_loss_pct ?? 0;
  const newBuiltUpPct = analysis.new_built_up_pct ?? 0;
  const recommendation = analysis.recommendation ?? "";
  const status = analysis.status ?? "Pending";
  const isPass = status === "Pass";

  const goToYourProjects = () => {
    router.push("/yourprojects");
  };

  return (
    <div className=" mx-auto mt-8 space-y-6 w-[90%] ">
      {/* TOP CARD */}
      <div className="relative bg-[#DEDEDE] rounded-2xl w-full p-8 shadow-md text-gray-800 pt-6 pl-16">
        {/* Top-right button */}
        <button
          onClick={goToYourProjects}
          className="absolute top-6 right-6 bg-emerald-950 hover:bg-[#515151] text-[15px] text-[#FAFCF1] font-semibold border border-[#515151] rounded-full px-4 py-2 w-40 text-center cursor-pointer"
        >
          VIEW PROJECT
        </button>

        <h2 className="text-2xl font-semibold">Land Suitability Results</h2>
        <p className="text-gray-600 mt-1">
          AI generated insights for sustainability
        </p>

        <div className="mt-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
              isPass ? "bg-green-500" : "bg-orange-500"
            }`}
          >
            {isPass ? "PASS" : "FAILED"}
          </span>
        </div>

        {recommendation && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-1">Recommendation</h3>
            <p className="text-gray-700">{recommendation}</p>
          </div>
        )}
      </div>

      {/* BOTTOM ROW Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[90%]">
        {/* Flora Loss */}
        <div className="mb-10 border border-transparent p-6 w-full h-[350px] rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-16 text-[28px] font-light text-emerald-950 uppercase">
            Flora Loss
          </p>
          <p className="pt-20 pb-10 pl-16 text-[90px] font-medium text-emerald-950">
            {floraLossPct.toFixed(0)}%
          </p>
        </div>

        {/* New Built-up */}
        <div className="mb-10 border border-transparent p-6 w-full h-[350px] rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-16 text-[28px] font-light text-emerald-950 uppercase">
            New Built-up
          </p>
          <p className="pt-20 pb-10 pl-16 text-[90px] font-medium text-emerald-950">
            {newBuiltUpPct.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}
