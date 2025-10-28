"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [analyses, setAnalyses] = useState({});
  const [analyzingIds, setAnalyzingIds] = useState(new Set());

  useEffect(() => {
    console.log("Analyses:", analyses);
    console.log("Projects:", projects);
  }, [analyses, projects]);

  // Fetch existing analysis (no errors if not found)
  const fetchAnalysis = async (projId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/development_plans/${projId}/analysis`
      );

      if (res.ok) {
        const data = await res.json();
        setAnalyses((prev) => ({ ...prev, [projId]: data }));
      }
      // Silently ignore 404 - just means no analysis exists yet
    } catch (error) {
      // Silently ignore errors - analysis just doesn't exist
      console.log(`No analysis for project ${projId}`);
    }
  };

  // Trigger new analysis
  const runAnalysis = async (projId) => {
    setAnalyzingIds((prev) => new Set(prev).add(projId));

    try {
      const res = await fetch(
        (`http://127.0.0.1:5000/development_plans/${projId}/analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalyses((prev) => ({ ...prev, [projId]: data }));

      // Update project status in local state
      setProjects((prev) =>
        prev.map((p) => (p.id === projId ? { ...p, status: data.status } : p))
      );
    } catch (error) {
      console.error("Error running analysis:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setAnalyzingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(projId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/development_plans")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      // Silently check for existing analyses
      projects.forEach((proj) => {
        fetchAnalysis(proj.id);
      });
    }
  }, [projects]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/development_plans/${id}`, {
        method: "DELETE",
      });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditClick = (proj) => {
    setEditingId(proj.id);
    setEditTitle(proj.title);
    setEditDescription(proj.description);
  };

  const handleSave = async (id) => {
    console.log("Saving plan with ID:", id);

    try {
      const res = await fetch(`http://127.0.0.1:5000/development_plans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      const updatedProject = await res.json();
      setProjects(projects.map((p) => (p.id === id ? updatedProject : p)));
      setEditingId(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) return <p className="text-center mt-20">Loading projects...</p>;
  if (!projects.length)
    return <p className="text-center mt-20">No projects found.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <div className="container mx-auto px-4">
        <h1 className="mt-20 text-2xl font-bold mb-6">
          Total{" "}
          <span className="text-sm text-gray-500">({projects.length})</span>
        </h1>

        <ul className="space-y-4">
          {projects.map((proj) => {
            const analysis = analyses[proj.id];
            const isAnalyzing = analyzingIds.has(proj.id);
            const hasAnalysis = !!analysis;

            return (
              <li
                key={proj.id}
                className="border border-transparent p-4 rounded-3xl shadow-sm bg-gray-200 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                      {editingId === proj.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        proj.title
                      )}

                      {/* Status tag */}
                      <span
                        className={`px-2  py-1 text-xs font-medium rounded-full w-20 text-center ${
                          analysis?.status === "PASS"
                            ? "bg-green-100 text-green-800"
                            : analysis?.status === "FAIL"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {analysis?.status || "PENDING"}
                      </span>
                    </h2>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(proj.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg
                        className={`w-5 h-5 transform transition ${
                          expandedId === proj.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {editingId === proj.id ? null : (
                      <>
                        <button
                          onClick={() => handleEditClick(proj)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                {expandedId === proj.id && (
                  <div className="mt-3 text-gray-700">
                    {editingId === proj.id ? (
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="border p-2 rounded w-full"
                        rows="3"
                      />
                    ) : (
                      <p>{proj.description}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Type: {proj.type} | Area: {proj.area_size} km²
                    </p>
                  </div>
                )}

                {/* Analysis Section */}
                {hasAnalysis && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="border rounded-lg p-3 bg-green-50">
                      <h3 className="font-medium text-green-800 text-sm">
                        FLORA LOSS
                      </h3>
                      <p className="text-lg font-semibold">
                        {typeof analysis.flora_loss_pct === "number"
                          ? analysis.flora_loss_pct.toFixed(2)
                          : "N/A"}
                        %
                      </p>
                    </div>

                    <div className="border rounded-lg p-3 bg-orange-50">
                      <h3 className="font-medium text-orange-800 text-sm">
                        BUILT AREA <br /> (COMPLETE ZONE)
                      </h3>
                      <p className="text-lg font-semibold">
                        {typeof analysis.new_built_up_pct === "number"
                          ? analysis.new_built_up_pct.toFixed(2)
                          : "N/A"}
                        %
                      </p>
                    </div>
                  </div>
                )}

                {/* Save / Cancel buttons */}
                {editingId === proj.id && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSave(proj.id)}
                      className="px-4 py-2 bg-[#112C23] text-[#FAFCF1] rounded-full hover:bg-green-700 transition"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-400 text-gray-100 rounded-full hover:bg-gray-500 transition"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
