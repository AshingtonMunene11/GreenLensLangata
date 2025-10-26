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

  const fetchAnalysis = async (projId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/development_plans/${projId}/analysis`
      );
      if (!res.ok) throw new Error("No analysis found");
      const data = await res.json();

      setAnalyses((prev) => ({ ...prev, [projId]: data }));
    } catch (error) {
      console.error("Error fetching analysis:", error);
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

  if (loading) return <p>Loading projects...</p>;
  if (!projects.length) return <p>No projects found.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Navbar />

      <h1 className="mt-40 text-2xl font-bold mb-6">
        All Projects{" "}
        <span className="text-sm text-gray-500">({projects.length})</span>
      </h1>

      <ul className="space-y-4">
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
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
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      proj.status === "Pass"
                        ? "bg-green-100 text-green-800"
                        : proj.status === "Fail"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {proj.status}
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Dropdown arrow icon */}
                <Image
                  src="public/arrow-button.svg"
                  alt="Toggle description"
                  width={8}
                  height={8}
                  className={` cursor-pointer transform transition ${
                    expandedId === proj.id ? "rotate-180" : ""
                  }`}
                  onClick={() => toggleExpand(proj.id)}
                />

                {editingId === proj.id ? null : (
                  <>
                    {/* Edit button */}
                    <Image
                      src="/edit-icon.svg"
                      alt="Edit"
                      width={8}
                      height={8}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleEditClick(proj)}
                    />

                    {/* Delete button */}
                    <Image
                      src="public/delete-icon.svg"
                      alt="Delete"
                      width={8}
                      height={8}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => handleDelete(proj.id)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Dropdown description */}
            {expandedId === proj.id && (
              <div className="mt-2 text-gray-700">
                {editingId === proj.id ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <p>{proj.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Created at: {new Date(proj.created_at).toLocaleString()}
                </p>
              </div>
            )}

            {/* Analysis  */}
            {analyses[proj.id] ? (
              <div className="flex gap-4 mt-3">
                <div className="flex-1 border rounded-lg p-3 bg-green-50">
                  <h3 className="font-medium text-green-800">🌿 Flora Loss</h3>
                  <p>{analyses[proj.id].flora_loss_percentage?.toFixed(2)}%</p>
                </div>

                <div className="flex-1 border rounded-lg p-3 bg-orange-50">
                  <h3 className="font-medium text-orange-800">Heat Increase</h3>
                  <p>Fetching...</p>
                </div>
              </div>
            ) : (
              <p>Loading analysis</p>
            )}

            {/* Save / Cancel buttons for editing */}
            {editingId === proj.id && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSave(proj.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      
    </div>
    
  );
}
