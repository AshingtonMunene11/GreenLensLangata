"use client";
import { useState } from "react";
import MapView from "@/components/MapView";

export default function PolygonInsightsPage() {
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      <MapView onPolygonSelect={setSelectedPolygon} />
    </div>
  );
}
