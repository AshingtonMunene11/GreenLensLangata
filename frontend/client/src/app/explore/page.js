"use client";
import React from "react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanagataAreaAnalysis from "@/components/LanagataAreaAnalysis";
import MetricMapView from "@/components/MetricsMapView";
import PolygonMetrics from "@/components/PolygonMetrics";

function ExplorePage() {
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Navbar />
      <h1 className="ml-35 mr-180 mt-50 font-medium text-[52px] leading-none text-emerald-950">
        Get insights into
      </h1>
      <h1 className="ml-35 mr-190 mt-2 font-medium text-[52px] leading-none text-emerald-950">
        your environment
      </h1>
      <p className="mb-40 mt-8 ml-35 mr-180 text-[22px] font-normal m1-30 my-5 text-emerald-950">
        Digital tools are transforming environmental insights. Click below to
        explore how geospatial data and AI can reveal trends in tree cover,
        temperature, and rainfall across your area, making it easier to plan and
        protect your local environment.
      </p>
      <MetricMapView onPolygonSelect={setSelectedPolygon} />

      <PolygonMetrics selectedPolygon={selectedPolygon} />
      <LanagataAreaAnalysis />

      <Footer />
    </div>
  );
}

export default ExplorePage;
