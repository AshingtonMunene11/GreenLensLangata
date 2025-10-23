"use client";

import React from "react";
import { useState, useEffect } from "react";

function LanagataAreaAnalysis() {
  const [percentages, setPercentages] = useState({
    tree_cover: 0,
    grassland: 0,
    built_up: 0,
    water: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/areas/langata/insights")
      .then((res) => res.json())
      .then((data) => {
        if (data.percentages) {
          setPercentages(data.percentages);
        }
      })
      .catch((err) => console.error("Error fetching Langata insights:", err));
  }, []);

  return (
    <div>
      <h1 className="text-[38px] text-emerald-950 mt-20 ml-15 ">
        Lang'ata Area Analysis
      </h1>
      <p className="text-[15px] text-[#515151] font-semibold ml-15 mb-6 border border-[#515151] rounded-full p-2 w-30 inline-block text-center">
        LATEST
      </p>

      <div className=" flex space-x-8 ml-15">
        {/* tree */}
        <div className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">
            TREE COVER
          </p>
          <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">
            {percentages.tree_cover}%
          </p>
        </div>

        <div className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">BUILT-UP</p>
          <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">{percentages.grassland}%</p>
        </div>

        <div className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">GRASS LAND</p>
          <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">{percentages.grassland}%</p>
        </div>

        <div className="mb-10 border border-transparent p-4 w-100 h-100 rounded-3xl bg-[#DEDEDE]">
          <p className="pt-6 pl-6 text-[28px] font-light text-emerald-950">WATER COVER</p>
          <p className="pt-35 pb-30 pl-6 text-[90px] font-medium text-emerald-950">{percentages.water}%</p>
        </div>
      </div>
    </div>
  );
}

export default LanagataAreaAnalysis;
