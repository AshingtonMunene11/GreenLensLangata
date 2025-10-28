"use client";

import { useState } from "react";
import ResultsComponent from "./Results";

export default function ProjectPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div>
      <ResultsComponent
        planId={selectedPlan.id}
        projectArea={selectedPlan.area_size}
      />
    </div>
  );
}
