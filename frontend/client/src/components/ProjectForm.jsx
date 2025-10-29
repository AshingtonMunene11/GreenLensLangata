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

      const data = await response.json();

      if (!response.ok) throw new Error("Failed to submit project");

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

  return (
    <div className="w-440 mx-auto ml-7 mr-7 bg-[#112C23] pl-20 pr-20 pt-10 pb-10 rounded-3xl mt-6 border border-gray-200">
      <h2 className="text-[28px] text-[#FAFCF1] text-center mt-3 mb-10 font-semibold">
        What is your project Information?
      </h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form className="grid place-items-center grid-cols-1 md:grid-cols-2  ">
          <label className="block text-white text-sm font-normal mb-2">
            Project Title:
            <Field
              className="w-[90%] mt-2 bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
              name="title"
              type="text"
              placeholder="e.g Fairview Holiday Homes"
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <label className="block text-white text-sm font-normal mb-2">
            Area Size (km²):
            <Field
              className="w-[90%] mt-2 bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
              name="areaSize"
              type="number"
              step="0.001"
              placeholder="1km2 = 1000000m2 (max 3 decimal places)"
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <label className="block text-white text-sm font-normal mb-2">
            Project Type:
            <Field
              className="w-[90%] mt-2 bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
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

          <label className="mt-8 block text-white text-sm font-normal mb-2">
            Short Description:
            <Field
              className="w-120 mt-2 bg-transparent border-2 border-white/90 rounded-3xl px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
              as="textarea"
              name="description"
              rows="3"
              placeholder="Brief project details..."
              style={{ width: "100%", padding: "8px" }}
              disabled={disabled}
            />
          </label>

          <div>
            <button
              className="bg-[#86EE92] mb-3 w-30 hover:bg-green-600 text-[#112C23] px-8 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer"
              type="submit"
              style={{
                background: isSubmitting ? "lightgray" : "light-green",

                padding: "10px",
                border: "none",

                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
              disabled={disabled || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
