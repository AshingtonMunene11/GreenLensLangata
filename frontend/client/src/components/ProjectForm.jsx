"use client";

import { Formik, Form, Field } from "formik";
import { useState } from "react";

export default function ProjectForm({
  selectedPolygon,
  onPlanCreated,
  disabled,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPlan, setSubmittedPlan] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const initialValues = {
    title: "",
    areaSize: "",
    type: "",
    description: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (!selectedPolygon) {
      alert("Please click on a polygon(shape) on the map.");
      return;
    }

    setIsSubmitting(true);

    const { title, description, type, areaSize } = values;

    const formData = {
      title,
      description,
      type,
      area_size: parseFloat(areaSize),
      polygon_id: selectedPolygon.id,
      geojson_coords: selectedPolygon.coordinates,
      results: "Pending analysis",
      status: "Pending",
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/development_plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit project");

      const data = await response.json();
      console.log("Server response:", data);

      setSubmittedPlan(data);
      if (onPlanCreated) onPlanCreated(data);

      alert("Project submitted!");
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was a problem submitting your project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async (planId) => {
    if (!submittedPlan?.id) {
      alert("Please submit a project first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/development_plans/analyze/${planId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ development_plan_id: planId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");

      console.log("Analysis result:", data);
      setAnalysisResult(data);
      alert("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      alert(error.message || "There was a problem with the analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-428 mx-auto bg-[#112C23] p-6 rounded-3xl mt-6 border border-gray-200">
      <h2 className="text-[28px] text-white text-center mt-5 mb-10 font-semibold">
        What is your project Information?
      </h2>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>
            Project Title:
            <Field
              name="title"
              type="text"
              placeholder="Enter project title"
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <label>
            Area Size (km²):
            <Field
              name="areaSize"
              type="number"
              step="0.01"
              placeholder="e.g. 2.5"
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <label>
            Project Type:
            <Field
              as="select"
              name="type"
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            >
              <option value="">Select type</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Public">Public</option>
            </Field>
          </label>

          <label>
            Short Description:
            <Field
              as="textarea"
              name="description"
              rows="3"
              placeholder="Brief project details..."
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <button
            type="submit"
            style={{
              background: isSubmitting ? "lightgray" : "green",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      </Formik>

      {submittedPlan && (
        <button
          onClick={() => handleAnalyze(submittedPlan.id)}
          style={{
            background: isAnalyzing ? "gray" : "#007BFF",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            marginTop: "15px",
            width: "100%",
            cursor: isAnalyzing ? "not-allowed" : "pointer",
          }}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Plan"}
        </button>
      )}

      {/* Spinner while analyzing */}
      {isAnalyzing && (
        <div className="mt-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-yellow-600 font-medium">Analyzing...</span>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult &&
        typeof analysisResult.built_up_area === "number" &&
        typeof analysisResult.flora_area === "number" &&
        typeof analysisResult.built_up_pct === "number" &&
        typeof analysisResult.flora_pct === "number" && (
          <div className="mt-4 bg-white rounded-lg p-4 text-black">
            <h3 className="text-lg font-bold mb-2">Analysis Results</h3>
            <p>Built-up Area: {analysisResult.built_up_area.toFixed(2)} km²</p>
            <p>Flora Area: {analysisResult.flora_area.toFixed(2)} km²</p>
            <p>Built-up %: {analysisResult.built_up_pct.toFixed(2)}%</p>
            <p>Flora %: {analysisResult.flora_pct.toFixed(2)}%</p>
          </div>
        )}
    </div>
  );
}
