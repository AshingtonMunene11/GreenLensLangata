"use client";

import { useState } from "react";
import ProjectForm from "./ProjectForm";
import ResultsComponent from "./ResultsComponent";

export default function ProjectPage({ selectedPolygon }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div>
      <ProjectForm
        selectedPolygon={selectedPolygon}
        onPlanCreated={plan => setSelectedPlan(plan)}
      />

      {selectedPlan && (
        <ResultsComponent
          planId={selectedPlan.id}
          projectArea={selectedPlan.area_size}
        />
      )}
    </div>
  );
}
