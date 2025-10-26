"use client";

import React from "react";
// import MapView from "@/components/MapView";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanagataAreaAnalysis from "@/components/LanagataAreaAnalysis";
// import ProjectForm from "@/components/ProjectForm";
import MapParent from "@/components/MapParent";
import ResultsComponent from "@/components/Results";

// import { MapContainer } from "react-leaflet";

function Developmentpage() {
  const router = useRouter();

  const goToYourProjects = () => {
    router.push("/yourprojects"); // replace with your actual route
  };

  return (
    <div className="min-h-screen bg-[#FAFCF1]">
      <Navbar />
      <h1 className="ml-35 mr-230 mt-50 font-medium text-[52px] leading-none text-emerald-950">
        Plan your next project responsibly.
      </h1>

      <p className="mb-40 mt-6 ml-35 mr-180 text-[22px] font-normal m1-30 my-5 text-emerald-950">
        Explore AI overlays showing green cover and flood zones. Select a
        location, submit your development plan, and get instant insights on land
        suitability and sustainability.
      </p>

      <button
        onClick={goToYourProjects}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700 transition"
      >
        Your Projects
      </button>

      <MapParent />

      <LanagataAreaAnalysis />
      <ResultsComponent />

      <Footer />
    </div>
  );
}

export default Developmentpage;
