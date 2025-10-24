"use client";

import { Formik, Form, Field } from "formik";

export default function ProjectForm({ selectedPolygon }) {
  // Starting values for your form
  const initialValues = {
    title: "",
    areaSize: "",
    type: "",
    description: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!selectedPolygon) {
      alert("Please click on a polygon on the map");
      return;
    }

    // Combine the form data with the polygon ID
    const formData = {
      ...values,
      polygon_id: selectedPolygon.id,
    };

    console.log("Form submitted:", formData);

    //send data
    fetch("http://127.0.0.1:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Project submitted!");
    resetForm();
  };

  return (
    <div className="w-428 mx-auto bg-[#112C23] p-6 rounded-3xl mt-6 border border-gray-200">
      <h2 className="text-[28px] text-white text-center mt-5 mb-10 font-semibold ">
        What is your project Information?
      </h2>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Project Title */}
          <label>
            Project Title:
            <Field
              name="title"
              type="text"
              placeholder="Enter project title"
              style={{ width: "100%", padding: "8px" }}
            />
          </label>

          {/* Area Size */}
          <label>
            Area Size (km²):
            <Field
              name="areaSize"
              type="number"
              step="0.01"
              placeholder="e.g. 2.5"
              style={{ width: "100%", padding: "8px" }}
            />
          </label>

          <label>
            Project Type:
            <Field
              as="select"
              name="type"
              style={{ width: "100%", padding: "8px" }}
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
            />
          </label>

          <button
            type="submit"
            style={{
              background: "green",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}
