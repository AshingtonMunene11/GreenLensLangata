"use-client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import YourProjects from "@/components/YourProjects";

function YourProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Navbar />
      <h1 className="ml-35 mr-180 mt-50 font-medium text-[52px] leading-none text-emerald-950">
        Review your projects 
      </h1>

      <p className=" mt-8 ml-35 mb-0 mr-180 text-[22px] font-normal m1-30 my-5 text-emerald-950">
        View all your submitted development plans in one place.
        Track their status, edit details, or remove projects that are no longer active.
      </p>
      <YourProjects />

      <Footer />
    </div>
  );
}

export default YourProjectsPage;
