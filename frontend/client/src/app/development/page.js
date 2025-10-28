"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanagataAreaAnalysis from "@/components/LanagataAreaAnalysis";
import ResultsComponent from "@/components/Results";
import MapView from "@/components/MapView";
import ProjectForm from "@/components/ProjectForm";

function Developmentpage() {
  const router = useRouter();
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [submittedPlan, setSubmittedPlan] = useState(null);

  const goToYourProjects = () => {
    router.push("/yourprojects");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Navbar />

      <h1 className="ml-35 mr-180 mt-50 font-medium text-[52px] leading-none text-emerald-950">
        Plan your next project responsibly.
      </h1>

      <p className=" mt-8 ml-35 mr-180 text-[22px] font-normal m1-30 my-5 text-emerald-950">
        Explore overlays showing green cover and built up zones. Select a
        location, submit your development plan, and get instant insights on land
        suitability and sustainability.
      </p>

      <button
        onClick={goToYourProjects}
        className="mt-5 bg-emerald-950 hover:bg-[#515151] text-[15px] text-[#FAFCF1] font-semibold ml-35 mb-20 border border-[#515151] rounded-full p-2 w-40 inline-block text-center"
      >
        YOUR PROJECTS
      </button>

      <MapView onPolygonSelect={setSelectedPolygon} />
      
      <ProjectForm
        selectedPolygon={selectedPolygon}
        onPlanCreated={setSubmittedPlan}
        disabled={false}
      />

      {/* Results component - shows automatically after plan is submitted */}
      {submittedPlan && (
        <ResultsComponent
          planId={submittedPlan.id}
          projectArea={submittedPlan.area_size}
        />
      )}

      <LanagataAreaAnalysis />

      <Footer />
    </div>
  );
}

export default Developmentpage;
