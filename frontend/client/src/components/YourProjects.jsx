// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export default function AllProjects() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [analyses, setAnalyses] = useState({});
//   const [analyzingIds, setAnalyzingIds] = useState(new Set());

//   useEffect(() => {
//     console.log("Analyses:", analyses);
//     console.log("Projects:", projects);
//   }, [analyses, projects]);

//   // Fetch existing analysis (no errors if not found)
//   const fetchAnalysis = async (projId) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:5000/development_plans/${projId}/analysis`
//       );

//       if (res.ok) {
//         const data = await res.json();
//         setAnalyses((prev) => ({ ...prev, [projId]: data }));
//       }
//       // Silently ignore 404 - just means no analysis exists yet
//     } catch (error) {
//       // Silently ignore errors - analysis just doesn't exist
//       console.log(`No analysis for project ${projId}`);
//     }
//   };

//   // Trigger new analysis
//   const runAnalysis = async (projId) => {
//     setAnalyzingIds((prev) => new Set(prev).add(projId));

//     try {
//       const res = await fetch(
//         (`http://127.0.0.1:5000/development_plans/${projId}/analysis`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         })
//       );

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.error || "Analysis failed");
//       }

//       const data = await res.json();
//       setAnalyses((prev) => ({ ...prev, [projId]: data }));

//       // Update project status in local state
//       setProjects((prev) =>
//         prev.map((p) => (p.id === projId ? { ...p, status: data.status } : p))
//       );
//     } catch (error) {
//       console.error("Error running analysis:", error);
//       alert(`Analysis failed: ${error.message}`);
//     } finally {
//       setAnalyzingIds((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(projId);
//         return newSet;
//       });
//     }
//   };

//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/development_plans")
//       .then((res) => res.json())
//       .then((data) => {
//         setProjects(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch projects:", err);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (projects.length > 0) {
//       // Silently check for existing analyses
//       projects.forEach((proj) => {
//         fetchAnalysis(proj.id);
//       });
//     }
//   }, [projects]);

//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this project?")) return;
//     try {
//       await fetch(`http://127.0.0.1:5000/development_plans/${id}`, {
//         method: "DELETE",
//       });
//       setProjects(projects.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const handleEditClick = (proj) => {
//     setEditingId(proj.id);
//     setEditTitle(proj.title);
//     setEditDescription(proj.description);
//   };

//   const handleSave = async (id) => {
//     console.log("Saving plan with ID:", id);

//     try {
//       const res = await fetch(`http://127.0.0.1:5000/development_plans/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: editTitle,
//           description: editDescription,
//         }),
//       });
//       const updatedProject = await res.json();
//       setProjects(projects.map((p) => (p.id === id ? updatedProject : p)));
//       setEditingId(null);
//     } catch (err) {
//       console.error("Save failed:", err);
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//   };

//   if (loading) return <p className="text-center mt-20">Loading projects...</p>;
//   if (!projects.length)
//     return <p className="text-center mt-20">No projects found.</p>;

//   return (
//     <div className=" min-h-screen mb-10 flex flex-col  ">
//       <div className="ml-10 mr-10 container mx-auto px-4 ">
//         <h1 className="mt-3 ml-20 text-2xl font-semi-bold mb-13 bg-[#112C23] text-white text-center border rounded-full p-3 w-42 text-[#112C23]">
//           Total{" "}
//           <span className="text-2xl text-[#FAFCF1]">({projects.length})</span>
//         </h1>

//         <ul className="space-y-4">
//           {projects.map((proj) => {
//             const analysis = analyses[proj.id];
//             const isAnalyzing = analyzingIds.has(proj.id);
//             const hasAnalysis = !!analysis;

//             return (
//               <li
//                 key={proj.id}
//                 className="border mr-5 w-484 border-transparent mx-auto pl-30 pr-30 h-50 rounded-3xl shadow-sm bg-[#C8F8CE] hover:shadow-md transition"
//               >
//                 {/* Header */}

//                 <div className="flex-1 bg-white">
//                   <h2 className="text-[38px] text-[#112C23] font-medium flex items-center gap-2 flex-wrap">
//                     {editingId === proj.id ? (
//                       <input
//                         type="text"
//                         value={editTitle}
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         className="border p-1 rounded w-full"
//                       />
//                     ) : (
//                       proj.title
//                     )}

//                     {/* Status tag */}
//                     <span
//                       className={`px-2  py-1 text-xs font-medium rounded-full w-20 text-center ${
//                         analysis?.status === "PASS"
//                           ? "bg-green-100 text-green-800"
//                           : analysis?.status === "FAIL"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {analysis?.status || "PENDING"}
//                     </span>
//                   </h2>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => toggleExpand(proj.id)}
//                     className="p-1 hover:bg-gray-100 rounded"
//                   >
//                     <svg
//                       className={`w-15 h-15 transform transition border-3  rounded-2xl mt-10${
//                         expandedId === proj.id ? "rotate-180" : ""
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>

//                   {editingId === proj.id ? null : (
//                     <>
//                       <button
//                         onClick={() => handleEditClick(proj)}
//                         className="p-1 hover:bg-gray-100 rounded"
//                       >
//                         <Image
//                           src="/edit-icon.svg"
//                           alt="Edit"
//                           width={60}
//                           height={60}
//                           className="object-contain ml-380"
//                         />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(proj.id)}
//                         className="p-1 hover:bg-gray-100 rounded text-red-600"
//                       >
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                           />
//                         </svg>
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {expandedId === proj.id && (
//                   <div className="mt-1 text-[20px] text-gray-00">
//                     <div className="flex gap-3">
//                       <p className="mt-2 mb-4  border-transparent rounded-full bg-white p-1 w-30 text-center text-sm font-medium text-gray-500">
//                         {proj.type}{" "}
//                       </p>

//                       <p className="mt-2 mb-4 border border-transparent rounded-full bg-white p-1 w-30 text-center text-sm font-medium text-gray-500">
//                         {proj.area_size} km²
//                       </p>
//                     </div>

//                     {editingId === proj.id ? (
//                       <textarea
//                         value={editDescription}
//                         onChange={(e) => setEditDescription(e.target.value)}
//                         className="border p-2 rounded w-full"
//                         rows="3"
//                       />
//                     ) : (
//                       <p className="font-light text-gray-800">
//                         {proj.description}
//                       </p>
//                     )}

//                     {/* Analysis Section */}
//                     {hasAnalysis && (
//                       <div className="mt-12 grid grid-cols-2  gap-3">
//                         <div className="border border-transparent rounded-2xl p-3 bg-green-50">
//                           <h3 className="ml-18 mt-8 font-medium mb-30 text-green-800 text-sm">
//                             FLORA LOSS
//                           </h3>
//                           <p className="text-[70px] ml-18 font-semibold mb-4">
//                             {typeof analysis.flora_loss_pct === "number"
//                               ? analysis.flora_loss_pct.toFixed(2)
//                               : "N/A"}
//                             %
//                           </p>
//                         </div>

//                         <div className="border border-transparent rounded-2xl p-3 bg-orange-50">
//                           <h3 className="font-medium text-orange-800 text-sm">
//                             BUILT AREA <br /> (COMPLETE ZONE)
//                           </h3>
//                           <p className="text-lg font-semibold">
//                             {typeof analysis.new_built_up_pct === "number"
//                               ? analysis.new_built_up_pct.toFixed(2)
//                               : "N/A"}
//                             %
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Save / Cancel buttons */}
//                 {editingId === proj.id && (
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => handleSave(proj.id)}
//                       className="px-4 py-2 bg-[#112C23] text-[#FAFCF1] rounded-full hover:bg-green-700 transition"
//                     >
//                       SAVE
//                     </button>
//                     <button
//                       onClick={handleCancel}
//                       className="px-4 py-2 bg-gray-400 text-gray-100 rounded-full hover:bg-gray-500 transition"
//                     >
//                       CANCEL
//                     </button>
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//       <Footer />
//     </div>
//   );
// }
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

  // --- Fetching Projects & Analyses ---
  const fetchAnalysis = async (projId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/development_plans/${projId}/analysis`
      );
      if (res.ok) {
        const data = await res.json();
        setAnalyses((prev) => ({ ...prev, [projId]: data }));
      }
    } catch (error) {
      console.log(`No analysis for project ${projId}`);
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
      projects.forEach((proj) => fetchAnalysis(proj.id));
    }
  }, [projects]);

  // --- UI handlers ---
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`http://127.0.0.1:5000/development_plans/${id}`, {
      method: "DELETE",
    });
    setProjects(projects.filter((p) => p.id !== id));
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
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleCancel = () => setEditingId(null);

  if (loading) return <p className="text-center mt-20">Loading projects...</p>;
  if (!projects.length)
    return <p className="text-center mt-20">No projects found.</p>;

  return (
    <div className="min-h-screen flex flex-col mb-10">
      <Navbar />
      <div className="mx-auto w-full max-w-10xl px-6">
        <h1 className="mt-3 ml-29 text-2xl text-center font-semibold bg-[#112C23] text-white w-43 rounded-full py-2 mb-12">
          Total <span className="text-[#FAFCF1]">({projects.length})</span>
        </h1>

        <ul className="space-y-6">
          {projects.map((proj) => {
            const analysis = analyses[proj.id];
            const expanded = expandedId === proj.id;
            const editing = editingId === proj.id;

            return (
              <li
                key={proj.id}
                className="bg-[#C8F8CE] rounded-3xl shadow-sm hover:shadow-sm transition-all overflow-hidden"
              >
                {/* HEADER */}
                <div className="p-6 ml-20 flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-4xl mb-6 font-medium text-[#112C23] flex items-center gap-3 flex-wrap">
                      {editing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border border-gray-500 p-1 rounded-2xl w-full"
                        />
                      ) : (
                        proj.title
                      )}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          analysis?.status === "PASS"
                            ? "bg-green-100 text-green-700"
                            : analysis?.status === "FAIL"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {analysis?.status || "PENDING"}
                      </span>
                    </h2>
                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                        {proj.area_size} m²
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                        {proj.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(proj.id)}
                      className="p-2 hover:bg-[#B1FABA] rounded-full"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform ${
                          expanded ? "rotate-180" : ""
                        } text-gray-600`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="butt"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {!editing && (
                      <>
                        <button
                          onClick={() => handleEditClick(proj)}
                          className="p-2 hover:bg-[#515151] rounded-full"
                        >
                          <Image
                            src="/edit-icon.svg"
                            alt="Edit"
                            width={60}
                            height={60}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1 hover:bg-[#F3704F] rounded-3xl text-red-600"
                        >
                          <Image
                            src="/delete-icon.svg"
                            alt="Edit"
                            width={60}
                            height={60}
                          />
                          {/* <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" */}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    expanded
                      ? "max-h-[600px] opacity-100 py-4 px-6"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {editing ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                      className="w-full border p-2 rounded-2xl mb-4"
                    />
                  ) : (
                    <p className="ml-20 mr-80 text-[21px] text-gray-800 mb-6">
                      {proj.description}
                    </p>
                  )}

                  {analysis && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-4">
                      <div className="pl-65 bg-gray-50 rounded-2xl p-6 ">
                        <h3 className="text-gray-700 leading-tight mt-10 font-regular text-[25px] tracking-wide mb-2">
                          NATURE COVER <br />
                          ERADICATION
                        </h3>
                        <p className="text-[95px] mt-25 font-medium text-[#112C23]">
                          {analysis.flora_loss_pct
                            ? `${Number(analysis.flora_loss_pct).toFixed(2)}%`
                            : "—"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-6 pl-65">
                        <h3 className="text-gray-700 leading-tight mt-10 font-regular text-[25px] tracking-wide mb-2">
                          URBANIZED AREA
                        </h3>
                        <p className="text-[95px] mt-25 font-medium text-[#112C23]">
                          {analysis.new_built_up_pct
                            ? `${Number(analysis.new_built_up_pct).toFixed(2)}%`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  )}

                  {editing && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSave(proj.id)}
                        className="px-4 py-2 bg-[#112C23] text-[#FAFCF1] rounded-full hover:bg-green-700 transition"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
                      >
                        CANCEL
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
