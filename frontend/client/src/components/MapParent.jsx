"use client";

import { useState } from "react";
import MapView from "./MapView";
import ProjectForm from "./ProjectForm";

export default function ProjectPage() {
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  return (
    <div>
      <div>
        <MapView onPolygonSelect={setSelectedPolygon} />
      </div>

      <div>
        <ProjectForm selectedPolygon={selectedPolygon} />
      </div>
    </div>
  );
}
