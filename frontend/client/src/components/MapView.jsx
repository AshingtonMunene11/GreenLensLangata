import {MapContainer, TileLayer, Polygon, Popup} from "react-leaflet";

import{useEffect, useState} from "react";

// map of nairobi/langata is displayed with clickable polygons
// user clicks on polygon
// backend sends insights based on polygon

export default function() {
    const [polygon, setPolygon] = useState([]);
    const [selectedInsight, setselectedInsight] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/polygons")
        .then((res) => res.json())
        .then((data) => setPolygon(data))
        .catch((err) => console.error("Error loading polygons:", err));
    }, []);

    const handlePolygonClick = async (polygon) => {
        try {
        const res = await fetch(
            `http://127.0.0.1:5000/polygons/${polygon.id}/grading`
        );
        const data = await res.json();
        setSelectedInsight(data);
        } catch (error) {
        console.error("Error fetching grading:", error);
        }
    };

    return (
        <div>
            <MapContainer
            center={[-1.2921, 36.8219]} // Nairobi coord
            zoom={12}
            style ={{height: "100%", width: "100%"}}
            >
            
            <TileLayer >
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"

            </TileLayer>

            {polygons.map((polygon)=> {
                const coords = JSON.parse(polygon.coordinates);
                return (
                    <Polygon>
                        key={polygon.id}
                        positions={coords}
                        eventhandlers={{
                            click: () =>handlePolygonClick(polygon)
                        }}
                        pathOptions ={{
                            color: 
                                selectedpolygon.id === polygon.id? orange: green, weight: 1, }}
                    </Polygon>
                )

            })}


            </MapContainer>
        </div>
    );

    

    
}