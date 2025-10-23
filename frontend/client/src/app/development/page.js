import React from "react";
import MapView from "@/components/MapView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanagataAreaAnalysis from "@/components/LanagataAreaAnalysis";
// import { MapContainer } from "react-leaflet";

function Developmentpage() {
  return (
    <div class="bg-[#FAFCF1]">
      <Navbar />
      <h1 class="ml-35 mr-230 mt-50 font-medium text-[52px] leading-none text-emerald-950">
        Plan your next project responsibly.
      </h1>

      <p class="mb-40 mt-6 ml-35 mr-180 text-[22px] font-normal m1-30 my-5 text-emerald-950">
        Explore AI overlays showing green cover and flood zones. Select a
        location, submit your development plan, and get instant insights on land
        suitability and sustainability.
      </p>

      <MapView />
      <LanagataAreaAnalysis />
      <Footer />
    </div>
  );
}

export default Developmentpage;
