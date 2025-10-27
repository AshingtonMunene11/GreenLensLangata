"use client";
import { useState } from "react";
import MapView from "@/components/MapView";
import ai_predictions from "@/components/PolygonInsightsCards";

export default function PolygonInsightsPage() {
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      <MapView onPolygonSelect={setSelectedPolygon} />
      <ai_predictions polygon={selectedPolygon} />
    </div>
  );
}
