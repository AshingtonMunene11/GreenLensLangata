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

  const handleCancel = (resetForm) => {
    resetForm();
  };

  return (
    <div className="w-[90%] mx-auto bg-[#112C23] px-16 py-10 rounded-3xl mt-6 border border-gray-200">
      <h2 className="text-[28px] text-[#FAFCF1] text-center mt-3 mb-10 font-semibold">
        What is your project Information?
      </h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ resetForm }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-normal mb-2">
                  Project Title:
                </label>
                <Field
                  className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
                  name="title"
                  type="text"
                  placeholder="e.g Fairview Holiday Homes"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-normal mb-2">
                  Area Size (km²):
                </label>
                <Field
                  className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
                  name="areaSize"
                  type="number"
                  step="0.001"
                  placeholder="1km2 = 1000000m2 (max 3 decimal places)"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-normal mb-2">
                  Project Type:
                </label>
                <Field
                  className="w-[90%] bg-[#112C23] border-2 border-white/90 rounded-full px-6 py-3 text-white focus:outline-none focus:border-[#86EE92] text-sm appearance-none cursor-pointer"
                  as="select"
                  name="type"
                  disabled={disabled}
                >
                  <option value="">Select type</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Public">Public</option>
                </Field>
              </div>

              <div>
                <label className="block text-white text-sm font-normal mb-2">
                  Short Description:
                </label>
                <Field
                  className="w-[90%] bg-transparent border-2 border-white/90 rounded-3xl px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
                  as="textarea"
                  name="description"
                  rows="3"
                  placeholder="Brief project details..."
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                className="bg-[#86EE92] hover:bg-green-500 text-[#112C23] px-8 py-3 rounded-[50.5px] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={disabled || isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
              <button
                type="button"
                onClick={() => handleCancel(resetForm)}
                disabled={isSubmitting}
                className="bg-[#F3704F] hover:bg-orange-600 text-[#FFFFFF] px-8 py-3 rounded-[50.5px] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                CANCEL
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}